import { useEffect, useRef } from "react";
import { X, Phone, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import ServiceDetails from "./ServiceDetails";
import business from "../data/business";

/**
 * ServiceModal Component
 * ----------------------------
 * Displays detailed information about a single service in a modal overlay.
 *
 * Props:
 *  - service: object containing `title`, `image`, `details`, and `price`, or null
 *  - onClose: function to close the modal
 *
 * Features:
 *  - Native <dialog> opened with showModal(): the browser traps focus inside,
 *    closes on Escape, and returns focus to the card that opened it
 *  - Closes via the X button, Escape, or a click on the dimmed backdrop
 *  - Page scroll is locked while open (see index.css)
 *  - Renders the light markdown in `details` via ServiceDetails
 *  - Book / Call actions, plus a link to the service's own page
 */

const ServiceModal = ({ service, onClose }) => {
  const dialogRef = useRef(null);

  // Open/close the native dialog to match the selected service
  useEffect(() => {
    const dialog = dialogRef.current;
    if (service && !dialog.open) dialog.showModal();
    if (!service && dialog.open) dialog.close();
  }, [service]);

  const close = () => dialogRef.current.close();

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      // Clicks on the backdrop land on the <dialog> itself
      onClick={(e) => e.target === dialogRef.current && close()}
      aria-label={service?.title}
      className="m-auto w-[calc(100%-2rem)] max-w-lg overflow-visible bg-transparent p-0 backdrop:bg-black/50 backdrop:backdrop-blur-[2px]"
    >
      {service && (
        <div className="relative max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-xl animate-scale-in">
          <button
            onClick={close}
            aria-label="Close"
            className="absolute top-3 right-3 rounded-full bg-white/90 p-1.5 text-gray-700 shadow hover:text-gray-900"
          >
            <X size={22} />
          </button>

          <img
            src={service.image}
            alt={service.imageAlt}
            className="h-56 w-full object-cover"
          />

          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-900">{service.title}</h2>
            <p className="mt-1 text-gray-600">
              Starting at{" "}
              <span className="text-xl font-bold text-brand">{service.price}</span>
            </p>

            <div className="mt-4 text-gray-700">
              <ServiceDetails details={service.details} />
            </div>

            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <Link
                to="/book"
                className="flex-1 rounded-lg bg-brand py-3 text-center font-semibold text-white hover:bg-brand-dark transition-colors"
              >
                Book This Service
              </Link>
              <a
                href={business.phoneHref}
                className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-brand py-3 font-semibold text-brand hover:bg-brand-tint transition-colors"
              >
                <Phone size={18} /> Call Us
              </a>
            </div>

            <Link
              to={`/services/${service.slug}`}
              className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand hover:text-brand-dark"
            >
              Full service page <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>
        </div>
      )}
    </dialog>
  );
};

export default ServiceModal;
