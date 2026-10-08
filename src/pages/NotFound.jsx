import { Link } from "react-router-dom";
import PageHeader from "../components/PageHeader.jsx";
import Footer from "../components/Footer.jsx";

// Prerendered as dist/404.html, which Vercel serves with a real 404 status
// (not a soft 404 that search engines would index as a duplicate home page).
const NotFound = () => (
  <>
    <PageHeader />
    <main
      id="main"
      tabIndex={-1}
      className="flex min-h-[70vh] flex-col items-center justify-center bg-gray-50 px-6 pt-28 pb-20 text-center outline-none"
    >
      <p className="text-sm font-semibold uppercase tracking-widest text-brand">404</p>
      <h1 className="mt-2 text-3xl sm:text-4xl font-bold tracking-tight text-gray-900">
        Page not found
      </h1>
      <p className="mt-3 max-w-md text-lg text-gray-600">
        Sorry, we couldn't find that page. Here's where you can go instead:
      </p>
      <div className="mt-8 flex flex-col sm:flex-row gap-3">
        <Link
          to="/"
          className="rounded-lg bg-brand px-6 py-3 font-semibold text-white hover:bg-brand-dark transition-colors"
        >
          Back to home
        </Link>
        <Link
          to="/#services"
          className="rounded-lg border border-brand px-6 py-3 font-semibold text-brand hover:bg-brand-tint transition-colors"
        >
          See our services
        </Link>
      </div>
    </main>
    <Footer />
  </>
);

export default NotFound;
