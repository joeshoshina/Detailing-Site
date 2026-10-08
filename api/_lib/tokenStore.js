// Persists the Instagram access token so the daily cron can rotate it without
// anyone touching environment variables. Backed by Upstash Redis (Vercel
// Marketplace → Storage), spoken to over its REST API so no SDK is needed.
//
// Resolution order:
//   1. Token saved in Redis by the refresh cron
//   2. INSTAGRAM_ACCESS_TOKEN (or legacy CLIENT_TOKEN) environment variable
//
// Pasting a new token into the env var always wins: Redis remembers a
// fingerprint of the env token it was seeded from, and is ignored once the env
// token changes.

import { createHash } from "node:crypto";

const STORE_KEY = "instagram:token";

function redisConfig() {
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token =
    process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  return url && token ? { url, token } : null;
}

export function hasTokenStore() {
  return redisConfig() !== null;
}

async function redis(command) {
  const { url, token } = redisConfig();
  const res = await fetch(url, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(command),
    signal: AbortSignal.timeout(5_000),
  });
  const body = await res.json().catch(() => ({}));

  if (!res.ok || body.error) {
    throw new Error(`Redis ${command[0]} failed: ${body.error || res.status}`);
  }
  return body.result;
}

function fingerprint(token) {
  return createHash("sha256").update(token).digest("hex").slice(0, 16);
}

/**
 * @returns {Promise<{token: string, seed: string, source: "store" | "env",
 *   refreshedAt: number | null, expiresAt: number | null}>}
 */
export async function getTokenState() {
  const envToken =
    process.env.INSTAGRAM_ACCESS_TOKEN || process.env.CLIENT_TOKEN;
  if (!envToken) {
    throw new Error("INSTAGRAM_ACCESS_TOKEN is not configured");
  }
  const seed = fingerprint(envToken);

  if (hasTokenStore()) {
    try {
      const stored = JSON.parse((await redis(["GET", STORE_KEY])) || "null");
      if (stored?.token && stored.seed === seed) {
        return { ...stored, source: "store" };
      }
    } catch (err) {
      // Fall back to the env token rather than failing the request.
      console.error(err.message);
    }
  }

  return { token: envToken, seed, source: "env", refreshedAt: null, expiresAt: null };
}

export async function saveTokenState({ token, seed, refreshedAt, expiresAt }) {
  await redis([
    "SET",
    STORE_KEY,
    JSON.stringify({ token, seed, refreshedAt, expiresAt }),
  ]);
}
