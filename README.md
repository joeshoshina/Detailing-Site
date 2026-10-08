# CR Auto Detailing

Marketing site for CR Auto Detailing: React 19 + Vite + Tailwind v4, with an
Instagram-powered gallery. Everything runs on one Vercel project: the static
site, the `/api` functions, and a daily cron that keeps the Instagram token
alive.

Open to-dos (launch checklist, things to confirm, cleanup): see
[NOTES.md](NOTES.md).

```
src/                  React app (/, /book, /gallery, /services/<slug>)
src/seo.js            per-page titles, descriptions, structured data (keyword map)
src/entry-server.jsx  build-time renderer used by scripts/prerender.js
scripts/prerender.js  writes static HTML per page + sitemap.xml + robots.txt
api/instagram.js      GET  /api/instagram: gallery posts (CDN-cached 15 min)
api/health.js         GET  /api/health: token status, never the token itself
api/cron/refresh-instagram-token.js   daily token rotation (Vercel Cron)
api/_lib/             shared helpers (not routes), incl. refresh.js
src/data/business.js  phone, email, Instagram handle used across the site
vercel.json           build settings, SPA rewrites, cron schedule
public/privacy-policy.html            served at /privacy-policy.html (Meta requires one)
```

## SEO

`npm run build` prerenders every page to static HTML (`scripts/prerender.js`),
so search engines, AI crawlers, and link previews get the full content and
that page's tags without running JavaScript. React then hydrates it in the
browser. Each page gets a unique `<title>`, meta description, canonical URL,
Open Graph tags, and schema.org JSON-LD (`AutoWash` local business with
service area and prices, `Service` + breadcrumbs per service, `FAQPage`).
Unknown URLs return a real 404 (`404.html`), and the build writes
`sitemap.xml` and `robots.txt`.

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

**Off-site steps that matter most for local rankings** (can't be done in code):
1. Google Search Console: verify the site and submit `/sitemap.xml`.
2. Google Business Profile as a service-area business (no public address),
   with the same name, phone, and site URL as here, the service area, and
   photos. This drives the "near me" map results.
3. Ask happy customers for Google reviews; reply to them.
4. List the business on Yelp, Bing Places, and Apple Business Connect with
   identical name/phone/URL.
5. Retire duplicate copies of the site (the old Netlify deploy) so they don't
   compete with this one.

## How the Instagram token stays alive

Instagram long-lived tokens expire 60 days after their last refresh, and an
expired token can't be refreshed. So:

1. You paste a token into the `INSTAGRAM_ACCESS_TOKEN` env var once.
2. **Primary:** every day Vercel Cron calls `/api/cron/refresh-instagram-token`.
   Once the token is a week old, the job swaps it for a fresh 60-day token and
   saves it in Redis (Upstash). That leaves ~50 days of slack if runs fail.
   The daily Redis read also stops Upstash archiving the free database.
3. **Backup:** if the token is ever more than 10 days old (the cron has missed
   several runs), the next gallery visit refreshes it in the background via
   `waitUntil`, without slowing the response. A short Redis lock stops the
   cron and the backup from refreshing at the same time.
4. `/api/instagram` always reads the newest token from Redis.
5. Pasting a different token into `INSTAGRAM_ACCESS_TOKEN` later always wins
   over the stored one, so manual recovery is "paste and redeploy".
6. **Alerting:** a weekly GitHub Action
   (`.github/workflows/instagram-health-check.yml`) opens an issue if the last
   refresh is more than 10 days old (≈50 days before anything breaks), the
   token is within 14 days of expiring, or the gallery is failing. It
   re-enables itself each run so GitHub's 60-day inactivity rule can't turn it
   off.

## One-time Vercel setup

1. **Project settings → Build and Deployment → Root Directory**: leave it empty
   (repo root). Framework, build command, and output come from `vercel.json`.
2. **Storage → Upstash for Redis** (Marketplace, free tier is plenty): create
   a database and connect it to this project. That adds `KV_REST_API_URL` and
   `KV_REST_API_TOKEN`.
3. **Settings → Environment Variables** (Production):
   - `INSTAGRAM_ACCESS_TOKEN`: a long-lived token (see below)
   - `CRON_SECRET`: any random string of 16+ characters (`openssl rand -hex 24`).
     Store it as a non-sensitive variable so you can reveal it later for
     manual refreshes.
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
