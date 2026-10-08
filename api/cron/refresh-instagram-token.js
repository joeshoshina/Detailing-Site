// GET /api/cron/refresh-instagram-token — run daily by Vercel Cron (vercel.json).
//
// Instagram long-lived tokens die 60 days after their last refresh. This job
// refreshes the token once it's a week old and saves the new one to Redis, so
// a missed or failed run still leaves ~50 days of slack. Running it twice is
// harmless: the second run sees a recent refresh and skips.
//
// Manual trigger (add ?force=1 to refresh regardless of age):
//   curl -H "Authorization: Bearer $CRON_SECRET" https://<site>/api/cron/refresh-instagram-token

import { refreshAccessToken } from "../_lib/instagram.js";
import {
  getTokenState,
  hasTokenStore,
  saveTokenState,
} from "../_lib/tokenStore.js";

const DAY_MS = 24 * 60 * 60 * 1000;
const REFRESH_AFTER_MS = 7 * DAY_MS;

const toIso = (ms) => (ms ? new Date(ms).toISOString() : null);

export async function GET(request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  if (!hasTokenStore()) {
    console.error("Token refresh skipped: no Redis store connected");
    return Response.json(
      { error: "Connect an Upstash Redis store to this project first" },
      { status: 500 },
    );
  }

  try {
    const current = await getTokenState();
    const force = new URL(request.url).searchParams.has("force");
    const age = current.refreshedAt ? Date.now() - current.refreshedAt : Infinity;

    if (!force && age < REFRESH_AFTER_MS) {
      return Response.json({
        refreshed: false,
        refreshedAt: toIso(current.refreshedAt),
        expiresAt: toIso(current.expiresAt),
      });
    }

    const { token, expiresAt } = await refreshAccessToken(current.token);
    const refreshedAt = Date.now();
    await saveTokenState({ token, seed: current.seed, refreshedAt, expiresAt });

    console.log(`Instagram token refreshed, expires ${toIso(expiresAt)}`);
    return Response.json({
      refreshed: true,
      refreshedAt: toIso(refreshedAt),
      expiresAt: toIso(expiresAt),
    });
  } catch (err) {
    console.error("Instagram token refresh failed:", err.message);
    return Response.json({ error: err.message }, { status: 502 });
  }
}
