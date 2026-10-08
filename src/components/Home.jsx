import { Link } from "react-router-dom";
import { Phone } from "lucide-react";
import heroImg from "../assets/hero.webp";

const Home = () => {
  return (
    <div className="flex flex-col">
      <section
        id="home"
        className="h-150 w-full bg-cover bg-center relative"
        style={{ backgroundImage: `url(${heroImg})` }}
      >
        <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center md:px-20 px-6">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white text-center pb-3 leading-tight">
            Premium Mobile Auto Detailing Across{" "}
            <br className="block sm:hidden" />{" "}
            {/* line break only on small screens */}
            the San Fernando Valley — Shine That Lasts
          </h1>
          <div className="flex flex-col sm:flex-row items-center gap-3 mt-4">
            {/* Book now button */}
            <Link
              to="/book"
              className="bg-white text-black font-semibold px-6 py-2.5 rounded-lg border border-white hover:text-white hover:bg-gradient-to-br from-[#0a1625] via-[#053a57] to-[#070d16] transition"
            >
              Book Now
            </Link>
            {/* Phone number */}
            <a
              href="tel:+17478773788"
              className="flex items-center gap-2 text-white font-medium px-6 py-2.5 rounded-lg border border-white/70 hover:bg-white/10 transition"
            >
              <Phone size={18} /> (747) 877-3788
            </a>
          </div>
        </div>
      </section>
      <p className="py-20 px-8 text-lg justify-center max-w-2xl mx-auto text-gray-700">
        CR Auto Detailing provides professional, convenient car care across the
        San Fernando Valley. Whether you need a quick exterior wash, a full
        interior clean, or complete paint correction, we bring top-quality
        detailing right to your driveway. Our mission is simple — keep your car
        spotless, shiny, and looking its best, without you ever leaving home.
      </p>
    </div>
  );
};

export default Home;
