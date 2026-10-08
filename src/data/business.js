// Single source of truth for contact details shown across the site, and for
// the search-engine data built from them (src/seo.js).
const business = {
  name: "CR Auto Detailing",
  // Public site address used for canonical URLs, the sitemap, and social
  // previews. Change this one line when the site moves to a custom domain.
  url: "https://detailing-site-lemon.vercel.app",
  phone: "(747) 877-3788",
  phoneHref: "tel:+17478773788",
  phoneE164: "+17478773788",
  email: "crautdetail@outlook.com",
  instagram: "crauto.detailing",
  instagramUrl: "https://instagram.com/crauto.detailing",
  area: "San Fernando Valley, CA",
  // Neighborhoods named on the site and in structured data for local search.
  serviceAreas: [
    "Northridge",
    "Granada Hills",
    "Porter Ranch",
    "Chatsworth",
    "Reseda",
    "Van Nuys",
    "North Hills",
    "Panorama City",
    "Sherman Oaks",
    "Encino",
    "Tarzana",
    "Woodland Hills",
    "Canoga Park",
    "North Hollywood",
    "Studio City",
  ],
  priceRange: "$85–$450",
};

export default business;
