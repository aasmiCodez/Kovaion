import winston from "winston";
import { AuditLog } from "../models/AuditLog.js";

export const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [new winston.transports.Console()],
});

export function auditLog({ actorId, action, targetId, ip, meta = {} }) {
  const event = {
    type: "audit",
    actorId: actorId || "unknown",
    action: action || "unknown_action",
    targetId: targetId || "unknown_target",
    ip: ip || "unknown",
    meta,
  };

  // Persist audit events for centralized retrieval/reporting.
  void AuditLog.create({
    actorId: event.actorId,
    action: event.action,
    targetId: event.targetId,
    ip: event.ip,
    meta: event.meta,
  }).catch((error) => {
    logger.error({ message: `Failed to persist audit event: ${error.message}` });
  });
}
