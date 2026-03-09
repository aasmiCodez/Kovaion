import { logger } from "../services/logger.service.js";
import httpStatus from "http-status";

export function notFound(_req, _res, next) {
  logger.warn({ message: "Route not found" });
  next({ status: httpStatus.NOT_FOUND, message: "Route not found" });
}

export function errorHandler(err, req, res, _next) {
  const status = err.status || httpStatus.INTERNAL_SERVER_ERROR;
  const message = status >= httpStatus.INTERNAL_SERVER_ERROR ? "Internal server error" : err.message;

  if (status >= httpStatus.BAD_REQUEST && status < httpStatus.INTERNAL_SERVER_ERROR) {
    logger.warn({ message: `Request failed: ${message}` });
  }

  if (status >= httpStatus.INTERNAL_SERVER_ERROR) {
    logger.error({ message: `Internal server error: ${err?.message || "Unknown error"}` });
  }

  res.status(status).json({
    message,
    ...(process.env.NODE_ENV === "development" && status >= 500
      ? { debug: err?.message }
      : {}),
  });
}
