"use client";

import type { MouseEvent } from "react";
import Link from "next/link";
import { ArrowUpRight, Brain, Download, Eye, Heart, Sparkles } from "lucide-react";
import type { Release } from "@/lib/hf";
import { formatCompact, formatContext, formatMonth } from "@/lib/format";
import { VARIANT_LABELS } from "@/lib/taxonomy";
import { vendorColor } from "@/lib/vendor-colors";
import { cn } from "@/lib/utils";
import { Chip, MetaItem } from "./ui/chip";

// Let modified clicks (new tab, new window) behave like ordinary links.
export function isPlainClick(e: MouseEvent): boolean {
  return e.button === 0 && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey;
}

export function ReleaseCard({
  release,
  newSince,
  onOpen,
  className,
  compact = false,
}: {
  release: Release;
  /** ISO timestamp from the snapshot; releases created after it get a "New" badge. */
  newSince: string;
  onOpen?: (slug: string) => void;
  className?: string;
  compact?: boolean;
}) {
  const r = release;
  const gguf = r.variants.find((v) => v.kind === "gguf");
  const href = `/models?open=${encodeURIComponent(r.slug)}`;
  const isNew = r.createdAt >= newSince;

  return (
    <Link
      href={href}
      // Inside the explorer the click opens the drawer in place; elsewhere it
      // navigates to the catalog with the drawer preselected.
      prefetch={onOpen ? false : undefined}
      aria-haspopup={onOpen ? "dialog" : undefined}
      onClick={(e) => {
        if (onOpen && isPlainClick(e)) {
          e.preventDefault();
          onOpen(r.slug);
        }
      }}
      className={cn(
        "card-hover group relative flex flex-col gap-4 rounded-2xl border border-border bg-surface p-5 text-left outline-none focus-visible:ring-2 focus-visible:ring-ember",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
            <span
              aria-hidden
              className="inline-block size-1.5 shrink-0 rounded-full"
              style={{ backgroundColor: vendorColor(r.vendor) }}
            />
            <span className="truncate">
              {r.vendorLabel} · {r.teacher}
            </span>
          </p>
          <h3 className="mt-1.5 text-lg font-semibold leading-tight tracking-tight text-foreground">
            {r.title}
            {r.version && <span className="ml-1.5 text-sm font-medium text-subtle">{r.version}</span>}
          </h3>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-1.5">
          {isNew ? (
            <Chip tone="ember" className="h-5 px-2 text-[10px]">
              <Sparkles className="size-3" /> New
            </Chip>
          ) : (
            <span className="font-mono text-[11px] text-subtle">{formatMonth(r.createdAt)}</span>
          )}
        </div>
      </div>

      {(r.descriptors.length > 0 || r.experimental || r.vision || r.thinking) && (
        <div className="flex flex-wrap gap-1.5">
          {r.descriptors.map((d) => (
            <Chip key={d} tone="neutral">
              {d}
            </Chip>
          ))}
          {r.experimental && <Chip tone="outline">Experimental</Chip>}
          {r.vision && (
            <Chip tone="outline" title="Accepts images">
              <Eye className="size-3" /> Vision
            </Chip>
          )}
          {r.thinking && (
            <Chip tone="outline" title="Reasoning / thinking traces">
              <Brain className="size-3" /> Thinking
            </Chip>
          )}
        </div>
      )}

      {!compact && (
        <div className="flex flex-wrap gap-1.5">
          {r.kinds.map((k) => (
            <Chip key={k} tone="mono" className="text-[11px]">
              {VARIANT_LABELS[k]}
              {k === "gguf" && gguf && gguf.quants.length > 0 && (
                <span className="text-muted-foreground">· {gguf.quants.length} quants</span>
              )}
            </Chip>
          ))}
        </div>
      )}

      <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-1.5 border-t border-border pt-3.5">
        <MetaItem icon={<Download className="size-3.5" />} title="All-time downloads">
          {formatCompact(r.downloadsAllTime)}
        </MetaItem>
        <MetaItem icon={<Heart className="size-3.5" />} title="Likes">
          {formatCompact(r.likes)}
        </MetaItem>
        {r.contextLength && <MetaItem title="Context length">{formatContext(r.contextLength)} ctx</MetaItem>}
        {r.license && (
          <MetaItem className="uppercase" title="License">
            {r.license}
          </MetaItem>
        )}
        <span className="ml-auto inline-flex items-center gap-1 text-xs font-medium text-ember opacity-0 transition group-hover:opacity-100 group-focus-visible:opacity-100 [@media(hover:none)]:opacity-100">
          Details <ArrowUpRight className="size-3.5" />
        </span>
      </div>
    </Link>
  );
}
