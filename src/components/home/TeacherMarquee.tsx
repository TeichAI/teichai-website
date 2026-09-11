import Link from "next/link";
import type { TeacherSummary } from "@/lib/hf";
import { vendorColor } from "@/lib/vendor-colors";

function Item({ t, decorative = false }: { t: TeacherSummary; decorative?: boolean }) {
  const parts = [
    t.models > 0 ? `${t.models} model${t.models === 1 ? "" : "s"}` : null,
    t.datasets > 0 ? `${t.datasets} dataset${t.datasets === 1 ? "" : "s"}` : null,
  ].filter(Boolean);
  // The catalog filters by exact teacher, so the count on the pill matches what opens.
  const href =
    t.models > 0
      ? `/models?teacher=${encodeURIComponent(t.label)}`
      : `/datasets?q=${encodeURIComponent(t.label)}`;
  return (
    <Link
      href={href}
      tabIndex={decorative ? -1 : undefined}
      aria-hidden={decorative || undefined}
      className="flex shrink-0 items-center gap-3 rounded-full border border-border bg-surface px-4 py-2 transition hover:border-ember/60 focus-visible:border-ember"
    >
      <span aria-hidden className="size-2 rounded-full" style={{ backgroundColor: vendorColor(t.vendor) }} />
      <span className="text-sm font-medium text-foreground">{t.label}</span>
      <span className="font-mono text-[11px] text-subtle">{parts.join(" · ")}</span>
    </Link>
  );
}

export function TeacherMarquee({ teachers }: { teachers: TeacherSummary[] }) {
  if (teachers.length === 0) return null;
  const items = teachers.slice(0, 28);
  return (
    <section aria-label="Frontier models we have distilled" className="py-6">
      {/* Kept to the same content width as every other section; the pills
          fade out at the container edges instead of running edge to edge. */}
      <div className="container-x">
        <div className="mb-4 flex items-center justify-between">
          <p className="eyebrow">Distilled from</p>
          <p className="font-mono text-[11px] text-subtle">{teachers.length} frontier teachers</p>
        </div>
        {/* Pauses on hover and while any pill has focus; with reduced motion it
            becomes a plain horizontally scrollable row. */}
        <div className="mask-fade-x overflow-hidden motion-reduce:overflow-x-auto motion-reduce:[mask-image:none]">
          <div className="flex w-max gap-3 animate-marquee hover:[animation-play-state:paused] focus-within:[animation-play-state:paused] motion-reduce:animate-none">
          {items.map((t) => (
            <Item key={t.label} t={t} />
          ))}
            <div className="contents motion-reduce:hidden">
              {items.map((t) => (
                <Item key={`dup-${t.label}`} t={t} decorative />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
