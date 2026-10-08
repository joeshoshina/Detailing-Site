import { ArrowRight } from "lucide-react";

/**
 * ServiceCard Component
 * ----------------------------
 * Displays a single service summary in a card format.
 *
 * Props:
 *  - title: string, the name of the service
 *  - price: string, starting price of the service
 *  - description: string, short description of the service
 *  - image: string, URL or path of the service image
 *  - imageAlt: string, description of the photo
 *  - onInfoClick: function, callback triggered when the card is clicked
 *
 * Features:
 *  - The whole card is one button (big, easy target on phones)
 *  - Consistent image ratio, equal-height cards, price pinned to the bottom
 *  - Subtle lift + image zoom on hover
 */

const ServiceCard = ({ title, price, description, image, imageAlt, onInfoClick }) => {
  return (
    <button
      type="button"
      onClick={onInfoClick}
      className="group flex w-full flex-col overflow-hidden rounded-2xl bg-white text-left shadow-sm ring-1 ring-gray-200 transition duration-300 hover:-translate-y-1 hover:shadow-xl"
    >
      <div className="aspect-[2/1] sm:aspect-[16/10] w-full overflow-hidden bg-gray-100">
        <img
          src={image}
          alt={imageAlt}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
      </div>

      <div className="flex flex-1 flex-col p-6">
        <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
        <p className="mt-2 flex-1 text-gray-600">{description}</p>

        <div className="mt-5 flex items-end justify-between">
          <p>
            <span className="block text-xs font-medium uppercase tracking-wide text-gray-500">
              From
            </span>
            <span className="text-2xl font-bold text-brand">{price}</span>
          </p>
          <span className="inline-flex items-center gap-1 font-semibold text-brand">
            Details
            <ArrowRight
              size={18}
              aria-hidden="true"
              className="transition-transform group-hover:translate-x-1"
            />
          </span>
        </div>
      </div>
    </button>
  );
};

export default ServiceCard;
