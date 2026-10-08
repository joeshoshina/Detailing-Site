import { ChevronDown } from "lucide-react";
import SectionHeading from "./SectionHeading";
import faq from "../data/faq";

/**
 * Faq.jsx
 * ----------------------------
 * Common questions as native <details> accordions: keyboard accessible with
 * no JavaScript, and the answers stay in the HTML for search engines.
 * Also published as FAQPage structured data (see src/seo.js).
 */

const Faq = () => (
  <section id="faq" className="bg-white py-20 sm:py-24">
    <div className="mx-auto max-w-3xl px-6">
      <SectionHeading eyebrow="FAQ" title="Questions, answered" />

      <div className="mt-12 divide-y divide-gray-200 border-y border-gray-200">
        {faq.map(({ question, answer }) => (
          <details key={question} className="group py-5">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left text-lg font-semibold text-gray-900 [&::-webkit-details-marker]:hidden">
              {question}
              <ChevronDown
                size={22}
                aria-hidden="true"
                className="shrink-0 text-brand transition-transform group-open:rotate-180"
              />
            </summary>
            <p className="mt-3 leading-relaxed text-gray-600">{answer}</p>
          </details>
        ))}
      </div>
    </div>
  </section>
);

export default Faq;
