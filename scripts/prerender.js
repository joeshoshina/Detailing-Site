// Runs after the client and SSR builds (see "build" in package.json).
//
// Writes static HTML for every route into dist/ with that page's content and
// <head> tags (title, description, canonical, social tags, structured data),
// so search engines and link previews get real content without running JS.
// Also generates sitemap.xml, robots.txt, and 404.html.
//
// Vercel serves dist/<path>.html at /<path> (cleanUrls in vercel.json).

import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const dist = path.resolve("dist");
const serverDir = path.resolve("dist-server");
const ROOT_DIV = '<div id="root"></div>';
const HEAD_SLOT = "<!--app-head-->";

const template = fs.readFileSync(path.join(dist, "index.html"), "utf8");
if (!template.includes(ROOT_DIV) || !template.includes(HEAD_SLOT)) {
  throw new Error(`index.html must contain ${ROOT_DIV} and ${HEAD_SLOT}`);
}

const { render, PRERENDER_PATHS, SITE_URL } = await import(
  pathToFileURL(path.join(serverDir, "entry-server.js")).href
);

function writePage(urlPath, file) {
  const { html, head } = render(urlPath);
  const page = template
    .replace(HEAD_SLOT, head)
    .replace(ROOT_DIV, `<div id="root">${html}</div>`);
  const target = path.join(dist, file);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, page);
  console.log(`prerendered ${urlPath.padEnd(36)} → dist/${file}`);
}

for (const urlPath of PRERENDER_PATHS) {
  writePage(urlPath, urlPath === "/" ? "index.html" : `${urlPath.slice(1)}.html`);
}
writePage("/404", "404.html");

const today = new Date().toISOString().slice(0, 10);
fs.writeFileSync(
  path.join(dist, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${PRERENDER_PATHS.map(
  (p) => `  <url><loc>${SITE_URL}${p}</loc><lastmod>${today}</lastmod></url>`,
).join("\n")}
</urlset>
`,
);

fs.writeFileSync(
  path.join(dist, "robots.txt"),
  `User-agent: *
Allow: /
Disallow: /api/

Sitemap: ${SITE_URL}/sitemap.xml
`,
);

fs.rmSync(serverDir, { recursive: true, force: true });
console.log(`wrote sitemap.xml (${PRERENDER_PATHS.length} URLs) and robots.txt`);
