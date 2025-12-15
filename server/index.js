// ============================================
// INDEX.JS - Instagram API Backend
// ============================================
//
// PURPOSE:
// Express server that fetches Instagram posts via Graph API with support
// for carousel albums, caching, and automatic token refresh.
//
// MAIN FEATURES:
// - Fetches Instagram posts from connected business account
// - Automatically handles carousel posts (multi-image/video albums)
// - 10-minute cache system to reduce API rate limit usage
// - Automatic token refresh (configured via environment variables)
// - Graceful error handling with stale cache fallback
// - Health check and cache management endpoints
//
// DEPENDENCIES:
// - express: Web server framework
// - axios: HTTP client for Instagram Graph API
// - cors: Cross-origin resource sharing middleware
// - dotenv: Environment variable management
// - refreshToken.js: Custom token refresh logic
//
// ENVIRONMENT VARIABLES:
// - CLIENT_TOKEN: Instagram Graph API access token (loaded via refreshToken.js)
// - IG_REFRESH_INTERVAL_DAYS: Token refresh interval (default: 30 days)
//
// ENDPOINTS:
// - GET  /api/instagram              : Fetch Instagram posts (with caching)
// - GET  /api/instagram?refresh=true : Force fresh data fetch
// - POST /api/instagram/clear-cache  : Manually clear cache
// - GET  /api/health                 : Server health check
//
// MAINTENANCE NOTES:
// - Cache is in-memory; restarting server clears cache
// - Token refresh system runs independently on schedule
// - Carousel fetching requires separate API calls per post
// - Default post limit is 12 (configurable in fetchInstagramData)
//
// AUTHOR: CR Auto Detailing Development Team
// LAST UPDATED: 2025
// ============================================

import express from "express";
import axios from "axios";
import cors from "cors";
import dotenv from "dotenv";
import { getCurrentToken, refreshInstagramToken } from "./refreshToken.js";

dotenv.config();
const app = express();
app.use(cors());

// ============================================
// TOKEN MANAGEMENT SYSTEM
// ============================================
// Handles Instagram Graph API access token initialization
// and automatic refresh on a scheduled interval.
// Token is stored in CLIENT_TOKEN variable and updated
// by refreshInstagramToken() function.
// ============================================

let CLIENT_TOKEN;

// Initialize token from storage
try {
  CLIENT_TOKEN = getCurrentToken();
} catch (err) {
  console.error("Startup Error:", err.message);
  console.error(
    "Please ensure you have a valid CLIENT_TOKEN in your .env file"
  );
  process.exit(1);
}

// Configure token refresh interval (default: 30 days)
const REFRESH_INTERVAL_DAYS = parseInt(
  process.env.IG_REFRESH_INTERVAL_DAYS || "30"
);
const REFRESH_INTERVAL_MS = REFRESH_INTERVAL_DAYS * 24 * 60 * 60 * 1000;

// Verify token validity on server startup
refreshInstagramToken()
  .then((token) => {
    CLIENT_TOKEN = token;
    console.log("Token verified and ready");
  })
  .catch((err) => {
    console.error("Token refresh failed:", err.message);
    // Continue with existing token
  });

// Schedule automatic token refresh
setInterval(async () => {
  try {
    CLIENT_TOKEN = await refreshInstagramToken();
  } catch (err) {
    console.error("Scheduled refresh failed:", err.message);
  }
}, REFRESH_INTERVAL_MS);

// ============================================
// CACHING SYSTEM
// ============================================
// In-memory cache to reduce Instagram API calls and
// prevent rate limit issues. Cache duration is 10 minutes.
// Server restart clears cache.
// ============================================

let cache = {
  data: null, // Cached Instagram post data
  timestamp: null, // Timestamp of last cache update
};

const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes in milliseconds

/**
 * Checks if cached data is still valid based on cache duration.
 *
 * @returns {boolean} True if cache exists and is within valid time window
 */
function isCacheValid() {
  if (!cache.data || !cache.timestamp) return false;
  const age = Date.now() - cache.timestamp;
  return age < CACHE_DURATION;
}

// ============================================
// INSTAGRAM API HELPER FUNCTIONS
// ============================================

/**
 * Fetches all child media items from an Instagram carousel post.
 * Carousel albums require a separate API call to retrieve all images/videos.
 *
 * @param {string} carouselId - Instagram post ID of carousel album
 * @returns {Promise<Array>} Array of child media objects with id, media_type, media_url
 */
async function fetchCarouselChildren(carouselId) {
  const url = `https://graph.instagram.com/${carouselId}/children?fields=id,media_type,media_url&access_token=${CLIENT_TOKEN}`;

  try {
    const response = await axios.get(url);
    return response.data.data || [];
  } catch (error) {
    console.error(`Error fetching children for ${carouselId}:`, error.message);
    return []; // Return empty array on failure to prevent cascade errors
  }
}

/**
 * Fetches recent Instagram posts and enhances carousel posts with all media.
 * Makes initial call to /me/media endpoint, then fetches children for any
 * carousel albums to get complete image/video sets.
 *
 * @returns {Promise<Array>} Array of enhanced post objects
 * @throws {Error} If Instagram API request fails
 */
