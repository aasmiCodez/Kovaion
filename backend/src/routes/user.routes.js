import express from "express";
import {
  createUser,
  getUserById,
  listUsers,
  updateUser,
} from "../controllers/user.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { requireSelfOrAdmin } from "../middlewares/objectAuth.middleware.js";
import { requireRole } from "../middlewares/rbac.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { signupSchema, updateUserSchema } from "../utils/validators.js";

const router = express.Router();

router.use(requireAuth);
router.get("/", listUsers);
router.get("/:id", requireSelfOrAdmin("id"), getUserById);
router.post("/", requireRole("admin"), validate(signupSchema), createUser);
router.put(
  "/:id",
  requireRole("admin"),
  validate(updateUserSchema),
  updateUser,
);

export default router;
