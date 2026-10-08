// Build-time entry used by scripts/prerender.js to render each route to static
// HTML (not shipped to the browser).
import React from "react";
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom";
import AppRoutes from "./AppRoutes.jsx";
import { getPageMeta, renderHeadTags, PRERENDER_PATHS, SITE_URL } from "./seo.js";

export { PRERENDER_PATHS, SITE_URL };

export function render(url) {
  const html = renderToString(
    <React.StrictMode>
      <StaticRouter location={url}>
        <AppRoutes />
      </StaticRouter>
    </React.StrictMode>,
  );
  return { html, head: renderHeadTags(getPageMeta(url)) };
}
