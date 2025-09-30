const Navbar = () => {
  return (
    <div className="fixed top-0 w-full z-50 bg-red-700 border-b border-red-200 p-4 flex flex-col items-center -mt-10">
      {/* Title + Logo */}
      <div className="flex items-center">
        <img
          src="https://cdn.zarlasites.com/logo/313e8157a5ef0d7afd436dfe9dfe53f462de17d1b2580c32a6730f6aa6953bd7"
          alt="Logo"
          className="h-40 w-40 object-contain"
        />
        <a href="#home" className="text-2xl font-bold text-white mb-2">
          Rich's Mobile Detailing
        </a>
      </div>
      {/* Nav Links */}
      <nav className="flex space-x-6 -mt-10">
        <a href="#projects" className="text-md text-white hover:text-gray-200">
          Home
        </a>
        <a href="#contact" className="text-md text-white hover:text-gray-200">
          About Us
        </a>
        <a href="#contact" className="text-md text-white hover:text-gray-200">
          Our Services
        </a>
        <a href="#contact" className="text-md text-white hover:text-gray-200">
          Previous Work
        </a>
      </nav>
    </div>
  );
};

export default Navbar;
