import Navbar from "./Navbar";

/**
 * PageHeader.jsx
 * ----------------------------
 * Header for the standalone routes (/book, /gallery, /services/*, 404):
 * the same navbar as the home page, always solid since there's no hero
 * behind it. Page titles are handled by RouteMeta.
 */

const PageHeader = () => <Navbar solid />;

export default PageHeader;
