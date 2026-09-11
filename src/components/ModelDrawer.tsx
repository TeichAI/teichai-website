"use client";

import { useRef } from "react";
import Link from "next/link";
import { ArrowUpRight, Brain, Eye, Layers } from "lucide-react";
import type { Release } from "@/lib/hf";
import { formatCompact, formatContext, formatDate, formatParams, relativeTime } from "@/lib/format";
import { VARIANT_LABELS, preferredQuant } from "@/lib/taxonomy";
import { vendorColor } from "@/lib/vendor-colors";
import { Sheet, SheetContent, SheetDescription, SheetTitle } from "./ui/sheet";
import { Chip } from "./ui/chip";
import { Snippet } from "./ui/snippet";
import { CopyButton } from "./CopyButton";

function Stat({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="rounded-xl border border-border bg-surface-2/60 p-3">
      <p className="text-[11px] font-medium uppercase tracking-wider text-subtle">{label}</p>
      <p className="mt-1 text-base font-semibold tabular text-foreground">{value}</p>
      {hint && <p className="text-[11px] text-subtle">{hint}</p>}
    </div>
  );
}

export function ModelDrawer({
  release,
  onClose,
  knownDatasets,
}: {
  release: Release | null;
  onClose: () => void;
  knownDatasets: Set<string>;
}) {
  const r = release;
  const titleRef = useRef<HTMLHeadingElement>(null);
  const gguf = r?.variants.find((v) => v.kind === "gguf");
  const safetensors = r?.variants.find((v) => v.kind === "safetensors");
  const lora = r?.variants.find((v) => v.kind === "lora");
  const quant = gguf ? preferredQuant(gguf.quants) : null;
  const hasRunSnippets = !!(gguf && quant) || !!safetensors || !!(lora && r?.baseModel);

  return (
    <Sheet open={!!r} onOpenChange={(o) => !o && onClose()}>
      <SheetContent
        side="right"
        className="w-full overflow-y-auto border-border bg-background p-0 sm:max-w-2xl"
        // Land on the title rather than the first button so screen readers
        // announce what opened.
        onOpenAutoFocus={(e) => {
          e.preventDefault();
          titleRef.current?.focus();
        }}
      >
        {r && (
          <div className="flex flex-col">
            <div className="noise relative overflow-hidden border-b border-border bg-surface px-6 pb-6 pt-14">
              <div className="pointer-events-none absolute -right-20 -top-24 size-72 rounded-full bg-ember/15 blur-3xl" />
              <p className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                <span
                  aria-hidden
                  className="inline-block size-1.5 rounded-full"
                  style={{ backgroundColor: vendorColor(r.vendor) }}
                />
                {r.vendorLabel} · distilled from {r.teacher}
              </p>
              <SheetTitle
                ref={titleRef}
                tabIndex={-1}
                className="mt-2 text-2xl font-semibold tracking-tight outline-none md:text-3xl"
              >
                {r.title}
                {r.version && <span className="ml-2 text-base font-medium text-subtle">{r.version}</span>}
              </SheetTitle>
              <SheetDescription className="mt-2 font-mono text-xs text-muted-foreground">
                TeichAI/{r.name}
              </SheetDescription>
              <div className="mt-2">
                <CopyButton
                  text={`TeichAI/${r.name}`}
                  label="Copy repo id"
                  className="border-border bg-surface-2 text-muted-foreground hover:bg-surface-3 hover:text-foreground"
                />
              </div>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {r.descriptors.map((d) => (
                  <Chip key={d}>{d}</Chip>
                ))}
                {r.experimental && <Chip tone="outline">Experimental</Chip>}
                {r.vision && (
                  <Chip tone="outline">
                    <Eye className="size-3" /> Vision
                  </Chip>
                )}
                {r.thinking && (
                  <Chip tone="outline">
                    <Brain className="size-3" /> Thinking
                  </Chip>
                )}
                {r.kinds.map((k) => (
                  <Chip key={k} tone="mono">
                    {VARIANT_LABELS[k]}
                  </Chip>
                ))}
              </div>
            </div>

            <div className="space-y-8 px-6 py-6">
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                <Stat
                  label="Downloads"
                  value={formatCompact(r.downloadsAllTime)}
                  hint={`${formatCompact(r.downloads)} last 30d`}
                />
                <Stat label="Likes" value={formatCompact(r.likes)} />
                <Stat
                  label="Parameters"
                  value={formatParams(r.params) ?? r.size ?? "–"}
                  hint={r.active ? `${r.active} active` : undefined}
                />
                <Stat label="Context" value={formatContext(r.contextLength) ?? "–"} hint={r.architecture} />
                <Stat label="License" value={r.license ?? "–"} />
                <Stat label="Base model" value={r.base} hint={r.baseModel?.split("/")[1]} />
                <Stat label="Released" value={formatDate(r.createdAt)} />
                <Stat label="Updated" value={relativeTime(r.lastModified)} hint={formatDate(r.lastModified)} />
              </div>

              <section>
                <h3 className="eyebrow mb-3">Repositories</h3>
                <ul className="space-y-2">
                  {r.variants.map((v) => (
                    <li
                      key={v.id}
                      className="flex flex-col gap-2 rounded-xl border border-border bg-surface p-3.5 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <Chip tone="mono">{VARIANT_LABELS[v.kind]}</Chip>
                          <span className="truncate font-mono text-xs text-muted-foreground">{v.id}</span>
                        </div>
                        <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-subtle">
                          <span className="tabular">{formatCompact(v.downloadsAllTime)} downloads</span>
                          <span className="tabular">{v.likes} likes</span>
                          {v.hasMmproj && <span>+ mmproj (vision)</span>}
                          {v.hasModelfile && <span>Ollama Modelfile</span>}
                        </div>
                        {v.kind === "gguf" && v.quants.length > 0 && (
                          <ul className="mt-2 flex flex-wrap gap-1" aria-label="Available quantizations">
                            {v.quants.map((q) => (
                              <li
                                key={q}
                                className="rounded-md border border-border bg-surface-2 px-1.5 py-0.5 font-mono text-[11px] text-muted-foreground"
                              >
                                {q}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                      <a
                        href={v.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex h-9 shrink-0 items-center justify-center gap-1.5 rounded-lg bg-foreground px-3 text-xs font-medium text-background transition hover:bg-ember hover:text-primary-foreground"
                      >
                        Open on HF <ArrowUpRight className="size-3.5" aria-hidden />
                        <span className="sr-only"> (opens in a new tab)</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </section>

              {hasRunSnippets && (
                <section>
                  <h3 className="eyebrow mb-3">Run it</h3>
                  <div className="space-y-3">
                    {gguf && quant && (
                      <>
                        <Snippet label="llama.cpp" language="bash" code={`llama-server -hf ${gguf.id}:${quant}`} />
                        <Snippet label="Ollama" language="bash" code={`ollama run hf.co/${gguf.id}:${quant}`} />
                        <Snippet
                          label="Download one quant"
                          language="bash"
                          code={`hf download ${gguf.id} --include "*${quant}*"`}
                        />
                      </>
                    )}
                    {safetensors && (
                      <>
                        <Snippet label="vLLM" language="bash" code={`vllm serve ${safetensors.id}`} />
                        <Snippet
                          label="Transformers"
                          language="python"
                          code={
                            r.vision
                              ? `from transformers import AutoProcessor, AutoModelForImageTextToText\n\nmodel_id = "${safetensors.id}"\nprocessor = AutoProcessor.from_pretrained(model_id)\nmodel = AutoModelForImageTextToText.from_pretrained(\n    model_id, dtype="auto", device_map="auto"\n)`
                              : `from transformers import AutoTokenizer, AutoModelForCausalLM\n\nmodel_id = "${safetensors.id}"\ntokenizer = AutoTokenizer.from_pretrained(model_id)\nmodel = AutoModelForCausalLM.from_pretrained(\n    model_id, dtype="auto", device_map="auto"\n)`
                          }
                        />
                      </>
                    )}
                    {!safetensors && !gguf && lora && r.baseModel && (
                      <Snippet
                        label="PEFT adapter on the base model"
                        language="python"
                        code={`from transformers import AutoTokenizer, AutoModelForCausalLM\nfrom peft import PeftModel\n\nbase_id = "${r.baseModel}"\ntokenizer = AutoTokenizer.from_pretrained(base_id)\nmodel = AutoModelForCausalLM.from_pretrained(base_id, dtype="auto", device_map="auto")\nmodel = PeftModel.from_pretrained(model, "${lora.id}")`}
                      />
                    )}
                  </div>
                </section>
              )}

              {(r.datasets.length > 0 || r.baseModel) && (
                <section>
                  <h3 className="eyebrow mb-3">Lineage</h3>
                  <div className="space-y-2">
                    {r.baseModel && (
                      <a
                        href={`https://huggingface.co/${r.baseModel}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between rounded-xl border border-border bg-surface px-3.5 py-2.5 text-sm transition hover:border-border-strong"
                      >
                        <span className="flex items-center gap-2">
                          <Layers className="size-4 text-subtle" aria-hidden />
                          <span className="text-subtle">Base</span>
                          <span className="font-mono text-xs">{r.baseModel}</span>
                        </span>
                        <ArrowUpRight className="size-3.5 text-subtle" aria-hidden />
                        <span className="sr-only"> (opens in a new tab)</span>
                      </a>
                    )}
                    {r.datasets.map((d) => {
                      const local = knownDatasets.has(d);
                      const name = d.split("/")[1];
                      const inner = (
                        <>
                          <span className="flex min-w-0 items-center gap-2">
                            <span className="text-subtle">Trained on</span>
                            <span className="truncate font-mono text-xs">{d}</span>
                          </span>
                          <ArrowUpRight className="size-3.5 shrink-0 text-subtle" aria-hidden />
                        </>
                      );
                      const cls =
                        "flex items-center justify-between gap-2 rounded-xl border border-border bg-surface px-3.5 py-2.5 text-sm transition hover:border-border-strong";
                      return local ? (
                        <Link key={d} href={`/datasets?open=${encodeURIComponent(name)}`} className={cls}>
                          {inner}
                        </Link>
                      ) : (
                        <a key={d} href={`https://huggingface.co/datasets/${d}`} target="_blank" rel="noopener noreferrer" className={cls}>
                          {inner}
                          <span className="sr-only"> (opens in a new tab)</span>
                        </a>
                      );
                    })}
                  </div>
                </section>
              )}
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
