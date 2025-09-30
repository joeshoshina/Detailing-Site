import { useEffect, useState } from "react";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 5); // true if scrolled down 50px
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={`fixed top-0 w-full z-50 p-4 flex flex-col items-center -mt-10 ${
        scrolled
          ? "bg-gradient-to-b from-[#08425e] via-[#0a5c7a] to-[#bg-gradient-to-br from-[#0a1625] via-[#053a57] via-[#154961] to-[#070d16]"
          : "bg-transparent"
      }`}
    >
      {/* Title + Logo */}
      <div className="flex items-center">
        <a href="#home">
          <img
            src="https://cdn.zarlasites.com/logo/313e8157a5ef0d7afd436dfe9dfe53f462de17d1b2580c32a6730f6aa6953bd7"
            alt="Logo"
            className="h-40 w-40 object-contain"
          />
        </a>
        <a href="#home" className="text-2xl font-bold text-white mb-2">
          Rich's Mobile Detailing
        </a>
      </div>
      {/* Nav Links */}
      <nav className="flex space-x-6 -mt-10">
        <a href="#home" className="text-md text-white hover:text-gray-200">
          Home
        </a>
        <a href="#about" className="text-md text-white hover:text-gray-200">
          About Us
        </a>
        <a href="#services" className="text-md text-white hover:text-gray-200">
          Our Services
        </a>
        <a href="#pastwork" className="text-md text-white hover:text-gray-200">
          Previous Work
        </a>
      </nav>
    </div>
  );
};

export default Navbar;
