import { User } from "../models/User.js";
import { hashPassword } from "../utils/password.js";
import { sanitizeUser } from "../utils/sanitizeUser.js";
import { auditLog } from "../services/logger.service.js";
import httpStatus from "http-status";

export async function listUsers(req, res, next) {
  try {
    if (req.user.role === "admin") {
      const users = await User.find({}).sort({ createdAt: -1 });
      return res.json({ users: users.map(sanitizeUser) });
    }

    const own = await User.findById(req.user.id);
    return res.json({ users: own ? [sanitizeUser(own)] : [] });
  } catch (error) {
    next(error);
  }
}

export async function getUserById(req, res, next) {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return next({ status: httpStatus.NOT_FOUND, message: "User not found" });
    }

    res.json({ user: sanitizeUser(user) });
  } catch (error) {
    next(error);
  }
}

export async function createUser(req, res, next) {
  try {
    const { name, email, password, role } = req.body;

    const exists = await User.exists({ email });
    if (exists) {
      return next({
        status: httpStatus.CONFLICT,
        message: "Email already in use",
      });
    }

    const user = await User.create({
      name,
      email,
      role,
      password: await hashPassword(password),
    });

    auditLog({
      actorId: req.user.id,
      action: "admin_create_user",
      targetId: user._id.toString(),
      ip: req.ip,
    });

    res.status(201).json({ user: sanitizeUser(user) });
  } catch (error) {
    next(error);
  }
}

export async function updateUser(req, res, next) {
  try {
    const { name, email, role } = req.body;

    const user = await User.findById(req.params.id);
    if (!user) {
      return next({ status: httpStatus.NOT_FOUND, message: "User not found" });
    }

    if (name) user.name = name;
    if (email) user.email = email;
    if (role) user.role = role;

    await user.save();

    auditLog({
      actorId: req.user.id,
      action: "admin_update_user",
      targetId: user._id.toString(),
      ip: req.ip,
    });

    res.json({ user: sanitizeUser(user) });
  } catch (error) {
    if (error?.code === 11000) {
      return next({
        status: httpStatus.CONFLICT,
        message: "Email already in use",
      });
    }
    next(error);
  }
}
