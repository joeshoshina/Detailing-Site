import { MapPin, Sparkles, CalendarCheck } from "lucide-react";
import SectionHeading from "./SectionHeading";

/**
 * Highlights.jsx
 * ----------------------------
 * "Why us" section: the intro paragraph plus three quick reasons to book,
 * each drawn from what the services actually include.
 */

const HIGHLIGHTS = [
  {
    icon: MapPin,
    title: "We come to you",
    text: "Mobile service anywhere in the San Fernando Valley. Your driveway is our shop.",
  },
  {
    icon: Sparkles,
    title: "Pro-grade products",
    text: "Full hand wash with pH-balanced soap, UV-protectant dressings, and premium wax.",
  },
  {
    icon: CalendarCheck,
    title: "Easy online booking",
    text: "Pick a service and a time that works for you in just a few clicks.",
  },
];

const Highlights = () => (
  <section id="why" className="bg-white py-20 sm:py-24">
    <div className="mx-auto max-w-6xl px-6">
      <SectionHeading eyebrow="Why CR Auto Detailing" title="Detailing that comes to you">
        Whether you need a quick exterior wash, a full interior clean, or
        complete paint correction, we bring top-quality detailing right to your
        driveway. Our mission is simple — keep your car spotless, shiny, and
        looking its best.
      </SectionHeading>

      <ul className="mt-14 grid gap-6 sm:grid-cols-3">
        {HIGHLIGHTS.map((item) => {
          const Icon = item.icon;
          return (
            <li
              key={item.title}
              className="flex gap-4 rounded-2xl bg-gray-50 p-5 ring-1 ring-gray-200 sm:block sm:p-6"
            >
              <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-tint text-brand">
                <Icon size={24} aria-hidden="true" />
              </span>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 sm:mt-4">
                  {item.title}
                </h3>
                <p className="mt-1 text-gray-600 sm:mt-2">{item.text}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  </section>
);

export default Highlights;
