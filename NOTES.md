# Notes & To-Do

Open items for the site. Technical details live in [README.md](README.md).

## Launch checklist (search rankings)

These matter more for local search than anything left in the code.

- [ ] **Google Business Profile.** Set it up as a *service-area business* (no
      public address). Use exactly the same name, phone, and website as the
      site, list the San Fernando Valley neighborhoods as the service area,
      pick "Car detailing service" as the category, and add photos. This is
      what drives the "near me" map results.
- [ ] **Google Search Console.** Verify the site, submit `/sitemap.xml`, and
      request indexing for the home page and the five `/services/...` pages.
- [ ] **Custom domain** (e.g. `crautodetailing.com`):
  - [ ] Add it in Vercel → Project → Settings → Domains, and redirect the
        `vercel.app` address to it
  - [ ] Change `url` in `src/data/business.js` (canonical URLs, sitemap, and
        structured data all follow)
  - [ ] Set the GitHub repo variable `SITE_URL` so the weekly health check
        hits the new address
  - [ ] Update the privacy policy URL in the Meta app settings if it uses the
        old address
- [ ] **Retire the old Netlify site** (`crautodetailing.netlify.app`). It's a
      duplicate copy with a broken gallery that competes with this one in
      search. Update the link on the portfolio site to the new address.
- [ ] **Shut down the old Render service** (`detailing-site.onrender.com`).
      Nothing uses it anymore.
- [ ] **Reviews.** Ask happy customers for Google reviews and reply to them.
- [ ] **Other listings.** Yelp, Bing Places, Apple Business Connect, all with
      the identical name, phone, and website.

## Please confirm

- [ ] **Service-area neighborhoods** in `src/data/business.js` (`serviceAreas`).
      These were picked from across the Valley; remove any you don't cover.
- [ ] **Contact email** `crautdetail@outlook.com`: is it a typo of
      "crautodetail"? It appears on the site, in the privacy policy, and in
      the structured data, all from `src/data/business.js`.
- [ ] **FAQ answers** in `src/data/faq.js` still match how you work.

## Safe to delete

Nothing uses these anymore:

- `server/`: the old Render backend. Its untracked `.env` and `token.json`
  only hold expired tokens.
- Original images in `src/assets/` (`*.png`, `*.jpg`); the site uses the
  `.webp` versions
- `src/privacy-policy/`: the live copy is `public/privacy-policy.html`
- `.github/workflows/token-refresh-reminder.yml` (untracked): replaced by
  `instagram-health-check.yml`
- `netlify.toml`, `_redirects`, `public/_redirects`: Netlify-only, once
  Netlify is retired

## Instagram token

Refreshes itself (daily cron plus a backup on gallery visits), and the weekly
GitHub check opens an issue if anything stalls. If Meta ever revokes the
token (e.g. after an Instagram password change): generate a new one in the
Meta App Dashboard → Instagram → API setup → Generate token, paste it into
the `INSTAGRAM_ACCESS_TOKEN` env var on Vercel, and redeploy.

## Where things live

| What | Where |
| --- | --- |
| Hosting, env vars, cron logs | Vercel project `joeshoshinas-projects/detailing-site` |
| Token storage | Upstash Redis `upstash-crauto` (Vercel → Storage) |
| Booking calendar | Setmore `crautodetailingbjo3.setmore.com` |
| Instagram | `@crauto.detailing` |
| Health alerts | GitHub issues labeled `instagram-health` |

The Vercel CLI was signed in on Joe's Mac during setup; run
`npx vercel logout` to revoke it.
