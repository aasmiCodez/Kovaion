import express from "express";
import {
  getAccessPolicies,
  getAuditTrail,
} from "../controllers/security.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.use(requireAuth);
router.get("/audit-trail", getAuditTrail);
router.get("/access-policies", getAccessPolicies);

export default router;
