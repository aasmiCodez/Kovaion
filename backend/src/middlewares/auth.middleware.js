import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { isAccessTokenBlacklisted } from "../services/token.service.js";
import httpStatus from "http-status";
import { logger } from "../services/logger.service.js";

export async function requireAuth(req, _res, next) {
  try {
    const token = req.cookies?.accessToken;
    if (!token) {
      logger.warn({ message: "Authentication denied: missing access token" });
      return next({
        status: httpStatus.UNAUTHORIZED,
        message: "Authentication required",
      });
    }

    const payload = jwt.verify(token, env.jwtAccessSecret);
    if (payload.type !== "access") {
      logger.warn({ message: "Authentication denied: invalid access token type" });
      return next({
        status: httpStatus.UNAUTHORIZED,
        message: "Invalid access token",
      });
    }

    const blacklisted = await isAccessTokenBlacklisted(payload.jti);
    if (blacklisted) {
      logger.warn({ message: "Authentication denied: token is revoked" });
      return next({
        status: httpStatus.UNAUTHORIZED,
        message: "Token revoked",
      });
    }

    req.user = {
      id: payload.sub,
      role: payload.role,
      jti: payload.jti,
      exp: payload.exp,
    };
    next();
  } catch (_error) {
    logger.warn({ message: "Authentication denied: invalid or expired token" });
    next({
      status: httpStatus.UNAUTHORIZED,
      message: "Invalid or expired token",
    });
  }
}
