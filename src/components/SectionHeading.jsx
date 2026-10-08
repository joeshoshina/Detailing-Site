/**
 * SectionHeading.jsx
 * ----------------------------
 * Consistent eyebrow + title + lead text used at the top of every section.
 *
 * Props:
 *  - eyebrow: short label above the title
 *  - title: the section's <h2>
 *  - children: optional lead paragraph
 *  - align: "center" (default) or "left"
 */

const SectionHeading = ({ eyebrow, title, children, align = "center" }) => (
  <div className={align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
    <p className="text-sm font-semibold uppercase tracking-widest text-brand">
      {eyebrow}
    </p>
    <h2 className="mt-2 text-3xl sm:text-4xl font-bold tracking-tight text-gray-900 text-balance">
      {title}
    </h2>
    {children && (
      <p className="mt-4 text-lg leading-relaxed text-gray-600 text-pretty">
        {children}
      </p>
    )}
  </div>
);

export default SectionHeading;
