import { auditLog } from "../services/logger.service.js";
import { AuditLog } from "../models/AuditLog.js";

const accessPoliciesData = [
  {
    id: "POL-01",
    policy: "User Self-Read",
    scope: "users/:id",
    rule: "Allow only if requester._id === target._id",
    status: "Active",
  },
  {
    id: "POL-02",
    policy: "Admin Full User Management",
    scope: "users/*",
    rule: "Allow admin to create/read/update all users",
    status: "Active",
  },
  {
    id: "POL-03",
    policy: "Login Rate Limit",
    scope: "auth/login",
    rule: "Max 10 attempts per 10 minutes per IP",
    status: "Active",
  },
  {
    id: "POL-04",
    policy: "Token Revocation",
    scope: "auth/logout + refresh",
    rule: "Blacklist access JWT + invalidate refresh token in Redis",
    status: "Active",
  },
];

export async function getAuditTrail(req, res, next) {
  try {
    const requestedLimit = Number(req.query.limit || 50);
    const limit = Number.isFinite(requestedLimit)
      ? Math.min(Math.max(Math.trunc(requestedLimit), 1), 200)
      : 50;

    const events = await AuditLog.find({})
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    auditLog({
      actorId: req.user.id,
      action: "view_audit_trail",
      targetId: "audit_trail",
      ip: req.ip,
      meta: { resultCount: events.length, limit },
    });

    res.json({
      events: events.map((event) => ({
        id: event._id,
        actorId: event.actorId,
        action: event.action,
        targetId: event.targetId,
        ip: event.ip,
        meta: event.meta,
        createdAt: event.createdAt,
      })),
    });
  } catch (error) {
    next(error);
  }
}

export async function getAccessPolicies(req, res, next) {
  try {
    auditLog({
      actorId: req.user.id,
      action: "view_access_policies",
      targetId: "access_policies",
      ip: req.ip,
    });

    res.json({ policies: accessPoliciesData });
  } catch (error) {
    next(error);
  }
}
