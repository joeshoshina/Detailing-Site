import axios from "axios";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

const TOKEN_PATH = "./token.json";

// Load current token (from token.json if exists, else from .env)
export function getCurrentToken() {
  if (!process.env.CLIENT_TOKEN) {
    throw new Error("CLIENT_TOKEN not found in .env");
  }
  try {
    const data = JSON.parse(fs.readFileSync(TOKEN_PATH, "utf-8"));
    return data.CLIENT_TOKEN || process.env.CLIENT_TOKEN;
  } catch (err) {
    if (err.code !== "ENOENT") {
      console.warn(`Warning: ${err.message}. Using token from .env`);
    }
    return process.env.CLIENT_TOKEN;
  }
}

// Refresh the token using Instagram Graph API
export async function refreshInstagramToken(force = false) {
  // Read current state
  let tokenData;
  try {
    tokenData = fs.existsSync(TOKEN_PATH)
      ? JSON.parse(fs.readFileSync(TOKEN_PATH, "utf-8"))
      : { CLIENT_TOKEN: getCurrentToken() };
  } catch {
    tokenData = { CLIENT_TOKEN: getCurrentToken() };
  }

  // Check if refresh needed (default: 25 days)
  const lastRefresh = tokenData.lastRefresh || 0;
  const daysUntilExpiry = process.env.IG_REFRESH_INTERVAL_DAYS || 30;
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
      }
    );

    const newToken = res.data.access_token;
    console.log("Token refreshed successfully!");

    // Save the new token with timestamp
    const updatedData = {
      CLIENT_TOKEN: newToken,
      lastRefresh: Date.now(),
    };

    try {
      fs.writeFileSync(TOKEN_PATH, JSON.stringify(updatedData, null, 2));
    } catch (writeErr) {
      console.warn(`Warning: Couldn't save token to file: ${writeErr.message}`);
    }

    return newToken;
  } catch (err) {
    console.error(
      "Failed to refresh token:",
      err.response?.data || err.message
    );
    return currentToken; // fallback
  }
}
