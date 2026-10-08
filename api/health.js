// GET /api/health — token status for monitoring (never exposes the token itself).
// Polled weekly by .github/workflows/instagram-health-check.yml.

import { getTokenState, hasTokenStore } from "./_lib/tokenStore.js";

const toIso = (ms) => (ms ? new Date(ms).toISOString() : null);

export async function GET() {
  const headers = { "Cache-Control": "no-store" };

  try {
    const state = await getTokenState();
    return Response.json(
      {
        status: "ok",
        tokenStore: hasTokenStore() ? "connected" : "missing",
        tokenSource: state.source,
        refreshedAt: toIso(state.refreshedAt),
        expiresAt: toIso(state.expiresAt),
      },
      { headers },
    );
  } catch (err) {
    return Response.json(
      { status: "error", error: err.message },
      { status: 500, headers },
    );
  }
}
