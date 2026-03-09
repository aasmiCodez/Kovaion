import { z } from "zod";
import { passwordSchema } from "../utils/password.js";

export const signupSchema = z.object({
  name: z.string().min(2).max(60),
  email: z.string().email().max(120),
  password: passwordSchema,
  role: z.enum(["admin", "user"]).default("user"),
});

export const loginSchema = z.object({
  email: z.string().email().max(120),
  password: z.string().min(1),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email().max(120),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(20).max(256),
  password: passwordSchema,
});

export const updateUserSchema = z
  .object({
    name: z.string().min(2).max(60).optional(),
    email: z.string().email().max(120).optional(),
    role: z.enum(["admin", "user"]).optional(),
  })
  .refine((value) => Object.keys(value).length > 0, {
    message: "At least one field is required",
  });
