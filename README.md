# CR Auto Detailing

Marketing site for CR Auto Detailing: React 19 + Vite + Tailwind v4, with an
Instagram-powered gallery. Everything runs on one Vercel project: the
prerendered static site, the `/api` functions, and a daily cron that keeps the
Instagram token alive.

Open to-dos (launch checklist, things to confirm, cleanup): see
[NOTES.md](NOTES.md).

- [Project layout](#project-layout)
- [Setup from scratch](#setup-from-scratch)
- [How the Instagram token is refreshed](#how-the-instagram-token-is-refreshed)
- [Operations: commands, logs, troubleshooting](#operations-commands-logs-troubleshooting)
- [SEO](#seo)
- [Local development](#local-development)

## Project layout

```
src/
  AppRoutes.jsx         routes shared by the browser and the build-time renderer
  main.jsx              browser entry (hydrates prerendered HTML)
  entry-server.jsx      build-time renderer used by scripts/prerender.js
  seo.js                per-page titles, descriptions, structured data (keyword map)
  pages/                Gallery, Booking, ServicePage (/services/<slug>), NotFound
  components/           page sections, Navbar, Footer, PostGrid, modals, RouteMeta
  hooks/useInstagramPosts.js   loads /api/instagram for the gallery + home preview
  data/business.js      name, phone, email, Instagram, site URL, service areas
  data/serviceData.js   services, prices, details, per-service SEO fields
  data/faq.js           FAQ (home page + FAQPage structured data)

api/                    Vercel Functions (files under api/_lib are not routes)
  instagram.js          GET /api/instagram: gallery posts, CDN-cached
  health.js             GET /api/health: token status (never the token itself)
  cron/refresh-instagram-token.js   daily token rotation (Vercel Cron)
  _lib/instagram.js     Instagram API calls (posts, carousel children, refresh)
  _lib/tokenStore.js    token storage in Upstash Redis + refresh lock
  _lib/refresh.js       "refresh if due" logic shared by the cron and backup

scripts/prerender.js    writes static HTML per page + sitemap.xml + robots.txt + 404.html
vercel.json             framework, clean URLs, asset caching, cron schedule
vite.config.js          dev-only plugin that serves api/ during `npm run dev`
.github/workflows/instagram-health-check.yml   weekly monitoring
public/privacy-policy.html   served at /privacy-policy (Meta requires one)
server/                 legacy Render backend, unused (excluded via .vercelignore)
```

Pushing to `main` deploys to production on Vercel. Other branches get preview
deployments (cron jobs only run in production).

## Setup from scratch

### 1. Vercel project

- **Settings → Build and Deployment → Root Directory:** leave empty (repo
  root). Framework (`vite`), build command, and output directory come from
  `vercel.json`, overriding the dashboard. If Root Directory were `server`,
  Vercel would deploy the old Express backend instead of the site.
- Current project: `joeshoshinas-projects/detailing-site` (Node 24).

### 2. Redis storage (Upstash)

**Storage → Create Database → Upstash for Redis → Free plan**, then connect
it to the project (Production + Preview). This adds `KV_REST_API_URL`,
`KV_REST_API_TOKEN`, and a few related variables automatically. Turn off
"auto upgrade" if offered so it can never move to a paid plan; this site uses
a tiny fraction of the free tier. Current database: `upstash-crauto`.

### 3. Environment variables

Set in **Vercel → Project → Settings → Environment Variables** (Production),
then redeploy so they take effect.

| Variable | Required | Notes |
| --- | --- | --- |
| `INSTAGRAM_ACCESS_TOKEN` | yes | Long-lived Instagram token (see step 4). Store as **Sensitive**. Seeds Redis; pasting a new value later overrides the stored token. |
| `CRON_SECRET` | yes | Random string, 16+ characters (`openssl rand -hex 24`). Vercel sends it to the cron automatically. Store as a **non-sensitive** variable so you can reveal it for manual refreshes. |
| `KV_REST_API_URL`, `KV_REST_API_TOKEN` | yes | Added by the Upstash integration. `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` also work. |
| `CLIENT_TOKEN` | no | Legacy name for the Instagram token; used only if `INSTAGRAM_ACCESS_TOKEN` is unset. |
| `VITE_API_BASE_URL` | no | Only for a frontend hosted elsewhere that should call this site's API (CORS is open on `/api/instagram`). |

### 4. Instagram token

Meta App Dashboard → your app → **Instagram → API setup with Instagram
business login** → **Generate token** next to `@crauto.detailing`. That's a
long-lived token valid for 60 days (needs the `instagram_business_basic`
permission). Paste it into `INSTAGRAM_ACCESS_TOKEN` and redeploy.

Instagram only refreshes tokens that are at least 24 hours old, so if the
token is brand new the first cron run fails and the next day's run succeeds.

### 5. Monitoring (GitHub)

Nothing to configure while the site lives at
`https://detailing-site-lemon.vercel.app`. If it moves to a custom domain, set
the repo variable **`SITE_URL`** (Settings → Secrets and variables → Actions →
Variables) so the weekly health check hits the new address.

### 6. Verify

```bash
curl -s https://detailing-site-lemon.vercel.app/api/health
# {"status":"ok","tokenStore":"connected","tokenSource":"env",...}   before the first refresh
# {"status":"ok","tokenStore":"connected","tokenSource":"store",...} after it
```

Vercel → Project → Settings → **Cron Jobs** should list
`/api/cron/refresh-instagram-token` on `0 14 * * *`.

## How the Instagram token is refreshed

Instagram long-lived tokens expire **60 days after their last refresh**, and an
expired token can't be refreshed (you'd have to generate a new one). So the
site refreshes it weekly, keeping it far from the deadline.

### Normal flow

1. **Storage.** The current token lives in Redis under the key
   `instagram:token` as JSON:
   `{ token, seed, refreshedAt, expiresAt }` (timestamps in ms). Before the
   first refresh, it comes from `INSTAGRAM_ACCESS_TOKEN`.
   ([api/_lib/tokenStore.js](api/_lib/tokenStore.js))
2. **Daily cron.** Vercel calls `GET /api/cron/refresh-instagram-token` every
   day at 14:00 UTC (7am PDT / 6am PST; on the Hobby plan it can fire any time
   within that hour). The request carries `Authorization: Bearer $CRON_SECRET`;
   anything else gets `401`.
   ([api/cron/refresh-instagram-token.js](api/cron/refresh-instagram-token.js),
   schedule in [vercel.json](vercel.json))
3. **Refresh if due.** If the token was last refreshed **7 or more days ago**
   (or never), the job calls
   `https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token`,
   gets a new token valid for another 60 days, and saves it to Redis.
   Otherwise it returns `{"refreshed":false,"reason":"fresh"}`. Running twice
   is harmless: the second run sees a recent refresh and skips.
   ([api/_lib/refresh.js](api/_lib/refresh.js))
4. **Use.** `/api/instagram` reads the newest token from Redis on every call, so
   the gallery picks up a refreshed token immediately.

Because it refreshes weekly, the token always has about **53+ days left**. The
daily Redis read also counts as activity, so the free Upstash database is
never archived for inactivity (Upstash archives free databases after 14–30
idle days).

### Safety nets

| Safeguard | What it does |
| --- | --- |
| **Backup refresh** | `/api/instagram` checks the token age on every call. If it's **10+ days** since the last refresh (the cron has missed several runs), it refreshes in the background with `waitUntil`, after the response is sent, so visitors never wait. The home page's Recent Work and the gallery both call this endpoint. It only runs when the CDN cache misses (at most every 15 minutes), so it can't hammer Instagram. |
| **Refresh lock** | Before refreshing, both paths take a Redis lock (`instagram:token:refresh-lock`, `SET NX EX 300`). If one is in progress, the other skips (`reason: "locked"`). The lock isn't released after a failure, so it doubles as a 5-minute retry backoff. `?force=1` bypasses it. |
| **Failed refresh** | Returns `502` with Instagram's error message and leaves the stored token untouched; the next day's run retries. |
| **Redis outage** | Token reads fall back to the `INSTAGRAM_ACCESS_TOKEN` env var instead of failing the request (logged). |
| **Manual override** | Redis stores a fingerprint (`seed`, first 16 hex chars of the SHA-256) of the env token it was seeded from. Paste a different token into `INSTAGRAM_ACCESS_TOKEN` and redeploy, and the fingerprints no longer match, so the new env token wins and gets rotated from then on. |
| **Weekly health check** | See [Monitoring](#monitoring). |

**Time to react if everything breaks:** the health check flags a stalled
refresh at 10 days, and the token still works until day 60, so there are
about 50 days to fix it before the gallery goes dark.

### Gallery caching

`/api/instagram` responses are cached on Vercel's CDN
(`s-maxage=900, stale-while-revalidate=86400`): fresh for 15 minutes, then
served stale for up to a day while revalidating in the background. Errors
return `502` with `no-store` so they're never cached. The endpoint fetches the
12 most recent posts and expands carousel albums into their child images and
videos.

### Monitoring

[.github/workflows/instagram-health-check.yml](.github/workflows/instagram-health-check.yml)
runs every Monday at 16:00 UTC (and on demand). It opens one GitHub issue
labeled `instagram-health` if any of these are true:

- `/api/health` isn't `200`, Redis isn't connected, or the token has never
  been refreshed
- the token expires in under **14 days**
- the last refresh was more than **10 days** ago (automatic refresh has
  stalled)
- `/api/instagram` doesn't return `200` with at least one post

It comments and closes the issue once everything is healthy again. GitHub
disables scheduled workflows after 60 days without repo activity, so each run
re-enables itself through the API (`permissions: actions: write`).

`/api/health` returns, with no caching:

```json
{
  "status": "ok",
  "tokenStore": "connected",
  "tokenSource": "store",
  "refreshedAt": "2026-10-08T21:03:28.208Z",
  "expiresAt": "2026-12-07T21:01:26.208Z"
}
```

`tokenStore` is `connected` or `missing`; `tokenSource` is `store` (Redis) or
`env` (the env var, before the first refresh or during a Redis outage).

## Operations: commands, logs, troubleshooting

### Commands

```bash
SITE=https://detailing-site-lemon.vercel.app

# Token status: last refresh and expiry
curl -s $SITE/api/health

# Run the refresh job now (skips if the token is under 7 days old)
curl -s -H "Authorization: Bearer $CRON_SECRET" $SITE/api/cron/refresh-instagram-token

# Force a refresh regardless of age (token must be at least 24h old)
curl -s -H "Authorization: Bearer $CRON_SECRET" "$SITE/api/cron/refresh-instagram-token?force=1"

# Run the health check now instead of waiting for Monday
gh workflow run instagram-health-check.yml
```

`CRON_SECRET` can be revealed in Vercel → Settings → Environment Variables.

### Logs

- **Cron runs:** Vercel → Project → Settings → Cron Jobs → **View Logs**. A
  successful refresh logs `Instagram token refreshed, expires <date>`.
- **Gallery and backup refresh:** Vercel → Project → Logs, filtered to
  `/api/instagram` (`Fallback token refresh failed: …` if the backup fails).
- **Health checks:** GitHub → Actions → Instagram Health Check.

### Troubleshooting

| Symptom | Likely cause and fix |
| --- | --- |
| Gallery says "We couldn't load our latest posts" | Check `/api/health` and the `/api/instagram` logs. "Session has expired" or "Error validating access token" means the token is dead: generate a new one (setup step 4), paste it into `INSTAGRAM_ACCESS_TOKEN`, redeploy. |
| Token revoked early | Meta can invalidate tokens before 60 days (e.g. after an Instagram password change or removing the app's permission). Same fix: new token, paste, redeploy. |
| Cron returns `401` | `CRON_SECRET` is missing or the header doesn't match. |
| Cron returns `500` "Connect an Upstash Redis store" | The Redis integration was disconnected; reconnect it under Storage and redeploy. |
| Refresh fails right after pasting a new token | Instagram only refreshes tokens that are 24+ hours old; the next daily run will succeed. |
| `tokenSource` stays `env` | No successful refresh yet. Run the cron command above and check its response. |
| Health check issue opened | Its body lists what failed and the fix steps; it closes itself once healthy. |

## SEO

`npm run build` prerenders every page to static HTML (`scripts/prerender.js`),
so search engines, AI crawlers, and link previews get the full content and
that page's tags without running JavaScript. React then hydrates it in the
browser. Each page gets a unique `<title>`, meta description, canonical URL,
Open Graph tags, and schema.org JSON-LD (`AutoWash` local business with
service area and prices, `Service` + breadcrumbs per service, `FAQPage`).
Unknown URLs return a real 404 (`404.html`), and the build writes
`sitemap.xml` and `robots.txt`. Vercel serves `dist/<path>.html` at `/<path>`
(`cleanUrls`), and old `.html` URLs redirect permanently.

Keyword map: one search intent per URL (titles/descriptions in `src/seo.js`
and the `seo` fields in `src/data/serviceData.js`):

| URL | Target searches |
| --- | --- |
| `/` | mobile car detailing San Fernando Valley, mobile auto detailing SFV, car detailing near me, + neighborhoods in `serviceAreas` |
| `/services/exterior-detailing` | exterior car detailing, mobile hand car wash |
| `/services/interior-detailing` | interior car detailing, car interior cleaning |
| `/services/full-detail` | full car detail, interior and exterior detailing |
| `/services/paint-correction` | paint correction, swirl / scratch removal |
| `/services/carpet-seat-extraction` | car seat shampoo, carpet extraction, upholstery cleaning |
| `/gallery` | car detailing before and after |
| `/book` | book mobile car detailing |

To add a page, add it to `PAGES` in `src/seo.js` and a `<Route>` in
`src/AppRoutes.jsx`; it's prerendered and added to the sitemap automatically.

**Moving to a custom domain:** change `url` in `src/data/business.js`
(canonical URLs, sitemap, and structured data all follow), add the domain in
Vercel, and set the `SITE_URL` repo variable for the health check.

**Off-site steps that matter most for local rankings** (can't be done in code;
tracked in [NOTES.md](NOTES.md)):
1. Google Search Console: verify the site and submit `/sitemap.xml`.
2. Google Business Profile as a service-area business (no public address),
   with the same name, phone, and site URL as here, the service area, and
   photos. This drives the "near me" map results.
3. Ask happy customers for Google reviews; reply to them.
4. List the business on Yelp, Bing Places, and Apple Business Connect with
   identical name/phone/URL.
5. Retire duplicate copies of the site (the old Netlify deploy) so they don't
   compete with this one.

## Local development

```bash
npm install
cp .env.example .env.local   # set INSTAGRAM_ACCESS_TOKEN
npm run dev                  # http://localhost:5173
npm run build                # client build + SSR build + prerender into dist/
npm run lint
```

`npm run dev` also serves the `api/` functions through a small Vite plugin
(see `vite.config.js`), so the gallery works locally without the Vercel CLI.
Leave the `KV_*` Redis variables out of `.env.local` unless you mean to: with
them set, local gallery requests can rotate the production token in the
shared Redis store.

`npm run preview` serves the prerendered build (e.g. `/gallery` →
`gallery.html`), but it doesn't run the `api/` functions, and unknown URLs get
the home page with a 200 instead of the 404 page. Use a Vercel preview
deployment to check those.
