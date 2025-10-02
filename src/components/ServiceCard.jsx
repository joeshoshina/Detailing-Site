const ServiceCard = ({ title, price, description, image }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center text-center hover:shadow-xl transition">
      <img
        src={image}
        alt={title}
        className="h-40 w-full object-cover rounded-md mb-4"
      />
      <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
      <p className="text-gray-600 mt-2">{description}</p>
      <span className="mt-3 text-lg font-bold text-blue-600">{price}</span>
    </div>
  );
};

export default ServiceCard;
