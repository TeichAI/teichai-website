import { useId } from "react";
import { LOGO_NODES, LOGO_VIEWBOX } from "@/lib/logo-geometry";
import { SPRITE_BRIGHT, SPRITE_DIM } from "./LogoSprite";
import { cn } from "@/lib/utils";

type Variant = "outline" | "flat";

interface LogoCircuitProps {
  className?: string;
  /** outline: the silhouette traced on as a glowing stroke. flat: the artwork as-is. */
  variant?: Variant;
  animate?: boolean;
  /** Overall opacity of the mark (0-1). */
  opacity?: number;
  /** Draw every branch in the bright colour instead of the artwork's dimmer secondaries. */
  uniform?: boolean;
  /** Show the breathing node inside each ring terminal (default: on when animated). */
  nodes?: boolean;
  /** Outline stroke width in viewBox units. */
  strokeWidth?: number;
  style?: React.CSSProperties;
}

// Both halves of the mark, referenced from the document-level sprite
// (see LogoSprite). `fill`/`stroke` are inherited by the sprite's paths.
function Mark({
  fill = "none",
  dimFill,
  stroke,
  dimStroke,
  strokeWidth,
  className,
  style,
  dimStyle,
}: {
  fill?: string;
  dimFill?: string;
  stroke?: string;
  dimStroke?: string;
  strokeWidth?: number;
  className?: string;
  style?: React.CSSProperties;
  dimStyle?: React.CSSProperties;
}) {
  return (
    <>
      <use
        href={`#${SPRITE_BRIGHT}`}
        fill={fill}
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
        className={className}
        style={style}
      />
      <use
        href={`#${SPRITE_DIM}`}
        fill={dimFill ?? fill}
        stroke={dimStroke ?? stroke}
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
        className={className}
        style={dimStyle ?? style}
      />
    </>
  );
}

// The real TeichAI mark with effects layered on: a traced-on glowing outline
// and nodes that breathe at every ring terminal. All motion is CSS, so the
// reduced-motion rule in globals.css applies.
export function LogoCircuit({
  className,
  variant = "outline",
  animate = true,
  opacity = 1,
  uniform = false,
  nodes,
  strokeWidth = 7,
  style,
}: LogoCircuitProps) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const softGlow = `lc-soft-${uid}`;
  const showNodes = nodes ?? (animate && variant === "outline");
  const bright = "var(--logo-bright)";
  const dim = uniform ? bright : "var(--logo-dim)";

  return (
    <svg
      viewBox={LOGO_VIEWBOX}
      aria-hidden
      className={cn("overflow-visible", className)}
      style={{ opacity, ...style }}
      xmlns="http://www.w3.org/2000/svg"
    >
      {variant === "outline" && animate && (
        <defs>
          <filter id={softGlow} x="-20%" y="-20%" width="140%" height="140%" colorInterpolationFilters="sRGB">
            <feGaussianBlur stdDeviation="14" result="blur" />
            <feColorMatrix in="blur" type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.9 0" result="halo" />
            <feMerge>
              <feMergeNode in="halo" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
      )}

      {variant === "outline" ? (
        <g filter={animate ? `url(#${softGlow})` : undefined}>
          <Mark
            stroke={bright}
            dimStroke={dim}
            strokeWidth={strokeWidth}
            className={animate ? "animate-draw" : undefined}
            style={{ strokeDasharray: 1, ["--len" as string]: 1 }}
            dimStyle={{ strokeDasharray: 1, ["--len" as string]: 1, animationDelay: "0.12s" }}
          />
        </g>
      ) : (
        <Mark fill={bright} dimFill={dim} />
      )}

      {showNodes &&
        LOGO_NODES.map((n, i) => (
          <g key={`${n.x}-${n.y}`} style={{ transformOrigin: `${n.x}px ${n.y}px` }}>
            <circle
              cx={n.x}
              cy={n.y}
              r={n.r * 0.5}
              fill="var(--accent-2)"
              className={animate ? "animate-pulse-soft" : undefined}
              style={{
                transformOrigin: `${n.x}px ${n.y}px`,
                animationDelay: `${(i * 0.37) % 2.8}s`,
                filter: "drop-shadow(0 0 18px var(--accent-glow))",
              }}
            />
            {animate && (
              <circle
                cx={n.x}
                cy={n.y}
                r={n.r * 0.5}
                fill="none"
                stroke="var(--accent-2)"
                strokeWidth={6}
                className="animate-node-ripple"
                style={{ transformOrigin: `${n.x}px ${n.y}px`, animationDelay: `${1.2 + ((i * 0.45) % 3.4)}s` }}
              />
            )}
          </g>
        ))}
    </svg>
  );
}

// Crisp, faithful version of the mark for the nav and footer.
export function LogoGlyph({ className, size = 28 }: { className?: string; size?: number }) {
  const [, , vw, vh] = LOGO_VIEWBOX.split(" ").map(Number);
  return (
    <svg
      viewBox={LOGO_VIEWBOX}
      width={size}
      height={Math.round((size * vh) / vw)}
      aria-hidden
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <Mark fill="var(--logo-bright)" dimFill="var(--logo-dim)" />
    </svg>
  );
}
