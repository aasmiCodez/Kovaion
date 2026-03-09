import crypto from "crypto";
import jwt from "jsonwebtoken";
import { redis } from "../config/redis.js";
import { User } from "../models/User.js";
import { env } from "../config/env.js";
import { comparePassword, hashPassword } from "../utils/password.js";
import {
  blacklistAccessToken,
  createAccessToken,
  createRefreshToken,
  isRefreshTokenActive,
  revokeRefreshToken,
} from "../services/token.service.js";
import { sanitizeUser } from "../utils/sanitizeUser.js";
import { auditLog } from "../services/logger.service.js";
import httpStatusCodes from "http-status";

function setAuthCookies(res, accessToken, refreshToken) {
  const common = {
    httpOnly: true,
    secure: env.isProd,
    sameSite: "strict",
  };

  res.cookie("accessToken", accessToken, {
    ...common,
    maxAge: 15 * 60 * 1000,
  });

  res.cookie("refreshToken", refreshToken, {
    ...common,
    maxAge: env.refreshTokenTtlDays * 24 * 60 * 60 * 1000,
  });
}

function clearAuthCookies(res) {
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
}

export async function forgotPassword(req, res, next) {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (user) {
      const resetToken = crypto.randomBytes(32).toString("hex");
      await redis.setex(`pwdreset:${resetToken}`, 15 * 60, user._id.toString());
      auditLog({
        actorId: user._id.toString(),
        action: "password_reset_requested",
        targetId: user._id.toString(),
        ip: req.ip,
      });

      // For local demo/testing only. In production, send token via trusted email channel.
      if (!env.isProd) {
        return res.json({
          message:
            "If the account exists, password reset instructions have been generated.",
          resetToken,
          expiresInMinutes: 15,
        });
      }
    }

    res.json({
      message:
        "If the account exists, password reset instructions have been generated.",
    });
  } catch (error) {
    next(error);
  }
}

export async function resetPassword(req, res, next) {
  try {
    const { token, password } = req.body;
    const userId = await redis.get(`pwdreset:${token}`);

    if (!userId) {
      return next({ status: 400, message: "Invalid or expired reset token" });
    }

    const user = await User.findById(userId);
    if (!user) {
      await redis.del(`pwdreset:${token}`);
      return next({ status: 400, message: "Invalid or expired reset token" });
    }

    user.password = await hashPassword(password);
    await user.save();
    await redis.del(`pwdreset:${token}`);

    auditLog({
      actorId: user._id.toString(),
      action: "password_reset_completed",
      targetId: user._id.toString(),
      ip: req.ip,
    });

    res.json({ message: "Password has been reset successfully" });
  } catch (error) {
    next(error);
  }
}

export async function register(req, res, next) {
  try {
    const { name, email, password, role } = req.body;

    const exists = await User.exists({ email });
    if (exists) {
      return next({ status: 409, message: "Email already in use" });
    }

    const user = await User.create({
      name,
      email,
      password: await hashPassword(password),
      role,
    });

    auditLog({
      actorId: req.user?.id || user._id.toString(),
      action: "user_created",
      targetId: user._id.toString(),
      ip: req.ip,
    });

    res.status(201).json({ user: sanitizeUser(user) });
  } catch (error) {
    next(error);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return next({
        status: httpStatusCodes.UNAUTHORIZED,
        message: "Invalid credentials",
      });
    }

    const validPassword = await comparePassword(password, user.password);
    if (!validPassword) {
      return next({
        status: httpStatusCodes.UNAUTHORIZED,
        message: "Invalid credentials",
      });
    }

    const access = createAccessToken(user);
    const refresh = await createRefreshToken(user);

    setAuthCookies(res, access.token, refresh.token);

    auditLog({
      actorId: user._id.toString(),
      action: "login_success",
      targetId: user._id.toString(),
      ip: req.ip,
    });

    res.json({ user: sanitizeUser(user) });
  } catch (error) {
    next(error);
  }
}

export async function refresh(req, res, next) {
  try {
    const token = req.cookies?.refreshToken;
    if (!token) {
      return next({
        status: httpStatusCodes.UNAUTHORIZED,
        message: "Refresh token required",
      });
    }

    const payload = jwt.verify(token, env.jwtRefreshSecret);
    if (payload.type !== "refresh") {
      return next({
        status: httpStatusCodes.UNAUTHORIZED,
        message: "Invalid refresh token",
      });
    }

    const active = await isRefreshTokenActive(payload.jti);
    if (!active) {
      return next({
        status: httpStatusCodes.UNAUTHORIZED,
        message: "Refresh token revoked",
      });
    }

    const user = await User.findById(payload.sub);
    if (!user) {
      return next({
        status: httpStatusCodes.UNAUTHORIZED,
        message: "User no longer exists",
      });
    }

    await revokeRefreshToken(payload.jti);
    const newAccess = createAccessToken(user);
    const newRefresh = await createRefreshToken(user);
    setAuthCookies(res, newAccess.token, newRefresh.token);

    auditLog({
      actorId: user._id.toString(),
      action: "token_refreshed",
      targetId: user._id.toString(),
      ip: req.ip,
    });

    res.json({ user: sanitizeUser(user) });
  } catch (_error) {
    next({
      status: httpStatusCodes.UNAUTHORIZED,
      message: "Invalid or expired refresh token",
    });
  }
}

export async function logout(req, res, next) {
  try {
    const accessToken = req.cookies?.accessToken;
    const refreshToken = req.cookies?.refreshToken;

    if (accessToken) {
      const payload = jwt.verify(accessToken, env.jwtAccessSecret);
      const ttl = Math.max(payload.exp - Math.floor(Date.now() / 1000), 1);
      await blacklistAccessToken(payload.jti, ttl);
    }

    if (refreshToken) {
      const payload = jwt.verify(refreshToken, env.jwtRefreshSecret);
      await revokeRefreshToken(payload.jti);
    }

    clearAuthCookies(res);

    auditLog({
      actorId: req.user?.id || "unknown",
      action: "logout",
      targetId: req.user?.id || "unknown",
      ip: req.ip,
    });

    res.json({ message: "Logged out successfully" });
  } catch (error) {
    next(error);
  }
}

export async function me(req, res, next) {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return next({
        status: httpStatusCodes.NOT_FOUND,
        message: "User not found",
      });
    }
    res.json({ user: sanitizeUser(user) });
  } catch (error) {
    next(error);
  }
}
