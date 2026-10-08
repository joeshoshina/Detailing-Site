// Thin wrapper around the Instagram API (Instagram Login flavour, graph.instagram.com).
// Files under api/_lib are shared helpers, not routes: Vercel skips "_" prefixed paths.

const GRAPH_URL = "https://graph.instagram.com";
const POST_LIMIT = 12;

async function graphGet(path, params) {
  const url = new URL(`${GRAPH_URL}/${path}`);
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }

  const res = await fetch(url, { signal: AbortSignal.timeout(10_000) });
  const body = await res.json().catch(() => ({}));

  if (!res.ok || body.error) {
    const message = body.error?.message || `HTTP ${res.status}`;
    throw new Error(`Instagram ${path} failed: ${message}`);
  }
  return body;
}

/**
 * Exchanges a long-lived token for a fresh one valid for another 60 days.
 * Instagram only allows this once the token is at least 24 hours old.
 */
export async function refreshAccessToken(token) {
  const body = await graphGet("refresh_access_token", {
    grant_type: "ig_refresh_token",
    access_token: token,
  });

  if (!body.access_token) {
    throw new Error("Instagram refresh_access_token returned no token");
  }
  // expires_in is documented, but fall back to the documented 60 days
  const expiresInSeconds = Number(body.expires_in) || 60 * 24 * 60 * 60;

  return {
    token: body.access_token,
    expiresAt: Date.now() + expiresInSeconds * 1000,
  };
}

async function fetchCarouselChildren(postId, token) {
  try {
    const body = await graphGet(`${postId}/children`, {
      fields: "id,media_type,media_url,thumbnail_url",
      access_token: token,
    });
    return body.data || [];
  } catch (err) {
    // One broken carousel shouldn't take down the whole gallery.
    console.error(err.message);
    return [];
  }
}

/** Returns the most recent posts, with carousel albums expanded into children. */
export async function fetchRecentPosts(token) {
  const body = await graphGet("me/media", {
    fields:
      "id,caption,media_type,media_url,thumbnail_url,permalink,timestamp,username",
    limit: String(POST_LIMIT),
    access_token: token,
  });

  return Promise.all(
    (body.data || []).map(async (post) => ({
      id: post.id,
      caption: post.caption || "",
      media_type: post.media_type,
      media_url: post.media_url,
      thumbnail_url: post.thumbnail_url,
      permalink: post.permalink,
      timestamp: post.timestamp,
      username: post.username,
      children:
        post.media_type === "CAROUSEL_ALBUM"
          ? await fetchCarouselChildren(post.id, token)
          : null,
    })),
  );
}
