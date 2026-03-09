import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import { env } from "./config/env.js";
import authRoutes from "./routes/auth.routes.js";
import securityRoutes from "./routes/security.routes.js";
import userRoutes from "./routes/user.routes.js";
import { errorHandler, notFound } from "./middlewares/error.middleware.js";
import { sanitizeRequest } from "./middlewares/sanitize.middleware.js";

export const app = express();

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || origin === env.clientOrigin) {
        return callback(null, true);
      }
      return callback(new Error("Blocked by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  }),
);

app.use(helmet());
app.use(express.json({ limit: "10kb" }));
app.use(cookieParser());
app.use(sanitizeRequest);

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/security", securityRoutes);

app.use(notFound);
app.use(errorHandler);
