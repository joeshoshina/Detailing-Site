import { Phone } from "lucide-react";
import PageHeader from "../components/PageHeader.jsx";
import Footer from "../components/Footer.jsx";
import business from "../data/business.js";

const Booking = () => {
  return (
    <>
      <PageHeader />

      <main id="main" tabIndex={-1} className="bg-gray-50 outline-none">
        <div className="mx-auto flex w-full max-w-3xl flex-col items-center px-4 pt-32 pb-20 sm:pt-36">
          <p className="text-sm font-semibold uppercase tracking-widest text-brand">
            Booking
          </p>
          <h1 className="mt-2 text-center text-3xl sm:text-4xl font-bold tracking-tight text-gray-900">
            Book an Appointment
          </h1>
          <p className="mt-3 max-w-xl text-center text-lg text-gray-600">
            Choose your service and a time that works for you, and we'll come
            to your driveway.
          </p>

          <iframe
            src="https://crautodetailingbjo3.setmore.com"
            className="mt-10 h-[760px] w-full rounded-2xl border-none bg-white shadow-lg ring-1 ring-gray-200"
            title="Setmore booking calendar"
          ></iframe>

          <div className="mt-8 flex flex-col items-center gap-3 text-center text-gray-600">
            <p>Have a question before you book?</p>
            <a
              href={business.phoneHref}
              className="inline-flex items-center gap-2 rounded-lg border border-brand px-6 py-3 font-semibold text-brand hover:bg-brand-tint transition-colors"
            >
              <Phone size={18} /> Call {business.phone}
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default Booking;
