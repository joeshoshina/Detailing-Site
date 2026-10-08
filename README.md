# CR Auto Detailing

Marketing site for CR Auto Detailing: React 19 + Vite + Tailwind v4, with an
Instagram-powered gallery. Everything runs on one Vercel project: the static
site, the `/api` functions, and a daily cron that keeps the Instagram token
alive.

```
src/                  React app (/, /book, /gallery)
api/instagram.js      GET  /api/instagram: gallery posts (CDN-cached 15 min)
api/health.js         GET  /api/health: token status, never the token itself
api/cron/refresh-instagram-token.js   daily token rotation (Vercel Cron)
api/_lib/             shared helpers (not routes)
vercel.json           build settings, SPA rewrites, cron schedule
public/privacy-policy.html            served at /privacy-policy.html (Meta requires one)
```

## How the Instagram token stays alive

Instagram long-lived tokens expire 60 days after their last refresh, and an
expired token can't be refreshed. So:

1. You paste a token into the `INSTAGRAM_ACCESS_TOKEN` env var once.
2. Every day Vercel Cron calls `/api/cron/refresh-instagram-token`. Once the
   token is a week old, the job swaps it for a fresh 60-day token and saves it
   in Redis (Upstash). A few missed runs still leave weeks of slack.
3. `/api/instagram` always reads the newest token from Redis.
4. Pasting a different token into `INSTAGRAM_ACCESS_TOKEN` later always wins
   over the stored one, so manual recovery is "paste and redeploy".
5. A weekly GitHub Action (`.github/workflows/instagram-health-check.yml`)
   opens an issue if the token is within 14 days of expiring or the gallery is
   failing.

## One-time Vercel setup

1. **Project settings → Build and Deployment → Root Directory**: leave it empty
   (repo root). Framework, build command, and output come from `vercel.json`.
2. **Storage → Upstash for Redis** (Marketplace, free tier is plenty): create
   a database and connect it to this project. That adds `KV_REST_API_URL` and
   `KV_REST_API_TOKEN`.
3. **Settings → Environment Variables** (Production):
   - `INSTAGRAM_ACCESS_TOKEN`: a long-lived token (see below)
   - `CRON_SECRET`: any random string of 16+ characters (`openssl rand -hex 24`)
4. Redeploy. The cron shows up under **Settings → Cron Jobs**.

### Getting a new Instagram token

Meta App Dashboard → your app → **Instagram → API setup with Instagram
business login** → **Generate token** next to the business account. That
gives a 60-day long-lived token. Instagram only lets a token be refreshed once
it's 24 hours old, so the first cron run may fail if the token is brand new.
It succeeds the next day.

### Useful commands

```bash
# Token status (source, last refresh, expiry)
curl -s https://<site>/api/health

# Force a refresh now instead of waiting for the cron
curl -s -H "Authorization: Bearer $CRON_SECRET" \
  "https://<site>/api/cron/refresh-instagram-token?force=1"
```

## Local development

```bash
npm install
cp .env.example .env.local   # fill in INSTAGRAM_ACCESS_TOKEN (Redis is optional locally)
npm run dev
```

`npm run dev` also serves the `api/` functions through a small Vite plugin
(see `vite.config.js`), so the gallery works locally without the Vercel CLI.

## Hosting the frontend elsewhere

If the frontend is deployed somewhere other than Vercel (e.g. the old Netlify
site), set `VITE_API_BASE_URL=https://<vercel-site>` in that host's build
environment and the gallery will call the Vercel API instead (CORS is open on
`/api/instagram`).
