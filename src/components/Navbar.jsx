/**
 * Navbar.jsx
 * ----------------------------
 * Responsive navigation bar shared by every page.
 * - Fixed to top; transparent over the home hero, gradient once scrolled,
 *   when the mobile menu is open, or always with `solid` (inner pages)
 * - Section links point at "/#section" so they work from any page
 *   (ScrollManager in main.jsx handles the scrolling)
 * - "Skip to content" link for keyboard users
 * - Mobile dropdown with large tap targets; closes on link click or Escape
 * - "Book Now" call-to-action on desktop and in the mobile menu
 */

import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Phone } from "lucide-react";
import business from "../data/business";

const NAV_LINKS = [
  { name: "Services", to: "/#services" },
  { name: "How It Works", to: "/#how-it-works" },
  { name: "Gallery", to: "/gallery" },
  { name: "About", to: "/#about" },
  { name: "Contact", to: "/#contact" },
];

const Navbar = ({ solid = false }) => {
  const [scrolled, setScrolled] = useState(false); // Triggers gradient when scrolled
  const [menuOpen, setMenuOpen] = useState(false); // Tracks mobile dropdown open/close
  const { pathname } = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 5);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Escape closes the mobile menu
  useEffect(() => {
    if (!menuOpen) return;
    const handleKeyDown = (e) => e.key === "Escape" && setMenuOpen(false);
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);
  const bgActive = solid || scrolled || menuOpen;

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        bgActive
          ? "bg-gradient-to-br from-ink via-brand to-ink-deep shadow-lg"
          : "bg-transparent"
      }`}
    >
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[200] focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:font-semibold focus:text-brand"
      >
        Skip to content
      </a>

      {/* ==================== TOP ROW (Logo + Title + Links) ==================== */}
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:py-4">
        <Link to="/" onClick={closeMenu} className="flex items-center gap-3">
          <img
            src="/logo.png"
            alt=""
            className="h-12 w-12 sm:h-14 sm:w-14 object-contain"
          />
          <span className="text-lg sm:text-xl lg:text-2xl font-bold text-white tracking-wide">
            {business.name}
          </span>
        </Link>

        {/* ----- Desktop Navigation ----- */}
        <nav aria-label="Main" className="hidden md:flex items-center gap-6 lg:gap-8">
          {NAV_LINKS.map(({ name, to }) => (
            <Link
              key={name}
              to={to}
              aria-current={to === pathname ? "page" : undefined}
              className="
                relative py-2 text-base lg:text-lg font-medium text-white
                hover:text-gray-200 transition-colors duration-200
                after:content-[''] after:absolute after:left-0 after:bottom-0
                after:h-[2px] after:bg-white after:transition-all after:duration-300
                after:w-0 hover:after:w-full aria-[current=page]:after:w-full
              "
            >
              {name}
            </Link>
          ))}
          <Link
            to="/book"
            className="rounded-lg bg-white px-4 py-2 font-semibold text-brand hover:bg-brand-tint transition-colors"
          >
            Book Now
          </Link>
        </nav>

        {/* ----- Mobile Menu Button (hamburger / close icon) ----- */}
        <button
          onClick={() => setMenuOpen((open) => !open)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          className="md:hidden -mr-2 p-2 text-white rounded-lg transition-transform duration-200 active:scale-95"
        >
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* ==================== MOBILE DROPDOWN MENU ==================== */}
      {menuOpen && (
        <nav
          id="mobile-menu"
          aria-label="Main"
          className="md:hidden border-t border-white/10 px-4 pb-5"
        >
          <ul className="py-2">
            {NAV_LINKS.map(({ name, to }) => (
              <li key={name}>
                <Link
                  to={to}
                  onClick={closeMenu}
                  aria-current={to === pathname ? "page" : undefined}
                  className="block py-3 text-lg text-white hover:text-gray-200 aria-[current=page]:font-semibold"
                >
                  {name}
                </Link>
              </li>
            ))}
          </ul>
          <div className="flex gap-3">
            <a
              href={business.phoneHref}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-white/70 py-3 font-semibold text-white"
            >
              <Phone size={18} /> Call
            </a>
            <Link
              to="/book"
              onClick={closeMenu}
              className="flex-[2] rounded-lg bg-white py-3 text-center font-semibold text-brand"
            >
              Book Now
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
};

export default Navbar;
