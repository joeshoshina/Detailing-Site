import PageHeader from "../components/PageHeader.jsx";

const Booking = () => {
  return (
    <section className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <PageHeader title="Book an Appointment" />

      {/* --- Booking Section --- */}
      <div className="w-full max-w-3xl p-4 pt-40 pb-20 flex flex-col items-center">
        <h1 className="text-3xl font-bold mb-10 text-center">
          Book an Appointment
        </h1>
        <iframe
          src="https://crautodetailingbjo3.setmore.com"
          className="w-full h-[700px] border-none rounded-xl shadow-lg"
          title="Setmore Booking"
        ></iframe>
        <p className="mt-6 text-gray-600 text-center">
          Prefer to talk it through? Call or text{" "}
          <a
            href="tel:+17478773788"
            className="text-blue-600 hover:text-blue-700 hover:underline"
          >
            (747) 877-3788
          </a>
          .
        </p>
      </div>
    </section>
  );
};

export default Booking;
