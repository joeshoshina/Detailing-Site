import { Link, useParams } from "react-router-dom";
import { Phone, ArrowRight } from "lucide-react";
import PageHeader from "../components/PageHeader.jsx";
import ServiceDetails from "../components/ServiceDetails.jsx";
import Contact from "../components/Contact.jsx";
import Footer from "../components/Footer.jsx";
import MobileCTA from "../components/MobileCTA.jsx";
import NotFound from "./NotFound.jsx";
import services from "../data/serviceData.js";
import business from "../data/business.js";

/**
 * ServicePage.jsx  (/services/:slug)
 * ----------------------------
 * One page per service so each can rank for its own searches
 * (e.g. "paint correction San Fernando Valley"). Heading, title and
 * description come from the service's `seo` fields in serviceData.js.
 */

const ServicePage = () => {
  const { slug } = useParams();
  const service = services.find((s) => s.slug === slug);
  if (!service) return <NotFound />;

  const otherServices = services.filter((s) => s.slug !== slug);

  return (
    <>
      <PageHeader />

      <main id="main" tabIndex={-1} className="bg-white outline-none">
        {/* --- Breadcrumb --- */}
        <nav
          aria-label="Breadcrumb"
          className="mx-auto max-w-6xl px-6 pt-28 sm:pt-32 text-sm text-gray-500"
        >
          <ol className="flex flex-wrap items-center gap-1.5">
            <li>
              <Link to="/" className="hover:text-brand">Home</Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link to="/#services" className="hover:text-brand">Services</Link>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="text-gray-700">{service.title}</li>
          </ol>
        </nav>

        {/* --- Intro --- */}
        <section className="mx-auto grid max-w-6xl items-center gap-10 px-6 py-10 lg:grid-cols-2 lg:py-14">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-brand">
              {service.title}
            </p>
            <h1 className="mt-2 text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-gray-900 text-balance">
              {service.seo.heading} in the San Fernando Valley
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-gray-600 text-pretty">
              {service.description} We come to your driveway anywhere in the San
              Fernando Valley, so there's no drop-off and no waiting room.
            </p>
            <p className="mt-6 text-gray-600">
              Starting at{" "}
              <span className="text-3xl font-bold text-brand">{service.price}</span>
            </p>
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <Link
                to="/book"
                className="rounded-lg bg-brand px-8 py-3.5 text-center text-lg font-semibold text-white hover:bg-brand-dark transition-colors"
              >
                Book This Service
              </Link>
              <a
                href={business.phoneHref}
                className="flex items-center justify-center gap-2 rounded-lg border border-brand px-8 py-3.5 text-lg font-semibold text-brand hover:bg-brand-tint transition-colors"
              >
                <Phone size={20} /> {business.phone}
              </a>
            </div>
          </div>

          <img
            src={service.image}
            alt={service.imageAlt}
            fetchPriority="high"
            className="aspect-[4/3] w-full rounded-2xl object-cover shadow-lg"
          />
        </section>

        {/* --- What's included --- */}
        <section className="bg-gray-50 py-16 sm:py-20">
          <div className="mx-auto max-w-3xl px-6">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">
              What's included
            </h2>
            <div className="mt-6 text-lg leading-relaxed text-gray-700">
              <ServiceDetails details={service.details} />
            </div>
          </div>
        </section>

        {/* --- Other services (internal links) --- */}
        <section className="py-16 sm:py-20">
          <div className="mx-auto max-w-6xl px-6">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">
              Other services
            </h2>
            <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {otherServices.map((other) => (
                <li key={other.slug}>
                  <Link
                    to={`/services/${other.slug}`}
                    className="group flex h-full flex-col rounded-2xl p-5 ring-1 ring-gray-200 hover:shadow-lg transition"
                  >
                    <span className="font-semibold text-gray-900">{other.title}</span>
                    <span className="mt-1 flex-1 text-sm text-gray-600">{other.description}</span>
                    <span className="mt-4 flex items-center justify-between text-brand">
                      <span className="font-bold">From {other.price}</span>
                      <ArrowRight
                        size={18}
                        aria-hidden="true"
                        className="transition-transform group-hover:translate-x-1"
                      />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <Contact />
      </main>

      <Footer />
      <MobileCTA />
    </>
  );
};

export default ServicePage;
