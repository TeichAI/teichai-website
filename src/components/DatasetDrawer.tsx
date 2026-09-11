"use client";

import { useRef } from "react";
import Link from "next/link";
import { ArrowUpRight, Wand2 } from "lucide-react";
import type { DatasetInfo } from "@/lib/hf";
import { formatCompact, formatDate, relativeTime } from "@/lib/format";
import { DATASET_KINDS } from "@/lib/taxonomy";
import { vendorColor } from "@/lib/vendor-colors";
import { site } from "@/lib/site";
import { Sheet, SheetContent, SheetDescription, SheetTitle } from "./ui/sheet";
import { Chip } from "./ui/chip";
import { Snippet } from "./ui/snippet";
import { CopyButton } from "./CopyButton";
import { formatSizeCategory } from "./DatasetCard";

export interface ReleaseRef {
  slug: string;
  title: string;
  teacher: string;
  datasets: string[];
}

function Stat({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="rounded-xl border border-border bg-surface-2/60 p-3">
      <p className="text-[11px] font-medium uppercase tracking-wider text-subtle">{label}</p>
      <p className="mt-1 text-base font-semibold tabular text-foreground">{value}</p>
      {hint && <p className="text-[11px] text-subtle">{hint}</p>}
    </div>
  );
}

export function DatasetDrawer({
  dataset,
  onClose,
  releases,
}: {
  dataset: DatasetInfo | null;
  onClose: () => void;
  releases: ReleaseRef[];
}) {
  const d = dataset;
  const titleRef = useRef<HTMLHeadingElement>(null);
  const trainedOn = d ? releases.filter((r) => r.datasets.includes(d.id)) : [];

  return (
    <Sheet open={!!d} onOpenChange={(o) => !o && onClose()}>
      <SheetContent
        side="right"
        className="w-full overflow-y-auto border-border bg-background p-0 sm:max-w-2xl"
        onOpenAutoFocus={(e) => {
          e.preventDefault();
          titleRef.current?.focus();
        }}
      >
        {d && (
          <div className="flex flex-col">
            <div className="noise relative overflow-hidden border-b border-border bg-surface px-6 pb-6 pt-14">
              <div className="pointer-events-none absolute -right-20 -top-24 size-72 rounded-full bg-ember/15 blur-3xl" />
              <p className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                <span aria-hidden className="inline-block size-1.5 rounded-full" style={{ backgroundColor: vendorColor(d.vendor) }} />
                {d.teacher ? `${d.vendorLabel} · ${d.teacher}` : "Mixed sources"}
              </p>
              <SheetTitle
                ref={titleRef}
                tabIndex={-1}
                className="mt-2 text-2xl font-semibold tracking-tight outline-none md:text-3xl"
              >
                {d.title}
              </SheetTitle>
              <SheetDescription className="mt-2 font-mono text-xs text-muted-foreground">{d.id}</SheetDescription>
              <div className="mt-2">
                <CopyButton
                  text={d.id}
                  label="Copy dataset id"
                  className="border-border bg-surface-2 text-muted-foreground hover:bg-surface-3 hover:text-foreground"
                />
              </div>
              <div className="mt-4 flex flex-wrap gap-1.5">
                <Chip tone="ember">{DATASET_KINDS[d.kind]}</Chip>
                {d.generatedWithTeich && (
                  <Chip tone="outline">
                    <Wand2 className="size-3" /> Generated with teich
                  </Chip>
                )}
                {d.formats.map((f) => (
                  <Chip key={f} tone="mono">
                    {f}
                  </Chip>
                ))}
                {d.taskCategories.map((t) => (
                  <Chip key={t} tone="outline">
                    {t}
                  </Chip>
                ))}
              </div>
            </div>

            <div className="space-y-8 px-6 py-6">
              {d.description && <p className="text-sm leading-relaxed text-muted-foreground">{d.description}</p>}

              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                <Stat label="Downloads" value={formatCompact(d.downloadsAllTime)} hint={`${formatCompact(d.downloads)} last 30d`} />
                <Stat label="Likes" value={formatCompact(d.likes)} />
                <Stat label="Rows" value={d.samples ? formatCompact(d.samples) : (formatSizeCategory(d.sizeCategory) ?? "–")} />
                <Stat label="License" value={d.license ?? "–"} />
                <Stat label="Published" value={formatDate(d.createdAt)} />
                <Stat label="Updated" value={relativeTime(d.lastModified)} hint={formatDate(d.lastModified)} />
              </div>

              <section>
                <h3 className="eyebrow mb-3">Use it</h3>
                <div className="space-y-3">
                  <Snippet
                    label="datasets"
                    language="python"
                    code={`from datasets import load_dataset\n\nds = load_dataset("${d.id}", split="train")`}
                  />
                  <Snippet
                    label="teich · training-ready in one call"
                    language="python"
                    code={`from teich import prepare_data\n\ntrain_dataset = prepare_data(\n    "${d.id}",\n    tokenizer,\n    max_length=32768,\n    tokenize=True,\n)`}
                  />
                  <Snippet label="CLI" language="bash" code={`hf download ${d.id} --repo-type dataset`} />
                </div>
              </section>

              {trainedOn.length > 0 && (
                <section>
                  <h3 className="eyebrow mb-3">Models trained on this</h3>
                  <ul className="space-y-2">
                    {trainedOn.map((r) => (
                      <li key={r.slug}>
                        <Link
                          href={`/models?open=${encodeURIComponent(r.slug)}`}
                          className="flex items-center justify-between rounded-xl border border-border bg-surface px-3.5 py-2.5 text-sm transition hover:border-border-strong"
                        >
                          <span>
                            <span className="font-medium">{r.title}</span>
                            <span className="text-subtle"> · {r.teacher}</span>
                          </span>
                          <ArrowUpRight className="size-3.5 text-subtle" aria-hidden />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {d.tags.length > 0 && (
                <section>
                  <h3 className="eyebrow mb-3">Tags</h3>
                  <ul className="flex flex-wrap gap-1.5">
                    {d.tags.map((t) => (
                      <li key={t}>
                        <Chip tone="outline">{t}</Chip>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              <div className="flex flex-wrap gap-2">
                <a
                  href={d.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-10 items-center gap-2 rounded-lg bg-foreground px-4 text-sm font-medium text-background transition hover:bg-ember hover:text-primary-foreground"
                >
                  Open on Hugging Face <ArrowUpRight className="size-4" aria-hidden />
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
                <a
                  href={site.links.teichRepo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-10 items-center gap-2 rounded-lg border border-border-control px-4 text-sm font-medium transition hover:border-border-strong"
                >
                  <Wand2 className="size-4" aria-hidden /> Make your own with teich
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              </div>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
