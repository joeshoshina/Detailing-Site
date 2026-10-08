import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./AppRoutes.jsx";

const container = document.getElementById("root");
const app = (
  <React.StrictMode>
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  </React.StrictMode>
);

// Production pages arrive prerendered (scripts/prerender.js), so attach to the
// existing HTML; the dev server serves an empty root, so render from scratch.
if (container.firstElementChild) {
  ReactDOM.hydrateRoot(container, app);
} else {
  ReactDOM.createRoot(container).render(app);
}
