import { Link } from "react-router-dom";
import business from "../data/business";
import services from "../data/serviceData";

const FOOTER_LINKS = [
  { name: "Services", to: "/#services" },
  { name: "Service Areas", to: "/#areas" },
  { name: "FAQ", to: "/#faq" },
  { name: "Gallery", to: "/gallery" },
  { name: "Book Now", to: "/book" },
  { name: "About", to: "/#about" },
];

const Footer = () => {
  return (
    // Extra bottom padding on phones so the sticky Book/Call bar never covers it
    <footer className="bg-ink-deep pb-24 text-gray-300 md:pb-0">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-12 sm:grid-cols-2 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <Link to="/" className="inline-flex items-center gap-3">
            <img src="/logo.png" alt="" className="h-12 w-12 object-contain" />
            <span className="text-lg font-bold text-white">{business.name}</span>
          </Link>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-gray-400">
            Premium mobile auto detailing across the San Fernando Valley, right
            in your driveway.
          </p>
        </div>

        <nav aria-label="Services">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-white">
            Services
          </h2>
          <ul className="mt-4 space-y-2 text-sm">
            {services.map((service) => (
              <li key={service.slug}>
                <Link to={`/services/${service.slug}`} className="hover:text-white transition-colors">
                  {service.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Footer">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-white">
            Explore
          </h2>
          <ul className="mt-4 space-y-2 text-sm">
            {FOOTER_LINKS.map(({ name, to }) => (
              <li key={name}>
                <Link to={to} className="hover:text-white transition-colors">
                  {name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-white">
            Contact
          </h2>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <a href={business.phoneHref} className="hover:text-white transition-colors">
                {business.phone}
              </a>
            </li>
            <li>
              <a
                href={`mailto:${business.email}`}
                className="break-words hover:text-white transition-colors"
              >
                {business.email}
              </a>
            </li>
            <li>
              <a
                href={business.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
              >
                @{business.instagram}
              </a>
            </li>
            <li className="text-gray-400">{business.area}</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-6 py-6 text-xs text-gray-400 sm:flex-row sm:justify-between">
          <p>
            {/* Year is baked in at build time; let the browser update it */}
            &copy; <span suppressHydrationWarning>{new Date().getFullYear()}</span>{" "}
            {business.name} ·{" "}
            <a href="/privacy-policy.html" className="hover:text-white hover:underline">
              Privacy Policy
            </a>
          </p>
          <p>
            Built by{" "}
            <a
              href="https://joehoshina.netlify.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white hover:underline"
            >
              Joe Hoshina
            </a>{" "}
            with React, Tailwind CSS, and Vercel
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
