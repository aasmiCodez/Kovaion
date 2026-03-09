import mongoose from "mongoose";
import { env } from "./env.js";

export async function connectDb() {
  mongoose.set("sanitizeFilter", true);
  await mongoose.connect(env.mongoUri);
}
