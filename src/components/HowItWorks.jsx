import { Link } from "react-router-dom";
import SectionHeading from "./SectionHeading";

/**
 * HowItWorks.jsx
 * ----------------------------
 * Three-step explainer for first-time customers of a mobile service,
 * ending in a booking call-to-action.
 */

const STEPS = [
  {
    title: "Book online",
    text: "Choose your service and a time that suits you on our booking page.",
  },
  {
    title: "We come to you",
    text: "We show up at your driveway at the scheduled time and get to work.",
  },
  {
    title: "Enjoy the shine",
    text: "Get back a spotless car without ever leaving home.",
  },
];

const HowItWorks = () => (
  <section id="how-it-works" className="bg-white py-20 sm:py-24">
    <div className="mx-auto max-w-6xl px-6">
      <SectionHeading eyebrow="How it works" title="Three steps to a spotless car" />

      <ol className="mt-14 grid gap-10 sm:grid-cols-3">
        {STEPS.map(({ title, text }, i) => (
          <li key={title} className="text-center">
            <span
              className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand text-xl font-bold text-white"
              aria-hidden="true"
            >
              {i + 1}
            </span>
            <h3 className="mt-5 text-lg font-semibold text-gray-900">{title}</h3>
            <p className="mt-2 text-gray-600">{text}</p>
          </li>
        ))}
      </ol>

      <div className="mt-12 text-center">
        <Link
          to="/book"
          className="inline-block rounded-lg bg-brand px-8 py-3.5 text-lg font-semibold text-white hover:bg-brand-dark transition-colors"
        >
          Book Your Detail
        </Link>
      </div>
    </div>
  </section>
);

export default HowItWorks;
