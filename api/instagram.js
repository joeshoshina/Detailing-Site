// GET /api/instagram — recent Instagram posts for the gallery page.
//
// Responses are cached on Vercel's CDN for 15 minutes and served stale for up
// to a day while revalidating, so Instagram is called a few times an hour at
// most no matter how much traffic the gallery gets.

import { waitUntil } from "@vercel/functions";
import { fetchRecentPosts } from "./_lib/instagram.js";
import { DAY_MS, refreshIfDue } from "./_lib/refresh.js";
import { getTokenState, hasTokenStore } from "./_lib/tokenStore.js";

// The daily cron refreshes at 7 days. If the token is older than this, the
// cron has missed several runs, so refresh here as a backup.
const FALLBACK_REFRESH_AFTER_MS = 10 * DAY_MS;

const CORS = { "Access-Control-Allow-Origin": "*" };

export async function GET() {
  try {
    const state = await getTokenState();

    if (hasTokenStore()) {
      // Runs after the response is sent, so visitors never wait on it.
      waitUntil(
        refreshIfDue(state, { maxAgeMs: FALLBACK_REFRESH_AFTER_MS }).catch(
          (err) => console.error("Fallback token refresh failed:", err.message),
        ),
      );
    }

    const posts = await fetchRecentPosts(state.token);

    return Response.json(
      { data: posts, count: posts.length },
      {
        headers: {
          ...CORS,
          "Cache-Control": "public, s-maxage=900, stale-while-revalidate=86400",
        },
      },
    );
  } catch (err) {
    console.error("Failed to fetch Instagram posts:", err.message);
    return Response.json(
      { error: "Failed to fetch posts" },
      { status: 502, headers: { ...CORS, "Cache-Control": "no-store" } },
    );
  }
}
