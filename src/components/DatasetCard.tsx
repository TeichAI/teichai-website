"use client";

import Link from "next/link";
import { ArrowUpRight, Download, Heart, Sparkles, Wand2 } from "lucide-react";
import type { DatasetInfo } from "@/lib/hf";
import { formatCompact, formatMonth } from "@/lib/format";
import { DATASET_KINDS } from "@/lib/taxonomy";
import { vendorColor } from "@/lib/vendor-colors";
import { cn } from "@/lib/utils";
import { Chip, MetaItem } from "./ui/chip";
import { isPlainClick } from "./ReleaseCard";

export function formatSizeCategory(v?: string): string | null {
  if (!v) return null;
  const s = v.replace(/\s+/g, "");
  const lt = s.match(/^n<(.+)$/i);
  if (lt) return `< ${lt[1]} rows`;
  const gt = s.match(/^n>(.+)$/i);
  if (gt) return `> ${gt[1]} rows`;
  const range = s.match(/^(.+)<n<(.+)$/i);
  if (range) return `${range[1]}–${range[2]} rows`;
  return s;
}

export function DatasetCard({
  dataset,
  newSince,
  onOpen,
  className,
}: {
  dataset: DatasetInfo;
  newSince: string;
  onOpen?: (name: string) => void;
  className?: string;
}) {
  const d = dataset;
  const href = `/datasets?open=${encodeURIComponent(d.name)}`;
  const isNew = d.createdAt >= newSince;

  return (
    <Link
      href={href}
      prefetch={onOpen ? false : undefined}
      aria-haspopup={onOpen ? "dialog" : undefined}
      onClick={(e) => {
        if (onOpen && isPlainClick(e)) {
          e.preventDefault();
          onOpen(d.name);
        }
      }}
      className={cn(
        "card-hover group relative flex flex-col gap-3 rounded-2xl border border-border bg-surface p-5 text-left outline-none focus-visible:ring-2 focus-visible:ring-ember",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
            <span
              aria-hidden
              className="inline-block size-1.5 shrink-0 rounded-full"
              style={{ backgroundColor: vendorColor(d.vendor) }}
            />
            <span className="truncate">{d.teacher ?? "Mixed sources"}</span>
          </p>
          <h3 className="mt-1.5 truncate text-base font-semibold leading-tight tracking-tight text-foreground">
            {d.title}
          </h3>
          <p className="truncate font-mono text-[11px] text-subtle">{d.name}</p>
        </div>
        {isNew ? (
          <Chip tone="ember" className="h-5 shrink-0 px-2 text-[10px]">
            <Sparkles className="size-3" /> New
          </Chip>
        ) : (
          <span className="shrink-0 font-mono text-[11px] text-subtle">{formatMonth(d.createdAt)}</span>
        )}
      </div>

      {d.description && (
        <p className="line-clamp-2 text-[13px] leading-relaxed text-muted-foreground">{d.description}</p>
      )}

      <div className="flex flex-wrap gap-1.5">
        <Chip tone="ember">{DATASET_KINDS[d.kind]}</Chip>
        {d.samples && <Chip tone="mono">{formatCompact(d.samples)} samples</Chip>}
        {!d.samples && d.sizeCategory && <Chip tone="mono">{formatSizeCategory(d.sizeCategory)}</Chip>}
        {d.generatedWithTeich && (
          <Chip tone="outline" title="Generated with the teich toolkit">
            <Wand2 className="size-3" /> teich
          </Chip>
        )}
      </div>

      <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-1.5 border-t border-border pt-3">
        <MetaItem icon={<Download className="size-3.5" />} title="All-time downloads">
          {formatCompact(d.downloadsAllTime)}
        </MetaItem>
        <MetaItem icon={<Heart className="size-3.5" />} title="Likes">
          {formatCompact(d.likes)}
        </MetaItem>
        {d.license && (
          <MetaItem className="uppercase" title="License">
            {d.license}
          </MetaItem>
        )}
        <span className="ml-auto inline-flex items-center gap-1 text-xs font-medium text-ember opacity-0 transition group-hover:opacity-100 group-focus-visible:opacity-100 [@media(hover:none)]:opacity-100">
          Details <ArrowUpRight className="size-3.5" />
        </span>
      </div>
    </Link>
  );
}
