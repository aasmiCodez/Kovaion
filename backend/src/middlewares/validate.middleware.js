import httpStatus from "http-status";
import { logger } from "../services/logger.service.js";
export function validate(schema, where = "body") {
  return (req, _res, next) => {
    const parsed = schema.safeParse(req[where]);

    if (!parsed.success) {
      logger.warn({ message: "Validation failed" });
      return next({ status: httpStatus.BAD_REQUEST, message: parsed.error.issues.map((issue) => issue.message).join(", ") });
    }

    req[where] = parsed.data;
    next();
  };
}
