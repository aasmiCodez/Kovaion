import httpStatus from "http-status";
import { logger } from "../services/logger.service.js";
export function requireSelfOrAdmin(paramName = "id") {
  return (req, _res, next) => {
    if (!req.user) {
      logger.warn({ message: "Authorization denied: missing user context" });
      return next({
        status: httpStatus.UNAUTHORIZED,
        message: "Authentication required",
      });
    }

    const targetId = req.params[paramName];
    if (req.user.role === "admin" || req.user.id === targetId) {
      return next();
    }

    logger.warn({ message: "Authorization denied: not self or admin" });
    return next({
      status: httpStatus.FORBIDDEN,
      message: "Not allowed to access this resource",
    });
  };
}