async function fetchInstagramData() {
  const fields = "id,caption,media_type,media_url,permalink,timestamp,username";
  const url = `https://graph.instagram.com/me/media?fields=${fields}&access_token=${CLIENT_TOKEN}&limit=12`;

  const response = await axios.get(url);
  const posts = response.data.data || [];

  // Process each post and fetch carousel children if needed
  const enhancedPosts = await Promise.all(
    posts.map(async (post) => {
      // Handle carousel albums - fetch all slides
      if (post.media_type === "CAROUSEL_ALBUM") {
        const children = await fetchCarouselChildren(post.id);

        return {
          id: post.id,
          caption: post.caption || "",
          media_type: post.media_type,
          permalink: post.permalink,
          timestamp: post.timestamp,
          username: post.username,
          children: children, // Array of all images/videos in carousel
        };
      } else {
        // Handle single image or video posts
        return {
          id: post.id,
          caption: post.caption || "",
          media_type: post.media_type,
          media_url: post.media_url,
          permalink: post.permalink,
          timestamp: post.timestamp,
          username: post.username,
          children: null, // No children for single media posts
        };
      }
    })
  );

  return enhancedPosts;
}

// ============================================
// API ENDPOINTS
// ============================================

/**
 * GET /api/instagram
 *
 * Main endpoint to fetch Instagram posts. Implements caching to reduce
 * API calls. Returns cached data if available and valid, otherwise fetches
 * fresh data from Instagram Graph API.
 *
 * Query Parameters:
 * - refresh: Set to 'true' to bypass cache and force fresh fetch
 *
 * Response Format:
 * {
 *   data: Array of post objects,
 *   count: Number of posts,
 *   cached: Boolean indicating if response was from cache,
 *   stale: Boolean (only present if serving expired cache due to error)
 * }
 */
app.get("/api/instagram", async (req, res) => {
  try {
    const forceRefresh = req.query.refresh === "true";

    // Return cached data if valid and not forcing refresh
    if (!forceRefresh && isCacheValid()) {
      console.log("Serving cached Instagram data");
      return res.json({
        data: cache.data,
        count: cache.data.length,
        cached: true,
      });
    }

    // Fetch fresh data from Instagram API
    console.log("Fetching fresh Instagram data...");
    const enhancedPosts = await fetchInstagramData();

    // Update cache with fresh data
    cache.data = enhancedPosts;
    cache.timestamp = Date.now();

    console.log(`Fetched ${enhancedPosts.length} posts`);
    res.json({
      data: enhancedPosts,
      count: enhancedPosts.length,
      cached: false,
    });
  } catch (err) {
    console.error("Error fetching posts:", err.response?.data || err.message);

    // Fallback to stale cache if available (graceful degradation)
    if (cache.data) {
      console.log("Error occurred, serving stale cache");
      return res.json({
        data: cache.data,
        count: cache.data.length,
        cached: true,
        stale: true,
        error: "Using cached data due to API error",
      });
    }

    // No cache available, return error
    res.status(500).json({ error: "Failed to fetch posts" });
  }
});

/**
 * POST /api/instagram/clear-cache
 *
 * Manually clears the in-memory cache. Useful for debugging or
 * forcing immediate data refresh on next request.
 *
 * Response:
 * { message: 'Cache cleared successfully' }
 */
app.post("/api/instagram/clear-cache", (req, res) => {
  cache.data = null;
  cache.timestamp = null;
  console.log("Cache cleared");
  res.json({ message: "Cache cleared successfully" });
});

/**
 * GET /api/health
 *
 * Health check endpoint for monitoring server status.
 * Returns cache state and token availability.
 *
 * Response:
 * {
 *   status: 'ok',
 *   message: 'Server is running',
 *   cacheStatus: 'valid' | 'empty/expired',
 *   tokenStatus: 'loaded' | 'missing'
 * }
 */
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    message: "Server is running",
    cacheStatus: isCacheValid() ? "valid" : "empty/expired",
    tokenStatus: CLIENT_TOKEN ? "loaded" : "missing",
  });
});

// ============================================
// SERVER INITIALIZATION
// ============================================

const PORT = process.env.PORT || 5001;
const BASE_URL = process.env.BASE_URL || `http://localhost:${PORT}`;

app.listen(PORT, () => {
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log(`Server running on port ${PORT}`);
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log(`Instagram API: ${BASE_URL}/api/instagram`);
  console.log(`Health Check:  ${BASE_URL}/api/health`);
  console.log(`Clear Cache:   POST ${BASE_URL}/api/instagram/clear-cache`);
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
});

// ============================================
// API RESPONSE EXAMPLES
// ============================================
//
// SINGLE IMAGE/VIDEO POST:
// {
//   "id": "123456789",
//   "caption": "Amazing detail work!",
//   "media_type": "IMAGE",
//   "media_url": "https://instagram.com/image.jpg",
//   "permalink": "https://instagram.com/p/xyz",
//   "timestamp": "2025-01-15T10:30:00+0000",
//   "username": "detailer_pro",
//   "children": null
// }
//
// CAROUSEL POST:
// {
//   "id": "987654321",
//   "caption": "Before and after transformation!",
//   "media_type": "CAROUSEL_ALBUM",
//   "permalink": "https://instagram.com/p/abc",
//   "timestamp": "2025-01-15T14:20:00+0000",
//   "username": "detailer_pro",
//   "children": [
//     {
//       "id": "child1",
//       "media_type": "IMAGE",
//       "media_url": "https://instagram.com/image1.jpg"
//     },
//     {
//       "id": "child2",
//       "media_type": "IMAGE",
//       "media_url": "https://instagram.com/image2.jpg"
//     },
//     {
//       "id": "child3",
//       "media_type": "VIDEO",
//       "media_url": "https://instagram.com/video.mp4"
//     }
//   ]
// }
// ============================================
