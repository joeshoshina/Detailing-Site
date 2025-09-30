import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App.jsx";
import Reviews from "./pages/Reviews.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} /> {/* landing page */}
        <Route path="/reviews" element={<Reviews />} /> {/* reviews page */}
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
