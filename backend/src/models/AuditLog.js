import mongoose from "mongoose";

const auditLogSchema = new mongoose.Schema(
  {
    actorId: { type: String, required: true, trim: true, maxlength: 200 },
    action: { type: String, required: true, trim: true, maxlength: 200 },
    targetId: { type: String, required: true, trim: true, maxlength: 200 },
    ip: { type: String, default: "unknown", trim: true, maxlength: 100 },
    meta: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

auditLogSchema.index({ createdAt: -1 });
auditLogSchema.index({ actorId: 1, createdAt: -1 });
auditLogSchema.index({ action: 1, createdAt: -1 });

export const AuditLog = mongoose.model("AuditLog", auditLogSchema);
