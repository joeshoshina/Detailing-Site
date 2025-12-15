/**
 * Navbar.jsx
 * ----------------------------
 * Responsive navigation bar for CR Auto Detailing website.
 * - Fixed to top with gradient background appearing when scrolled or menu opened
 * - Supports anchor-based navigation
 * - Includes mobile dropdown controlled by hamburger menu
 * - Dropdown is left-aligned for better UX
 * - Uses TailwindCSS for styling and Lucide React for icons
 * - Scales logo, title, and links for desktop
 */

import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false); // Triggers gradient when scrolled
  const [menuOpen, setMenuOpen] = useState(false); // Tracks mobile dropdown open/close

  // Detects scroll to activate gradient
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 5);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Toggle mobile dropdown
  const toggleMenu = () => setMenuOpen((prev) => !prev);

  // Gradient active when scrolled OR dropdown open
  const bgActive = scrolled || menuOpen;

  return (
    <div
      className={`fixed top-0 w-full z-50 p-4 transition-all duration-300 ${
        bgActive
          ? "bg-gradient-to-br from-[#0a1625] via-[#053a57] to-[#070d16]"
          : "bg-transparent"
      }`}
    >
      {/* ==================== TOP ROW (Logo + Title + Links) ==================== */}
      <div className="flex justify-between items-center">
        {/* ----- Logo + Brand Title ----- */}
        <div className="flex items-center space-x-3">
          <a href="#home">
            <img
              src="https://cdn.zarlasites.com/logo/313e8157a5ef0d7afd436dfe9dfe53f462de17d1b2580c32a6730f6aa6953bd7"
              alt="Logo"
              className="h-12 w-12 sm:h-14 sm:w-14 lg:h-20 lg:w-20 object-contain transition-all duration-300"
            />
          </a>
          <a
            href="#home"
            className="text-lg sm:text-xl lg:text-2xl font-bold text-white tracking-wide transition-all duration-300"
          >
            CR Auto Detailing
          </a>
        </div>

        {/* ----- Desktop Navigation (hidden on small screens) ----- */}
        <nav className="hidden md:flex space-x-8">
          {[
            { name: "Home", href: "#home" },
            { name: "About Us", href: "#about" },
            { name: "Our Services", href: "#services" },
            { name: "Contact", href: "#contact" },
            { name: "Gallery", href: "/gallery" },
          ].map(({ name, href }) => (
            <a
              key={name}
              href={href}
              className="
                relative text-sm sm:text-base lg:text-lg 
                font-medium text-white 
                hover:text-gray-200 
                transition-all duration-200
                after:content-[''] after:absolute after:left-0 after:-bottom-1
                after:w-0 after:h-[2px] after:bg-white after:transition-all after:duration-300
                hover:after:w-full
              "
            >
              {name}
            </a>
          ))}
        </nav>

        {/* ----- Mobile Menu Button (hamburger / close icon) ----- */}
        <button
          onClick={toggleMenu}
          className="md:hidden text-white focus:outline-none transition-transform duration-200 active:scale-95"
        >
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* ==================== MOBILE DROPDOWN MENU ==================== */}
      {menuOpen && (
        <nav
          className="
            flex flex-col mt-4 space-y-3 md:hidden
            items-start  /* Left-aligns menu items */
            pl-2          /* Small padding for visual balance */
          "
        >
          {[
            { name: "Home", href: "#home" },
            { name: "About Us", href: "#about" },
            { name: "Our Services", href: "#services" },
            { name: "Contact", href: "#contact" },
            { name: "Gallery", href: "/gallery" },
          ].map(({ name, href }) => (
            <a
              key={name}
              href={href}
              onClick={() => setMenuOpen(false)}
              className="text-lg text-white hover:text-gray-200 transition-colors duration-200"
            >
              {name}
            </a>
          ))}
        </nav>
      )}
    </div>
  );
};

export default Navbar;
