import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

// Start each page at the top, or at the #section in the URL (e.g. "/#services"
// from the navbar). `key` changes on every navigation, so clicking the same
// section link twice still scrolls back to it.
//
// Arriving on a new page jumps instantly; section links within the same page
// use "auto", which follows index.css: smooth unless the visitor prefers
// reduced motion.
const ScrollManager = () => {
  const { pathname, hash, key } = useLocation();
  const previousPathname = useRef(null);

  useEffect(() => {
    const samePage = previousPathname.current === pathname;
    previousPathname.current = pathname;
    const behavior = samePage ? "auto" : "instant";

    const target = hash && document.getElementById(hash.slice(1));
    if (target) {
      target.scrollIntoView({ behavior });
    } else {
      window.scrollTo({ top: 0, behavior });
    }
  }, [pathname, hash, key]);

  return null;
};

export default ScrollManager;
