// Shared token rotation used by the daily cron and the gallery's fallback.

import { refreshAccessToken } from "./instagram.js";
import { acquireRefreshLock, saveTokenState } from "./tokenStore.js";

export const DAY_MS = 24 * 60 * 60 * 1000;

/**
 * Swaps the token for a fresh 60-day one when it was last refreshed more than
 * `maxAgeMs` ago (or never), and saves it to Redis.
 *
 * @returns the new state with `refreshed: true`, or the current state with
 *   `refreshed: false` and a `reason` ("fresh" | "locked")
 */
export async function refreshIfDue(state, { maxAgeMs, force = false }) {
  const age = state.refreshedAt ? Date.now() - state.refreshedAt : Infinity;
  if (!force && age < maxAgeMs) {
    return { ...state, refreshed: false, reason: "fresh" };
  }
  if (!force && !(await acquireRefreshLock())) {
    return { ...state, refreshed: false, reason: "locked" };
  }

  const { token, expiresAt } = await refreshAccessToken(state.token);
  const next = { token, seed: state.seed, refreshedAt: Date.now(), expiresAt };
  await saveTokenState(next);

  console.log(
    `Instagram token refreshed, expires ${new Date(expiresAt).toISOString()}`,
  );
  return { ...next, source: "store", refreshed: true };
}
