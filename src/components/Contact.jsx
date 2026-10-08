import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Instagram } from "lucide-react";
import business from "../data/business";

/**
 * Contact.jsx
 * ----------------------------
 * Closing call-to-action band: book or call, plus the other ways to reach us
 * (the phone number is already on the Call button).
 */

const CONTACT_ITEMS = [
  { icon: Mail, label: "Email", value: business.email, href: `mailto:${business.email}` },
  {
    icon: Instagram,
    label: "Instagram",
    value: `@${business.instagram}`,
    href: business.instagramUrl,
    external: true,
  },
  { icon: MapPin, label: "Service area", value: business.area },
];

const Contact = () => {
  return (
    <section
      id="contact"
      className="bg-gradient-to-br from-ink via-brand to-ink-deep py-20 sm:py-24 text-white"
    >
      <div className="mx-auto max-w-5xl px-6 text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-accent">
          Get in touch
        </p>
        <h2 className="mt-2 text-3xl sm:text-4xl font-bold tracking-tight text-balance">
          Ready for a spotless car?
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-lg text-white/80">
          Book online in a few clicks, or reach out with any questions.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/book"
            className="w-full sm:w-auto rounded-lg bg-white px-8 py-3.5 text-lg font-semibold text-brand hover:bg-brand-tint transition-colors"
          >
            Book Now
          </Link>
          <a
            href={business.phoneHref}
            className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-lg border border-white/70 px-8 py-3.5 text-lg font-semibold hover:bg-white/10 transition-colors"
          >
            <Phone size={20} /> Call {business.phone}
          </a>
        </div>

        <ul className="mt-14 grid gap-4 text-left sm:grid-cols-3">
          {CONTACT_ITEMS.map((item) => {
            const { label, value, href, external } = item;
            const Icon = item.icon;
            const content = (
              <>
                <Icon size={22} className="shrink-0 text-accent" aria-hidden="true" />
                <span className="min-w-0">
                  <span className="block text-sm text-white/60">{label}</span>
                  <span className="block break-words font-medium">{value}</span>
                </span>
              </>
            );
            const boxClass =
              "flex h-full items-start gap-3 rounded-xl bg-white/5 p-4 ring-1 ring-white/10";
            return (
              <li key={label}>
                {href ? (
                  <a
                    href={href}
                    {...(external && { target: "_blank", rel: "noopener noreferrer" })}
                    className={`${boxClass} hover:bg-white/10 transition-colors`}
                  >
                    {content}
                  </a>
                ) : (
                  <div className={boxClass}>{content}</div>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
};

export default Contact;
