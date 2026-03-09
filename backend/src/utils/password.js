import bcrypt from "bcryptjs";
import { z } from "zod";
import { env } from "../config/env.js";

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{10,128}$/;

export const passwordSchema = z
  .string()
  .regex(passwordRegex, "Password must be 10+ chars with uppercase, lowercase, number, and symbol");

export async function hashPassword(plainText) {
  return bcrypt.hash(plainText, env.bcryptSaltRounds);
}

export async function comparePassword(plainText, hash) {
  return bcrypt.compare(plainText, hash);
}
