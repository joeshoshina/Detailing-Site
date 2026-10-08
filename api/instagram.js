// GET /api/instagram — recent Instagram posts for the gallery page.
//
// Responses are cached on Vercel's CDN for 15 minutes and served stale for up
// to a day while revalidating, so Instagram is called a few times an hour at
// most no matter how much traffic the gallery gets.

import { fetchRecentPosts } from "./_lib/instagram.js";
import { getTokenState } from "./_lib/tokenStore.js";

const CORS = { "Access-Control-Allow-Origin": "*" };

export async function GET() {
  try {
    const { token } = await getTokenState();
    const posts = await fetchRecentPosts(token);

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
