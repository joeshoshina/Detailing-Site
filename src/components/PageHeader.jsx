import { useEffect } from "react";
import { Link } from "react-router-dom";

/**
 * PageHeader.jsx
 * ----------------------------
 * Slim brand header for the standalone routes (/book, /gallery).
 * - Logo + name link back to the landing page
 * - Sets the browser tab title to "<title> | CR Auto Detailing" while mounted
 */

const PageHeader = ({ title }) => {
  useEffect(() => {
    const previous = document.title;
    document.title = `${title} | CR Auto Detailing`;
    return () => {
      document.title = previous;
    };
  }, [title]);

  return (
    <header className="fixed top-0 left-0 w-full z-50 p-4 bg-gradient-to-br from-[#0a1625] via-[#053a57] to-[#070d16] shadow-md flex justify-center">
      <Link
        to="/"
        className="flex items-center space-x-3 hover:opacity-90 transition-opacity duration-200"
      >
        <img
          src="/logo.png"
          alt="CR Auto Detailing logo"
          className="h-12 w-12 sm:h-14 sm:w-14 lg:h-20 lg:w-20 object-contain"
        />
        <span className="text-lg sm:text-xl lg:text-2xl font-bold text-white tracking-wide">
          CR Auto Detailing
        </span>
      </Link>
    </header>
  );
};

export default PageHeader;
