/**
 * ServiceDetails.jsx
 * ----------------------------
 * Renders serviceData `details` (light markdown): one paragraph per line,
 * with **text** as bold. Used by ServiceModal and the service pages.
 * Splitting on a capture group puts the bold text at the odd indices.
 */

const ServiceDetails = ({ details }) =>
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

export default ServiceDetails;
