import { Link } from "react-router-dom";
import { Phone } from "lucide-react";
import heroImg from "../assets/hero.webp";
import business from "../data/business";

/**
 * Home.jsx (hero)
 * ----------------------------
 * - Real <img> (not a CSS background) with high fetch priority: it's the
 *   largest thing on the page, so the browser should load it first
 * - Gradient overlay keeps the white text readable over any part of the photo
 * - Primary action (Book Now) + secondary action (Call)
 */

const Home = () => {
  return (
    <section
      id="home"
      className="relative isolate flex min-h-[600px] h-[88svh] max-h-[860px] items-center justify-center overflow-hidden"
    >
      <img
        src={heroImg}
        alt=""
        fetchPriority="high"
        className="absolute inset-0 -z-10 h-full w-full object-cover"
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-black/70 via-black/45 to-black/75" />

      <div className="max-w-4xl px-6 pt-16 text-center text-white">
        <p className="text-xs sm:text-sm font-semibold uppercase tracking-wider sm:tracking-widest text-accent">
          Mobile detailing · San Fernando Valley
        </p>
        <h1 className="mt-4 text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight text-balance">
          Premium Mobile Auto Detailing Across the San Fernando Valley — Shine
          That Lasts
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg sm:text-xl text-white/85 text-pretty">
          We bring professional detailing right to your driveway, so your car
          looks its best without you ever leaving home.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/book"
            className="w-full sm:w-auto rounded-lg bg-white px-8 py-3.5 text-lg font-semibold text-brand shadow-lg hover:bg-brand-tint transition-colors"
          >
            Book Now
          </Link>
          <a
            href={business.phoneHref}
            className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-lg border border-white/70 px-8 py-3.5 text-lg font-semibold text-white hover:bg-white/10 transition-colors"
          >
            <Phone size={20} /> {business.phone}
          </a>
        </div>
      </div>
    </section>
  );
};

export default Home;
