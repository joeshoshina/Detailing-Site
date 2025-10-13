import { Link } from "react-router-dom";

const Booking = () => {
  return (
    <section className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      {/* --- Header (Logo + Title) --- */}
      <div className="fixed top-0 left-0 w-full z-50 p-4 bg-gradient-to-br from-[#0a1625] via-[#053a57] to-[#070d16] shadow-md flex justify-center">
        <Link
          to="/"
          className="flex items-center space-x-3 hover:opacity-90 transition-opacity duration-200"
        >
          <img
            src="https://cdn.zarlasites.com/logo/313e8157a5ef0d7afd436dfe9dfe53f462de17d1b2580c32a6730f6aa6953bd7"
            alt="Logo"
            className="h-12 w-12 sm:h-14 sm:w-14 lg:h-20 lg:w-20 object-contain transition-all duration-300"
          />
          <span className="text-lg sm:text-xl lg:text-2xl font-bold text-white tracking-wide transition-all duration-300">
            CR Auto Detailing
          </span>
        </Link>
      </div>

      {/* --- Booking Section (maybe button at fixed spot) --- */}
      <div className="w-full max-w-3xl p-4 pt-40 pb-20 flex flex-col items-center">
        <h1 className="text-3xl font-bold mb-10 text-center">
          Book an Appointment
        </h1>
        <iframe
          src="https://testingut2w.setmore.com"
          className="w-full h-[700px] border-none rounded-xl shadow-lg"
          title="Setmore Booking"
        ></iframe>
      </div>
    </section>
  );
};

export default Booking;
