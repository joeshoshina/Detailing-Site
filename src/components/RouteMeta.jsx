import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { getPageMeta } from "../seo";

// Finds or creates a <meta>/<link> tag in <head> and sets one attribute on it.
function upsertTag(tag, keyAttr, keyValue, attr, value) {
  let el = document.head.querySelector(`${tag}[${keyAttr}="${keyValue}"]`);
  if (value == null) return el?.remove();
  if (!el) {
    el = document.createElement(tag);
    el.setAttribute(keyAttr, keyValue);
    document.head.append(el);
  }
  el.setAttribute(attr, value);
}

// Keeps the tab title, description, canonical URL and social tags in sync with
// the route during client-side navigation. The first page load already has
// all of these baked into its HTML by scripts/prerender.js.
const RouteMeta = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    const meta = getPageMeta(pathname);
    document.title = meta.title;
    upsertTag("meta", "name", "description", "content", meta.description);
    upsertTag("link", "rel", "canonical", "href", meta.noindex ? null : meta.url);
    upsertTag("meta", "name", "robots", "content", meta.noindex ? "noindex" : null);
    upsertTag("meta", "property", "og:title", "content", meta.title);
    upsertTag("meta", "property", "og:description", "content", meta.description);
    upsertTag("meta", "property", "og:url", "content", meta.url);
  }, [pathname]);

  return null;
};

export default RouteMeta;
