const Footer = () => {
  return (
    <footer className="text-center text-sm text-gray-700 py-6 bg-gray-200 border-t">
      <div className="container mx-auto px-4">
        <p>&copy; 2025 CR Auto Detailing</p>
        <p className="text-xs mt-1">
          Built by{" "}
          <a
            href="https://joehoshina.netlify.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-900 hover:underline transition-colors"
          >
            Joe Hoshina
          </a>
        </p>
        <p className="text-xs mt-1">
          Built with React, Tailwind CSS, JavaScript, and Express
        </p>
      </div>
    </footer>
  );
};

export default Footer;
