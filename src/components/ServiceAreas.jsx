import { MapPin } from "lucide-react";
import SectionHeading from "./SectionHeading";
import business from "../data/business";

/**
 * ServiceAreas.jsx
 * ----------------------------
 * Neighborhoods we drive to, so people searching "mobile detailing
 * <neighborhood>" find us. Edit the list in data/business.js.
 */

const ServiceAreas = () => (
  <section id="areas" className="bg-gray-50 py-20 sm:py-24">
    <div className="mx-auto max-w-5xl px-6">
      <SectionHeading eyebrow="Service area" title="Mobile detailing across the San Fernando Valley">
        We bring the detail to your driveway in neighborhoods all over the
        Valley, including:
      </SectionHeading>

      <ul className="mt-10 flex flex-wrap justify-center gap-2.5">
        {business.serviceAreas.map((area) => (
          <li
            key={area}
            className="inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-gray-700 ring-1 ring-gray-200"
          >
            <MapPin size={16} className="text-brand" aria-hidden="true" />
            {area}
          </li>
        ))}
      </ul>

      <p className="mt-8 text-center text-gray-600">
        Don't see your neighborhood? If you're in the Valley, give us a call at{" "}
        <a href={business.phoneHref} className="font-semibold text-brand hover:text-brand-dark">
          {business.phone}
        </a>
        .
      </p>
    </div>
  </section>
);

export default ServiceAreas;
