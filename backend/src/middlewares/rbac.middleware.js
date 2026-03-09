import httpStatus from "http-status";
import { logger } from "../services/logger.service.js";
export function requireRole(...roles) {
  return (req, _res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      logger.warn({ message: "Authorization denied: insufficient role" });
      return next({ status: httpStatus.FORBIDDEN, message: "Forbidden" });
    }
    next();
  };
}
