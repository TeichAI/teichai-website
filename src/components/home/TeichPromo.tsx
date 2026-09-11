import Link from "next/link";
import { ArrowRight, ArrowUpRight, Star } from "lucide-react";
import type { TeichMeta } from "@/lib/hf";
import { site } from "@/lib/site";
import { formatCompact } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Eyebrow } from "@/components/ui/section";
import { GithubIcon } from "@/components/BrandIcons";
import { cn } from "@/lib/utils";

export function Terminal({ lines, title = "bash" }: { lines: Array<{ prompt?: boolean; text: string; muted?: boolean }>; title?: string }) {
  return (
    <div className="code-block overflow-hidden shadow-2xl">
      <div className="flex items-center gap-2 border-b border-white/[0.07] px-4 py-2.5">
        <span className="size-2.5 rounded-full bg-[#ff5f57]" />
        <span className="size-2.5 rounded-full bg-[#febc2e]" />
        <span className="size-2.5 rounded-full bg-[#28c840]" />
        <span className="ml-3 font-mono text-[11px] text-white/60">{title}</span>
      </div>
      <pre
        tabIndex={0}
        role="region"
        aria-label={`${title} terminal example`}
        className="overflow-x-auto px-4 py-4 text-[12.5px] leading-[1.75] outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ember"
      >
        {lines.map((l, i) => (
          <span key={i} className={cn("block", l.muted ? "text-white/60" : "text-white/90")}>
            {l.prompt && <span className="select-none text-[#ff8a1f]">$ </span>}
            {l.text}
          </span>
        ))}
        <span className="block">
          <span className="select-none text-[#ff8a1f]">$ </span>
          <span aria-hidden className="inline-block h-[1.1em] w-[0.6em] translate-y-[3px] animate-blink bg-white/70" />
        </span>
      </pre>
    </div>
  );
}

export function TeichPromo({ meta, datasetsWithTeich }: { meta: TeichMeta; datasetsWithTeich: number }) {
  return (
    <div className="noise relative overflow-hidden rounded-3xl border border-border bg-surface">
      <div className="pointer-events-none absolute -left-20 -top-20 size-80 rounded-full bg-ember/15 blur-3xl" />
      <div className="grid gap-10 p-6 md:grid-cols-2 md:p-10 lg:gap-16">
        <div>
          <Eyebrow>Open-source tooling</Eyebrow>
          <h2 className="mt-4 text-balance text-3xl font-semibold tracking-tight md:text-4xl">
            <span className="font-mono text-ember">teich</span> — the toolkit behind every dataset here.
          </h2>
          <p className="mt-4 text-pretty text-muted-foreground">
            Generate agent and chat traces, extract sessions from Claude Code, Codex, Cursor, Pi and Hermes, normalize
            them into training-ready rows, and mask the loss so you only train on what the teacher actually said. Same
            pipeline we use, one <span className="font-mono text-foreground">pip install</span> away.
          </p>
          <dl className="mt-6 grid grid-cols-3 gap-3">
            {meta.live && (
              <>
                <div className="rounded-xl border border-border bg-background/60 p-3">
                  <dt className="text-[11px] font-medium uppercase tracking-wider text-subtle">PyPI</dt>
                  <dd className="mt-1 font-mono text-sm font-semibold">v{meta.version}</dd>
                </div>
                <div className="rounded-xl border border-border bg-background/60 p-3">
                  <dt className="text-[11px] font-medium uppercase tracking-wider text-subtle">GitHub stars</dt>
                  <dd className="mt-1 flex items-center gap-1 font-mono text-sm font-semibold">
                    <Star className="size-3.5 text-ember" aria-hidden /> {formatCompact(meta.stars)}
                  </dd>
                </div>
              </>
            )}
            <div className="rounded-xl border border-border bg-background/60 p-3">
              <dt className="text-[11px] font-medium uppercase tracking-wider text-subtle">Datasets made</dt>
              <dd className="mt-1 font-mono text-sm font-semibold">{datasetsWithTeich}+</dd>
            </div>
          </dl>
          <div className="mt-7 flex flex-wrap gap-3">
            <Button asChild variant="ember">
              <Link href="/teich">
                Explore teich <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild variant="outline">
              <a href={site.links.teichRepo} target="_blank" rel="noopener noreferrer">
                <GithubIcon className="size-4" /> Source <ArrowUpRight className="size-3.5" />
              </a>
            </Button>
          </div>
        </div>
        <div className="self-center">
          <Terminal
            lines={[
              { prompt: true, text: "pip install teich" },
              { prompt: true, text: "teich init my-project && cd my-project" },
              { prompt: true, text: "teich generate -c config.yaml" },
              { text: "✓ 4,006 traces → output/   tools.json · dataset card · sandbox snapshots", muted: true },
              { prompt: true, text: "teich extract claude --model fable-5" },
              { text: "✓ anonymized 244 sessions → data/   upload to Hugging Face? (y/N)", muted: true },
            ]}
          />
        </div>
      </div>
    </div>
  );
}
