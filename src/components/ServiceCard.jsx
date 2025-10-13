/**
 * ServiceCard Component
 * ----------------------------
 * Displays a single service summary in a card format.
 *
 * Props:
 *  - title: string, the name of the service
 *  - price: string, price of the service
 *  - description: string, short description of the service
 *  - image: string, URL or path of the service image
 *  - onInfoClick: function, callback triggered when "More Info" is clicked
 *
 * Features:
 *  - Card with rounded corners, shadow, and hover effect for depth
 *  - Image with fixed height and object-cover to maintain aspect ratio
 *  - Truncated description to two lines (line-clamp)
 *  - Prominent price display
 *  - "More Info" button triggers a callback to open modal or navigate
 */

const ServiceCard = ({ title, price, description, image, onInfoClick }) => {
  return (
    // Card container
    // - White background, rounded corners, shadow for depth
    // - Centered content, text-align center
    // - Hover effect elevates shadow for interactivity
    // - Relative positioning for potential badges or overlays
    <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center text-center hover:shadow-xl transition relative">
      {/* Service image */}
      {/* 
        - Fixed height to maintain uniform card sizes
        - Object-cover ensures image fills container without distortion
        - Rounded corners to match card style
        - Margin bottom separates from title
      */}
      <img
        src={image}
        alt={title}
        className="h-40 w-full object-cover rounded-md mb-4"
      />

      {/* Service title */}
      {/* 
        - Slightly larger, bold font for hierarchy
        - Gray text for readability
      */}
      <h3 className="text-xl font-semibold text-gray-800">{title}</h3>

      {/* Service description */}
      {/* 
        - Gray text for secondary information
        - Margin-top to separate from title
        - line-clamp-2 truncates text after 2 lines to maintain consistent card height
      */}
      <p className="text-gray-600 mt-2 line-clamp-2">{description}</p>

      {/* Service price */}
      {/* 
        - Bold and blue to draw attention
        - Margin-top for spacing
      */}
      <span className="mt-3 text-lg font-bold text-blue-600">{price}</span>

      {/* More Info button */}
      {/* 
        - Trigger callback to show more details (e.g., open modal)
        - Styled as link with hover underline and color change
        - Margin-top separates from price
      */}
      <button
        onClick={onInfoClick}
        className="mt-4 text-blue-600 font-medium hover:underline hover:text-blue-700 transition"
      >
        More Info →
      </button>
    </div>
  );
};

export default ServiceCard;
