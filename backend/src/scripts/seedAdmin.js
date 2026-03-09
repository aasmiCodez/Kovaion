import readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import { connectDb } from "../config/db.js";
import { User } from "../models/User.js";
import { hashPassword } from "../utils/password.js";
import "../config/env.js";

async function seedAdmin() {
  const rl = readline.createInterface({ input, output });
  try {
    await connectDb();

    const name = (await rl.question("Admin name: ")).trim();
    const email = (await rl.question("Admin email: ")).trim().toLowerCase();
    const password = (await rl.question("Admin password: ")).trim();

    if (!name || !email || !password) {
      throw new Error("All fields are required");
    }

    const existing = await User.findOne({ email });
    if (existing) {
      throw new Error("Admin email already exists");
    }

    const user = await User.create({
      name,
      email,
      role: "admin",
      password: await hashPassword(password),
    });

    console.log(`Admin created: ${user.email} (${user._id})`);
    rl.close();
    process.exit(0);
  } finally {
    rl.close();
  }
}

seedAdmin().catch((error) => {
  console.error("Failed to seed admin:", error.message);
  process.exit(1);
});
