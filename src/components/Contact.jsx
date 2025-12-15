import { Mail, Phone, MapPin } from "lucide-react";

const Contact = () => {
  return (
    <section
      id="contact"
      className="text-center flex flex-col bg-gray-200 py-20"
    >
      <h1 className="text-2xl font-bold mb-5">Get In Touch</h1>

      <div className="flex flex-col items-center gap-5 text-lg max-w-md mx-auto">
        <a
          href="mailto:crautdetail@outlook.com"
          className="flex items-center gap-4 w-full group transition-colors duration-200"
        >
          <Mail className="w-5 h-5 text-blue-600 group-hover:text-blue-700 transition-colors" />
          <p className="text-blue-600 group-hover:text-blue-700 hover:underline transition-colors">
            crautdetail@outlook.com
          </p>
        </a>

        <a
          href="tel:+17478773788"
          className="flex items-center gap-4 w-full group transition-colors duration-200"
        >
          <Phone className="w-5 h-5 text-blue-600 group-hover:text-blue-700 transition-colors" />
          <p className="text-blue-600 group-hover:text-blue-700 hover:underline transition-colors">
            (747) 877-3788
          </p>
        </a>

        <div className="flex items-center gap-4 w-full">
          <MapPin className="w-5 h-5 text-gray-600" />
          <p className="text-gray-700">San Fernando Valley, CA</p>
        </div>
      </div>
    </section>
  );
};

export default Contact;
