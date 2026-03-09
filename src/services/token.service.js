import crypto from "crypto";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { redis } from "../config/redis.js";

function parseExpiryToSeconds(value) {
  const match = /^([0-9]+)([smhd])$/.exec(value);
  if (!match) return 900;
  const amount = Number(match[1]);
  const unit = match[2];
  const unitMap = { s: 1, m: 60, h: 3600, d: 86400 };
  return amount * unitMap[unit];
}

export function createAccessToken(user) {
  const jti = crypto.randomUUID();
  const token = jwt.sign(
    { sub: user._id.toString(), role: user.role, type: "access", jti },
    env.jwtAccessSecret,
    { expiresIn: env.accessTokenTtl }
  );
  return { token, jti, ttlSeconds: parseExpiryToSeconds(env.accessTokenTtl) };
}

export async function createRefreshToken(user) {
  const jti = crypto.randomUUID();
  const token = jwt.sign(
    { sub: user._id.toString(), role: user.role, type: "refresh", jti },
    env.jwtRefreshSecret,
    { expiresIn: `${env.refreshTokenTtlDays}d` }
  );

  await redis.setex(`refresh:${jti}`, env.refreshTokenTtlDays * 24 * 60 * 60, user._id.toString());
  return { token, jti };
}

export async function revokeRefreshToken(jti) {
  await redis.del(`refresh:${jti}`);
}

export async function isRefreshTokenActive(jti) {
  const exists = await redis.exists(`refresh:${jti}`);
  return exists === 1;
}

export async function blacklistAccessToken(jti, ttlSeconds) {
  if (ttlSeconds > 0) {
    await redis.setex(`blacklist:${jti}`, ttlSeconds, "1");
  }
}

export async function isAccessTokenBlacklisted(jti) {
  const exists = await redis.exists(`blacklist:${jti}`);
  return exists === 1;
}
