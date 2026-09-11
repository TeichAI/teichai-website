import { LOGO_GROUPS, LOGO_VIEWBOX } from "@/lib/logo-paths";

export const SPRITE_BRIGHT = "teich-mark-bright";
export const SPRITE_DIM = "teich-mark-dim";

const DIM_THRESHOLD = 0.9;

// The vectorized TeichAI mark, emitted once per document so every instance on
// the page (nav, hero, footer, 404) can reference it with <use> instead of
// repeating ~20 KB of path data. Paths carry no fill/stroke so each <use>
// decides how the mark is drawn.
export function LogoSprite() {
  return (
    <svg
      aria-hidden
      width="0"
      height="0"
      viewBox={LOGO_VIEWBOX}
      style={{ position: "absolute", width: 0, height: 0, overflow: "hidden" }}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <g id={SPRITE_BRIGHT}>
          {LOGO_GROUPS.filter((g) => g.alpha >= DIM_THRESHOLD).map((g, i) => (
            <path key={i} d={g.d} fillRule="nonzero" pathLength={1} />
          ))}
        </g>
        <g id={SPRITE_DIM}>
          {LOGO_GROUPS.filter((g) => g.alpha < DIM_THRESHOLD).map((g, i) => (
            <path key={i} d={g.d} fillRule="nonzero" pathLength={1} />
          ))}
        </g>
      </defs>
    </svg>
  );
}
