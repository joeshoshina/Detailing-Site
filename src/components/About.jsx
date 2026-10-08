import SectionHeading from "./SectionHeading";

const About = () => {
  return (
    <section id="about" className="bg-white py-20 sm:py-24">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 lg:grid-cols-[1fr_1.6fr] lg:gap-16">
        <SectionHeading eyebrow="About us" title="Meet Rich & Calum" align="left" />

        <div className="space-y-4 text-lg leading-relaxed text-gray-700">
          <p>
            Hey, we’re Rich and Calum — two CSUN students with a drive to offer
            purpose. What started as us cleaning our own cars turned into a way
            to make ends meet. Over time, what began as a simple hustle became a
            passion we saw real vision in.
          </p>
          <p>
            But we wouldn’t be here without our friends. They were the first to
            trust us with their cars, the first to spread the word, and even
            helped bring this site to life. Our growth was built on that support
            — proof that when your bros believe in you, anything can happen.
          </p>
          <p>
            We’re founded on passion, hard work, and most importantly, the
            overwhelming support from the people who had our backs since day
            one. We guarantee you’ll leave not just satisfied, but confident in
            trusting us for your next clean.
          </p>
        </div>
      </div>
    </section>
  );
};

export default About;
