// GET /api/cron/refresh-instagram-token — run daily by Vercel Cron (vercel.json).
//
// Instagram long-lived tokens die 60 days after their last refresh. This job
// refreshes the token once it's a week old and saves the new one to Redis, so
// a missed or failed run still leaves ~50 days of slack. Running it twice is
// harmless: the second run sees a recent refresh and skips. The daily Redis
// read also keeps the free Upstash database from being archived as inactive.
//
// Backup: /api/instagram refreshes in the background if this job has missed
// more than a few days (see FALLBACK_REFRESH_AFTER_MS there).
//
// Manual trigger (add ?force=1 to refresh regardless of age):
//   curl -H "Authorization: Bearer $CRON_SECRET" https://<site>/api/cron/refresh-instagram-token

import { DAY_MS, refreshIfDue } from "../_lib/refresh.js";
import { getTokenState, hasTokenStore } from "../_lib/tokenStore.js";

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
    const force = new URL(request.url).searchParams.has("force");
    const result = await refreshIfDue(await getTokenState(), {
      maxAgeMs: REFRESH_AFTER_MS,
      force,
    });

    return Response.json({
      refreshed: result.refreshed,
      ...(result.reason && { reason: result.reason }),
      refreshedAt: toIso(result.refreshedAt),
      expiresAt: toIso(result.expiresAt),
    });
  } catch (err) {
    console.error("Instagram token refresh failed:", err.message);
    return Response.json({ error: err.message }, { status: 502 });
  }
}
