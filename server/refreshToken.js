import axios from "axios";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import {
  getTokenState,
  isTokenStoreEnabled,
  upsertTokenState,
} from "./tokenStore.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, ".env") });

const TOKEN_PATH = path.resolve(__dirname, "token.json");

function readTokenFile() {
  try {
    return JSON.parse(fs.readFileSync(TOKEN_PATH, "utf-8"));
  } catch {
    return null;
  }
}

// Load current token (from token.json if exists, else from .env)
export async function getCurrentToken() {
  if (isTokenStoreEnabled()) {
    try {
      const tokenState = await getTokenState();
      if (tokenState?.client_token) {
        return tokenState.client_token;
      }
    } catch (err) {
      console.warn(`Warning: DB token lookup failed: ${err.message}`);
    }
  }

  const fileTokenState = readTokenFile();
  if (fileTokenState?.CLIENT_TOKEN) {
    return fileTokenState.CLIENT_TOKEN;
  }

  if (process.env.CLIENT_TOKEN) {
    return process.env.CLIENT_TOKEN;
  }

  throw new Error("CLIENT_TOKEN not found in DB, token.json, or .env");
}

// Refresh the token using Instagram Graph API
export async function refreshInstagramToken(force = false) {
  let tokenData = null;

  if (isTokenStoreEnabled()) {
    try {
      const tokenState = await getTokenState();
      if (tokenState?.client_token) {
        tokenData = {
          CLIENT_TOKEN: tokenState.client_token,
          lastRefresh: Number(tokenState.last_refresh) || 0,
        };
      }
    } catch (err) {
      console.warn(`Warning: DB token state read failed: ${err.message}`);
    }
  }

  if (!tokenData) {
    const fileTokenState = readTokenFile();
    if (fileTokenState?.CLIENT_TOKEN) {
      tokenData = {
        CLIENT_TOKEN: fileTokenState.CLIENT_TOKEN,
        lastRefresh: Number(fileTokenState.lastRefresh) || 0,
      };
    }
  }

  if (!tokenData) {
    tokenData = {
      CLIENT_TOKEN: await getCurrentToken(),
      lastRefresh: 0,
    };
  }

  // Check if refresh needed (default: 25 days)
  const lastRefresh = tokenData.lastRefresh || 0;
  const daysUntilExpiry = parseInt(
    process.env.IG_REFRESH_INTERVAL_DAYS || "40",
  );
  const needsRefresh =
    force ||
    Date.now() - lastRefresh > (daysUntilExpiry - 5) * 24 * 60 * 60 * 1000;

  if (!needsRefresh) {
    return tokenData.CLIENT_TOKEN;
  }

  try {
    const res = await axios.get(
      `https://graph.instagram.com/refresh_access_token`,
      {
        params: {
          grant_type: "ig_refresh_token",
          access_token: tokenData.CLIENT_TOKEN,
        },
      },
    );

    const newToken = res.data.access_token;
    console.log("Token refreshed successfully!");

    // Save the new token with timestamp
    const refreshedAt = Date.now();
    const updatedData = {
      CLIENT_TOKEN: newToken,
      lastRefresh: refreshedAt,
    };

    if (isTokenStoreEnabled()) {
      try {
        await upsertTokenState(newToken, refreshedAt);
      } catch (dbErr) {
        console.warn(`Warning: Couldn't save token to DB: ${dbErr.message}`);
      }
    }

    try {
      fs.writeFileSync(TOKEN_PATH, JSON.stringify(updatedData, null, 2));
    } catch (writeErr) {
      console.warn(`Warning: Couldn't save token to file: ${writeErr.message}`);
    }

    return newToken;
  } catch (err) {
    console.error(
      "Failed to refresh token:",
      err.response?.data || err.message,
    );
    return tokenData.CLIENT_TOKEN; // fallback
  }
}
