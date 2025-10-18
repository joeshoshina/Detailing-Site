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
 *  - Stops click propagation to prevent accidental modal closure when interacting inside
 *  - Responsive, visually appealing card with rounded corners and shadow
 *  - Close button using Lucide X icon
 *  - Includes Book Now link to booking page
 */

const ServiceModal = ({ service, onClose }) => {
  // If no service is provided, do not render the modal to prevent runtime errors
  if (!service) return null;

  return (
    // Full-screen overlay
    // - fixed to cover entire viewport
    // - semi-transparent black background to keep focus on modal
    // - backdrop blur creates modern "frosted glass" look
    // - flexbox centers the modal vertically and horizontally
    <div className="fixed inset-0 bg-black/40 backdrop-blur-[1px] flex items-center justify-center z-50">
      {/* Modal container */}
      {/* 
        - White background card with rounded corners and shadow for depth
        - Max width to prevent excessive stretching on large screens
        - Relative positioning for absolute elements inside (like close button)
        - Padding for internal spacing
        - Animate-fadeIn class for entrance animation
        - stopPropagation prevents closing modal when clicking inside
      */}
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-sm sm:max-w-md md:max-w-lg relative p-4 sm:p-6 animate-fadeIn max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        {/* 
          - Positioned at top-right corner using absolute positioning
          - Uses Lucide X icon for consistency with design
          - Hover effect for visual feedback
          - Calls onClose callback to hide modal
        */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-900"
        >
          <X size={24} />
        </button>

        {/* Service image */}
        {/* 
          - Full-width image with fixed height
          - Rounded corners to match modal style
          - Object-cover ensures image fills container without distortion
          - Margin bottom separates from text content
        */}
        <img
          src={service.image}
          alt={service.title}
          className="rounded-lg w-full h-56 object-cover mb-4"
        />

        {/* Service title */}
        {/* 
          - Bold, large heading
          - Margin-bottom separates from description
        */}
        <h2 className="text-2xl font-bold mb-2">{service.title}</h2>

        {/* Service details */}
        {/* 
          - Paragraph text for service description
          - Gray color for secondary emphasis
          - whitespace-pre-line preserves line breaks in service.details
          - Margin-bottom separates from price
        */}
        <p className="text-gray-700 mb-4 whitespace-pre-line">
          {service.details}
        </p>

        {/* Service price */}
        {/* 
          - Highlighted with blue text and bold font
          - Provides clear visual hierarchy
        */}
        <p className="text-lg font-semibold mb-6 text-blue-600">
          {service.price}
        </p>

        {/* Book Now link */}
        {/* 
          - Navigates user to booking page
          - Styled as prominent button with rounded corners
          - Hover effect for interactivity
        */}
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
