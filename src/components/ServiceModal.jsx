import { useEffect } from "react";
import { X } from "lucide-react";
import { Link } from "react-router-dom";

/**
 * ServiceModal Component
 * ----------------------------
 * Displays detailed information about a single service in a modal overlay.
 *
 * Props:
 *  - service: object containing `title`, `image`, `details`, and `price` of the service
 *  - onClose: function to close the modal
 *
 * Features:
 *  - Prevents crashes if no service is provided
 *  - Background overlay with semi-transparent black + blur for "frosted glass" effect
 *  - Closes via the X button, the Escape key, or a click on the backdrop
 *  - Stops click propagation so clicks inside the card don't close it
 *  - Renders the light markdown in `details` (one paragraph per line, **bold**)
 *  - Includes Book Now link to booking page
 */

/**
 * Turns serviceData `details` into paragraphs, rendering **text** as bold.
 * Splitting on a capture group puts the bold text at the odd indices.
 */
const renderDetails = (details) =>
  details
    .trim()
    .split("\n")
    .map((line, i) => (
      <p key={i} className="mb-2 last:mb-0">
        {line
          .trim()
          .split(/\*\*(.+?)\*\*/g)
          .map((part, j) =>
            j % 2 ? (
              <strong key={j} className="text-gray-900">
                {part}
              </strong>
            ) : (
              part
            ),
          )}
      </p>
    ));

const ServiceModal = ({ service, onClose }) => {
  // Escape closes the modal while it's open
  useEffect(() => {
    if (!service) return;
    const handleKeyDown = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [service, onClose]);

  // If no service is provided, do not render the modal to prevent runtime errors
  if (!service) return null;

  return (
    // Full-screen overlay; clicking it closes the modal
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-[1px] flex items-center justify-center z-50 p-4 animate-fade-in"
      onClick={onClose}
    >
      {/* Modal container: stopPropagation keeps clicks inside from closing it */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label={service.title}
        className="bg-white rounded-2xl shadow-xl w-full max-w-sm sm:max-w-md md:max-w-lg relative p-4 sm:p-6 animate-scale-in max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 bg-white/80 rounded-full p-1 text-gray-600 hover:text-gray-900"
        >
          <X size={24} />
        </button>

        {/* Service image */}
        <img
          src={service.image}
          alt={service.title}
          className="rounded-lg w-full h-56 object-cover mb-4"
        />

        <h2 className="text-2xl font-bold mb-2">{service.title}</h2>

        {/* Service details */}
        <div className="text-gray-700 mb-4">{renderDetails(service.details)}</div>

        {/* Service price */}
        <p className="text-lg font-semibold mb-6 text-blue-600">
          {service.price}
        </p>

        {/* Book Now link */}
        <Link
          to="/book"
          className="inline-block bg-blue-600 text-white font-medium py-2 px-5 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Book Now
        </Link>
      </div>
    </div>
  );
};

export default ServiceModal;
