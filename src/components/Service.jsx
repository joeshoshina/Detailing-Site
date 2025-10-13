import { useState } from "react";
import ServiceCard from "./ServiceCard";
import ServiceModal from "./ServiceModal";
import services from "../data/serviceData";

/**
 * Service Component
 * ----------------------------
 * Displays all services in a responsive grid layout.
 * Allows users to open a modal with more details for each service.
 *
 * Features:
 *  - Responsive 1/2/3 column layout based on screen size
 *  - Uses ServiceCard for each service summary
 *  - Tracks selected service in state to display ServiceModal
 *  - Modal can be closed by clicking the close button
 */

const Service = () => {
  // State to track which service is currently selected for modal display
  const [selectedService, setSelectedService] = useState(null);

  return (
    <section id="services" className="py-20 bg-gray-100">
      {/* Section title */}
      <h2 className="text-3xl font-bold text-center mb-10">Our Services</h2>

      {/* Grid container for service cards */}
      {/* 
        - grid-cols-1: mobile default
        - sm:grid-cols-2: small screens (≥640px)
        - lg:grid-cols-3: large screens (≥1024px)
        - gap-8: spacing between cards
        - max-w-6xl mx-auto px-6: center grid with padding and max width
      */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto px-6">
        {services.map((service) => (
          <ServiceCard
            key={service.id}
            title={service.title}
            price={service.price}
            description={service.description}
            image={service.image}
            // When "More Info" is clicked, open the modal for this service
            onInfoClick={() => setSelectedService(service)}
          />
        ))}
      </div>

      {/* Service details modal */}
      {/* 
        - Receives the currently selected service from state
        - onClose callback resets selectedService to null, closing the modal
        - ServiceModal handles its own layout and backdrop
      */}
      <ServiceModal
        service={selectedService}
        onClose={() => setSelectedService(null)}
      />
    </section>
  );
};

export default Service;
