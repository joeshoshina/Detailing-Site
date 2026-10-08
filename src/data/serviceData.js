import exteriorDetailImage from "../assets/exterior_detail.webp";
import interiorDetailImage from "../assets/interior_detail.webp";
import interiorExteriorImage from "../assets/interior_exterior.webp";
import paintCorrectionImage from "../assets/paint_correction.webp";
import carpetExtractionImage from "../assets/carpet_extraction.webp";

// slug    → page URL: /services/<slug>
// seo     → that page's <h1>, <title> and meta description (search keywords)
// details → light markdown: one paragraph per line, **bold**
const services = [
  {
    id: 1,
    slug: "exterior-detailing",
    title: "Exterior Detail",
    price: "$85",
    description:
      "Thorough exterior wash, wax, and polish for a spotless shine.",
    details: `
**Purpose:** Ideal for routine maintenance and protection.  
Our standard exterior detail includes a pre-rinse and foam prewash to loosen dirt, followed by a full contact hand wash using premium pH-balanced soap. Tires and wheels are deep cleaned, then the vehicle is rinsed, towel-dried, and finished with a tire shine for a clean, even gloss.  
Hard water spot removal, tar, or bug buildup may require additional charge.  
**Price may vary by vehicle size and condition.**
    `,
    image: exteriorDetailImage,
    imageAlt: "Blue Subaru WRX STI after a mobile exterior detail",
    seo: {
      heading: "Mobile Exterior Car Detailing",
      title: "Mobile Exterior Car Detailing in San Fernando Valley",
      description:
        "Mobile exterior detailing from $85: foam prewash, full hand wash with pH-balanced soap, deep-cleaned wheels and tire shine, done at your driveway in the SFV.",
    },
  },
  {
    id: 2,
    slug: "interior-detailing",
    title: "Interior Detail",
    price: "$85",
    description: "Deep clean for carpets, seats, and all interior surfaces.",
    details: `
**Purpose:** Perfect for regular upkeep and a refreshed cabin.  
We start with a full vacuum of seats, carpets, and floor mats, followed by a gentle wipe-down of all interior surfaces. Plastics, door panels, and vents are detailed and finished with a UV-protectant dressing to restore a natural, satin finish. Leather seats (if applicable) are carefully cleaned and conditioned to maintain softness and prevent cracking.  
Additional charge may apply for excessive dirt, stains, or pet hair.  
**Price may vary by vehicle size and condition.**
    `,
    image: interiorDetailImage,
    imageAlt: "Clean Volkswagen interior with leather seats after an interior detail",
    seo: {
      heading: "Mobile Interior Car Detailing",
      title: "Mobile Interior Car Detailing in San Fernando Valley",
      description:
        "Mobile interior detailing from $85: full vacuum, surface wipe-down, UV-protectant dressing, and leather cleaning and conditioning, at your home in the SFV.",
    },
  },
  {
    id: 3,
    slug: "full-detail",
    title: "Inside & Outside Package",
    price: "$150",
    description:
      "Complete detailing package covering both interior and exterior.",
    details: `
**Purpose:** A complete maintenance detail for both interior and exterior.  
This full-service package combines the Exterior Detail and Interior Detail to deliver a thorough refresh of your entire vehicle. From clean paint and polished wheels to a spotless, protected interior — this package restores your car’s look and feel in one visit.  
Recommended for vehicles that need balanced care inside and out.  
**Price may vary by vehicle size and condition.**
    `,
    image: interiorExteriorImage,
    imageAlt: "Honda interior and front end shown half before, half after a full detail",
    seo: {
      heading: "Full Interior & Exterior Car Detail",
      title: "Full Car Detail Inside & Out | San Fernando Valley",
      description:
        "Our Inside & Outside Package from $150 combines a full exterior and interior detail in one mobile visit anywhere in the San Fernando Valley. Book online.",
    },
  },
  {
    id: 4,
    slug: "paint-correction",
    title: "Paint Correction",
    price: "$450",
    description: "Removes scratches & swirls. Exterior detail included.",
    details: `
**Purpose:** Designed for restoring shine, depth, and surface clarity.  
This service includes everything in the Exterior Detail, plus a full paint enhancement process. After a clay bar decontamination, we perform a light compound and polish to reduce minor oxidation, swirl marks, and light scratches. The finish is sealed with a premium wax for long-lasting protection and gloss.  
Severe scratches or paint defects may require additional stages or pricing.  
**Price may vary by vehicle size and paint condition.**
    `,
    image: paintCorrectionImage,
    imageAlt: "Toyota 4Runner hood half polished, showing the before and after of paint correction",
    seo: {
      heading: "Paint Correction & Swirl Removal",
      title: "Paint Correction & Swirl Removal | San Fernando Valley",
      description:
        "Mobile paint correction from $450: clay bar, compound and polish to cut swirl marks, light scratches and oxidation, sealed with premium wax. SFV-wide.",
    },
  },
  {
    id: 5,
    slug: "carpet-seat-extraction",
    title: "Carpet & Seat Extraction",
    price: "$150",
    description: "Deep fabric cleaning. Interior detail included.",
    details: `
**Purpose:** Deep restoration for stained or heavily used interiors.  
Includes everything in the Interior Detail, with added hot-water extraction to remove embedded dirt, stains, and odors from cloth seats, carpets, and mats. Specialized stain treatments are applied as needed, leaving your interior refreshed, sanitized, and residue-free.  
Excessive staining, spills, or pet hair may require additional charge.  
**Price may vary by vehicle size and condition.**
    `,
    image: carpetExtractionImage,
    imageAlt: "Cloth car seat half cleaned with hot-water extraction",
    seo: {
      heading: "Car Carpet & Seat Shampoo Extraction",
      title: "Car Seat & Carpet Shampoo | San Fernando Valley",
      description:
        "Hot-water extraction from $150 lifts stains, dirt and odors from cloth seats, carpets and mats. Includes a full interior detail, at your home in the SFV.",
    },
  },
];

export default services;
