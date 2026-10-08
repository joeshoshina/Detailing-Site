// Search-engine metadata for every route: <title>, meta description,
// canonical URL, social preview tags, and schema.org structured data.
//
// Used in two places:
// - scripts/prerender.js (via src/entry-server.jsx) writes these tags into
//   each page's static HTML at build time, so crawlers see them without JS
// - components/RouteMeta.jsx updates title/description on client navigation
//
// Keyword map (one search intent per URL):
//   /                    mobile car detailing San Fernando Valley + neighborhoods
//   /services/<slug>     one service each (see seo fields in serviceData.js)
//   /gallery             car detailing before & after
//   /book                book mobile car detailing

import business from "./data/business";
import services from "./data/serviceData";
import faq from "./data/faq";

export const SITE_URL = business.url;
const OG_IMAGE = `${SITE_URL}/og-image.jpg`;
const BUSINESS_ID = `${SITE_URL}/#business`;
const SFV = { "@type": "Place", name: "San Fernando Valley, CA" };

const priceNumber = (price) => Number(price.replace(/[^0-9.]/g, ""));
const absolute = (src) => (src.startsWith("http") ? src : `${SITE_URL}${src}`);

// ---------- Structured data (schema.org JSON-LD) ----------

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: business.name,
  url: `${SITE_URL}/`,
};

// Service-area business: no street address, just the areas served.
const businessSchema = {
  "@context": "https://schema.org",
  "@type": "AutoWash",
  "@id": BUSINESS_ID,
  name: business.name,
  description:
    "Mobile car detailing that comes to your driveway across the San Fernando Valley: exterior and interior details, full details, paint correction, and carpet & seat extraction.",
  url: `${SITE_URL}/`,
  logo: `${SITE_URL}/logo.png`,
  image: OG_IMAGE,
  telephone: business.phoneE164,
  email: business.email,
  priceRange: business.priceRange,
  address: { "@type": "PostalAddress", addressRegion: "CA", addressCountry: "US" },
  areaServed: [
    SFV,
    ...business.serviceAreas.map((name) => ({ "@type": "Place", name: `${name}, CA` })),
  ],
  sameAs: [business.instagramUrl],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Mobile detailing services",
    itemListElement: services.map((service) => ({
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        name: service.title,
        url: `${SITE_URL}/services/${service.slug}`,
      },
      priceSpecification: {
        "@type": "PriceSpecification",
        minPrice: priceNumber(service.price),
        priceCurrency: "USD",
      },
    })),
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faq.map(({ question, answer }) => ({
    "@type": "Question",
    name: question,
    acceptedAnswer: { "@type": "Answer", text: answer },
  })),
};

const serviceSchemas = (service) => {
  const url = `${SITE_URL}/services/${service.slug}`;
  return [
    {
      "@context": "https://schema.org",
      "@type": "Service",
      name: service.title,
      serviceType: service.seo.heading,
      description: service.seo.description,
      url,
      image: absolute(service.image),
      areaServed: SFV,
      provider: {
        "@type": "AutoWash",
        "@id": BUSINESS_ID,
        name: business.name,
        url: `${SITE_URL}/`,
        telephone: business.phoneE164,
      },
      offers: {
        "@type": "Offer",
        url: `${SITE_URL}/book`,
        priceSpecification: {
          "@type": "PriceSpecification",
          minPrice: priceNumber(service.price),
          priceCurrency: "USD",
        },
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
        { "@type": "ListItem", position: 2, name: "Services", item: `${SITE_URL}/#services` },
        { "@type": "ListItem", position: 3, name: service.title, item: url },
      ],
    },
  ];
};

// ---------- Per-page metadata ----------

const PAGES = {
  "/": {
    title: "Mobile Car Detailing San Fernando Valley | CR Auto Detailing",
    description:
      "Mobile car detailing at your driveway across the San Fernando Valley. Exterior & interior details from $85, paint correction & seat shampoo. Book online.",
    jsonLd: [websiteSchema, businessSchema, faqSchema],
  },
  "/gallery": {
    title: "Car Detailing Before & After Photos | CR Auto Detailing",
    description:
      "Before-and-after photos of our mobile car detailing work across the San Fernando Valley, fresh from the CR Auto Detailing Instagram.",
    jsonLd: [],
  },
  "/book": {
    title: "Book Mobile Car Detailing Online | CR Auto Detailing",
    description:
      "Book a mobile car detail online in a few clicks. We come to your driveway anywhere in the San Fernando Valley. Exterior, interior, and full details from $85.",
    jsonLd: [],
  },
  ...Object.fromEntries(
    services.map((service) => [
      `/services/${service.slug}`,
      {
        title: service.seo.title,
        description: service.seo.description,
        image: absolute(service.image),
        jsonLd: serviceSchemas(service),
      },
    ]),
  ),
};

const NOT_FOUND = {
  title: "Page Not Found | CR Auto Detailing",
  description: "This page doesn't exist. Find mobile car detailing services across the San Fernando Valley.",
  jsonLd: [],
  noindex: true,
};

/** Every indexable route: prerendered at build time and listed in sitemap.xml. */
export const PRERENDER_PATHS = Object.keys(PAGES);

export function getPageMeta(pathname) {
  const path = pathname.replace(/\/+$/, "") || "/";
  const page = PAGES[path];
  if (!page) return { ...NOT_FOUND, path, url: null, image: OG_IMAGE };
  return { image: OG_IMAGE, ...page, path, url: `${SITE_URL}${path}` };
}

// ---------- Static <head> tags (build time) ----------

const escapeAttr = (value) =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

export function renderHeadTags(meta) {
  const tags = [
    `<title>${escapeAttr(meta.title)}</title>`,
    `<meta name="description" content="${escapeAttr(meta.description)}" />`,
    meta.noindex
      ? `<meta name="robots" content="noindex" />`
      : `<link rel="canonical" href="${escapeAttr(meta.url)}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="${escapeAttr(business.name)}" />`,
    `<meta property="og:locale" content="en_US" />`,
    `<meta property="og:title" content="${escapeAttr(meta.title)}" />`,
    `<meta property="og:description" content="${escapeAttr(meta.description)}" />`,
    meta.url && `<meta property="og:url" content="${escapeAttr(meta.url)}" />`,
    `<meta property="og:image" content="${escapeAttr(meta.image)}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    // "<" escaped so JSON can't close the script tag early
    ...meta.jsonLd.map(
      (data) =>
        `<script type="application/ld+json">${JSON.stringify(data).replace(/</g, "\\u003c")}</script>`,
    ),
  ];
  return tags.filter(Boolean).join("\n    ");
}
