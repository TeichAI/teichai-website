"use client";

import { useEffect, useId, useState } from "react";
import Link from "next/link";
import type { Matrix as MatrixData, MatrixCell } from "@/lib/hf";
import { vendorShort } from "@/lib/taxonomy";
import { vendorColor } from "@/lib/vendor-colors";

interface Tip {
  cell: MatrixCell;
  x: number;
  y: number;
}

export function Matrix({ matrix }: { matrix: MatrixData }) {
  const [tip, setTip] = useState<Tip | null>(null);
  const tipId = useId();
  const lookup = new Map(matrix.cells.map((c) => [`${c.base}|${c.vendor}`, c]));
  const rowTotals = new Map<string, number>();
  const colTotals = new Map<string, number>();
  for (const c of matrix.cells) {
    rowTotals.set(c.base, (rowTotals.get(c.base) ?? 0) + c.count);
    colTotals.set(c.vendor, (colTotals.get(c.vendor) ?? 0) + c.count);
  }

  const show = (cell: MatrixCell, el: HTMLElement) => {
    const r = el.getBoundingClientRect();
    setTip({ cell, x: r.left + r.width / 2, y: r.top });
  };

  // Escape dismisses the tooltip; scrolling drops it rather than letting it drift.
  useEffect(() => {
    if (!tip) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setTip(null);
    const onScroll = () => setTip(null);
    window.addEventListener("keydown", onKey);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("scroll", onScroll);
    };
  }, [tip]);

  return (
    <div className="relative">
      <div className="overflow-x-auto rounded-2xl border border-border bg-surface">
        <table className="w-full border-separate border-spacing-0 text-xs">
          <caption className="sr-only">
            Number of model releases per open-weight base family (rows) and teacher lab (columns)
          </caption>
          <thead>
            <tr>
              <th
                scope="col"
                className="sticky left-0 z-10 bg-surface px-3 py-3 text-left font-mono text-[11px] uppercase tracking-wider text-subtle"
              >
                Base ↓ · Teacher lab →
              </th>
              {matrix.vendors.map((v) => (
                <th key={v} scope="col" className="px-1 py-3 text-center font-medium text-muted-foreground">
                  <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
                    <span aria-hidden className="size-1.5 rounded-full" style={{ backgroundColor: vendorColor(v) }} />
                    {vendorShort(v)}
                  </span>
                </th>
              ))}
              <th scope="col" className="px-3 py-3 text-right font-mono text-[11px] uppercase tracking-wider text-subtle">
                Total
              </th>
            </tr>
          </thead>
          <tbody>
            {matrix.bases.map((b) => (
              <tr key={b}>
                <th
                  scope="row"
                  className="sticky left-0 z-10 whitespace-nowrap bg-surface px-3 py-1 text-left font-medium text-foreground"
                >
                  {b}
                </th>
                {matrix.vendors.map((v) => {
                  const cell = lookup.get(`${b}|${v}`);
                  if (!cell) {
                    return (
                      <td key={v} className="p-0.5">
                        <div
                          aria-hidden
                          className="flex h-9 min-w-9 items-center justify-center rounded-md border border-border/60 text-subtle/40"
                        >
                          ·
                        </div>
                      </td>
                    );
                  }
                  // Sequential fill capped so the row text stays readable on every cell.
                  const t = cell.count / matrix.max;
                  const pct = Math.round(14 + 60 * Math.sqrt(t));
                  const isTip = tip?.cell === cell;
                  return (
                    <td key={v} className="p-0.5">
                      <Link
                        href={`/models?base=${encodeURIComponent(b)}&vendor=${encodeURIComponent(v)}`}
                        onMouseEnter={(e) => show(cell, e.currentTarget)}
                        onMouseLeave={() => setTip(null)}
                        onFocus={(e) => show(cell, e.currentTarget)}
                        onBlur={() => setTip(null)}
                        aria-label={`${cell.count} ${b} model${cell.count === 1 ? "" : "s"} distilled from ${vendorShort(v)}`}
                        aria-describedby={isTip ? tipId : undefined}
                        className="flex h-9 min-w-9 items-center justify-center rounded-md font-semibold tabular text-foreground transition hover:ring-2 hover:ring-ember focus-visible:ring-2 focus-visible:ring-ember"
                        style={{
                          backgroundColor: `color-mix(in oklab, var(--accent) ${pct}%, var(--surface))`,
                        }}
                      >
                        {cell.count}
                      </Link>
                    </td>
                  );
                })}
                <td className="px-3 text-right font-mono tabular text-muted-foreground">{rowTotals.get(b) ?? 0}</td>
              </tr>
            ))}
            <tr>
              <th
                scope="row"
                className="sticky left-0 z-10 bg-surface px-3 py-2 text-left font-mono text-[11px] uppercase tracking-wider text-subtle"
              >
                Total
              </th>
              {matrix.vendors.map((v) => (
                <td key={v} className="py-2 text-center font-mono tabular text-muted-foreground">
                  {colTotals.get(v) ?? 0}
                </td>
              ))}
              <td className="px-3 py-2 text-right font-mono font-semibold tabular text-foreground">
                {matrix.cells.reduce((s, c) => s + c.count, 0)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {tip && (
        <div
          id={tipId}
          role="tooltip"
          className="pointer-events-none fixed z-[60] w-64 -translate-x-1/2 -translate-y-full rounded-xl border border-border bg-elev p-3 text-xs shadow-2xl"
          style={{ left: tip.x, top: tip.y - 10 }}
        >
          <p className="font-semibold text-foreground">
            {tip.cell.count} × {tip.cell.base} · {vendorShort(tip.cell.vendor)}
          </p>
          <ul className="mt-1.5 space-y-0.5 text-muted-foreground">
            {tip.cell.releases.map((r) => (
              <li key={r.slug} className="truncate">
                {r.title}
              </li>
            ))}
            {tip.cell.count > tip.cell.releases.length && (
              <li className="text-subtle">+{tip.cell.count - tip.cell.releases.length} more</li>
            )}
          </ul>
          <p className="mt-2 text-[11px] text-subtle">Open in the catalog</p>
        </div>
      )}
    </div>
  );
}
