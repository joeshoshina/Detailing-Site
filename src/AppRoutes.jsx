import { Routes, Route } from "react-router-dom";
import App from "./App.jsx";
import Booking from "./pages/Booking.jsx";
import Gallery from "./pages/Gallery.jsx";
import ServicePage from "./pages/ServicePage.jsx";
import NotFound from "./pages/NotFound.jsx";
import ScrollManager from "./components/ScrollManager.jsx";
import RouteMeta from "./components/RouteMeta.jsx";

// Shared by the browser (main.jsx) and the build-time prerender
// (entry-server.jsx), so both render exactly the same tree.
const AppRoutes = () => (
  <>
    <ScrollManager />
    <RouteMeta />
    <Routes>
      <Route path="/" element={<App />} /> {/* landing page */}
      <Route path="/book" element={<Booking />} /> {/* booking page */}
      <Route path="/gallery" element={<Gallery />} /> {/* gallery page */}
      <Route path="/services/:slug" element={<ServicePage />} /> {/* one per service */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  </>
);

export default AppRoutes;
