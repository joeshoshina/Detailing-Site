import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Phone } from "lucide-react";
import business from "../data/business";

/**
 * MobileCTA.jsx
 * ----------------------------
 * Sticky Call / Book bar on phones, so the next step is always one tap away.
 * Slides in once the hero (and its own buttons) has scrolled out of view.
 * Hidden on md+ screens, where the navbar's Book Now button is always visible.
 */

const MobileCTA = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () =>
      setVisible(window.scrollY > window.innerHeight * 0.6);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      inert={!visible}
      className={`fixed inset-x-0 bottom-0 z-40 border-t border-gray-200 bg-white/95 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-[0_-4px_16px_rgba(0,0,0,0.08)] backdrop-blur transition-transform duration-300 md:hidden ${
        visible ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <div className="flex gap-3">
        <a
          href={business.phoneHref}
          className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-brand py-3 font-semibold text-brand"
        >
          <Phone size={18} /> Call
        </a>
        <Link
          to="/book"
          className="flex-[2] rounded-lg bg-brand py-3 text-center font-semibold text-white"
        >
          Book Now
        </Link>
      </div>
    </div>
  );
};

export default MobileCTA;
