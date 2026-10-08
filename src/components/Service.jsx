import { useState } from "react";
import ServiceCard from "./ServiceCard";
import ServiceModal from "./ServiceModal";
import SectionHeading from "./SectionHeading";
import services from "../data/serviceData";

/**
 * Service Component
 * ----------------------------
 * Displays all services in a responsive grid layout.
 * Allows users to open a modal with more details for each service.
 *
 * Features:
 *  - 1/2/3 cards per row by screen size; the last row stays centered
 *  - Uses ServiceCard for each service summary
 *  - Tracks selected service in state to display ServiceModal
 */

const Service = () => {
  // State to track which service is currently selected for modal display
  const [selectedService, setSelectedService] = useState(null);

  return (
    <section id="services" className="bg-gray-50 py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading eyebrow="Services & pricing" title="Our Services">
          Starting prices shown. Final price depends on your vehicle's size and
          condition.
        </SectionHeading>

        {/* flex-wrap + justify-center keeps an incomplete last row centered */}
        <div className="mt-14 flex flex-wrap justify-center gap-6">
          {services.map((service) => (
            <div
              key={service.id}
              className="flex w-full sm:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-1rem)]"
            >
              <ServiceCard
                title={service.title}
                price={service.price}
                description={service.description}
                image={service.image}
                imageAlt={service.imageAlt}
                onInfoClick={() => setSelectedService(service)}
              />
            </div>
          ))}
        </div>
      </div>

      <ServiceModal
        service={selectedService}
        onClose={() => setSelectedService(null)}
      />
    </section>
  );
};

export default Service;
