import { app } from "./app.js";
import { connectDb } from "./config/db.js";
import { env } from "./config/env.js";
import { redis } from "./config/redis.js";
import { logger } from "./services/logger.service.js";

async function start() {
  try {
    await connectDb();
    await redis.ping();

    app.listen(env.port);
  } catch (error) {
    logger.error({ message: `Startup failed: ${error?.message || "Unknown error"}` });
    process.exit(1);
  }
}

start();
