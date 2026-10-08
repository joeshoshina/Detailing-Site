import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Highlights from "./components/Highlights";
import Service from "./components/Service";
import HowItWorks from "./components/HowItWorks";
import RecentWork from "./components/RecentWork";
import About from "./components/About";
import Faq from "./components/Faq";
import ServiceAreas from "./components/ServiceAreas";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import MobileCTA from "./components/MobileCTA";

// Landing page: answer "what, how much, how, proof, who, where" before asking to book.
const App = () => {
  return (
    <>
      <Navbar />
      <main id="main" tabIndex={-1} className="outline-none">
        <Home />
        <Highlights />
        <Service />
        <HowItWorks />
        <RecentWork />
        <About />
        <Faq />
        <ServiceAreas />
        <Contact />
      </main>
      <Footer />
      <MobileCTA />
    </>
  );
};

export default App;
