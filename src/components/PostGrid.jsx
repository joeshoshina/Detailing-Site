/**
 * PostGrid.jsx
 * ----------------------------
 * Square tiles that look balanced for any number of posts.
 *
 * Phones use 2 columns. Tablets and up choose 3 or 4 columns per post count:
 *   1. a layout with no partial row        (6 → 3 + 3, 8 → 4 + 4)
 *   2. else a last row at least half full,  (5 → 3 + 2, 7 → 4 + 3,
 *      never a single stranded tile          10 → 4 + 4 + 2)
 *   3. else the shortest grid
 * Up to 4 posts sit in one row. Any partial last row is centered (CSS in
 * index.css, `.post-grid`), and the container narrows for 1–3 posts so tiles
 * keep a sensible size instead of stretching across the page.
 *
 * Props:
 *  - count: number of tiles that will be rendered
 *  - children: one element per tile (each is wrapped in an <li>)
 */

import { Children } from "react";

const COLUMN_OPTIONS = {
  base: [2], // phones
  md: [4, 3], // tablets and desktop, most columns first
};

// Max container width per column count, so 1–3 tiles don't balloon
const MAX_WIDTH = { 1: "max-w-md", 2: "max-w-3xl", 3: "max-w-5xl", 4: "max-w-6xl" };

function bestColumns(count, options) {
  if (count <= Math.max(...options)) return Math.max(count, 1);

  const remainder = (cols) => count % cols;
  return (
    options.find((cols) => remainder(cols) === 0) ??
    options.find((cols) => remainder(cols) > 1 && remainder(cols) / cols >= 0.5) ??
    options[0]
  );
}

const PostGrid = ({ count, children }) => {
  const colsMd = bestColumns(count, COLUMN_OPTIONS.md);
  const style = {
    "--cols-base": bestColumns(count, COLUMN_OPTIONS.base),
    "--cols-md": colsMd,
  };

  return (
    <ul style={style} className={`post-grid mx-auto w-full ${MAX_WIDTH[colsMd]}`}>
      {Children.map(children, (child) => (
        <li>{child}</li>
      ))}
    </ul>
  );
};

export default PostGrid;
