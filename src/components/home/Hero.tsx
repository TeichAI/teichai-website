import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import type { OrgStats } from "@/lib/hf";
import { site } from "@/lib/site";
import { formatFull } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Eyebrow } from "@/components/ui/section";
import { Counter } from "@/components/Counter";
import { LogoCircuit } from "@/components/LogoCircuit";
import { DiscordIcon } from "@/components/BrandIcons";

function Telemetry({ stats, fetchedAt }: { stats: OrgStats; fetchedAt: string }) {
  const synced = `${new Date(fetchedAt).toISOString().slice(11, 16)} UTC`;
  const cells: Array<{ label: string; value: number; hint?: string; big?: boolean }> = [
    {
      label: "All-time downloads",
      value: stats.downloadsAllTime,
      hint: `${formatFull(stats.downloads30d)} in the last 30 days`,
      big: true,
    },
    { label: "Model releases", value: stats.releases, hint: `${stats.repos} repositories` },
    { label: "Datasets", value: stats.datasets, hint: "reasoning, agent & chat traces" },
    { label: "Frontier teachers", value: stats.teachers, hint: `from ${stats.vendors} labs` },
    { label: "GGUF quants shipped", value: stats.ggufFiles, hint: `${stats.ggufReleases} releases` },
    { label: "Followers on HF", value: stats.followers },
    { label: "Likes", value: stats.likes },
  ];

  return (
    <div className="glass ember-glow noise relative overflow-hidden rounded-3xl border border-border p-4 md:p-5">
      <div className="flex items-center justify-between px-1 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
        <span className="flex items-center gap-2">
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-ember opacity-70" />
            <span className="relative inline-flex size-2 rounded-full bg-ember" />
          </span>
          Org telemetry · live from Hugging Face
        </span>
        <span>synced {synced}</span>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4 xl:grid-cols-8">
        {cells.map((c) => (
          <div
            key={c.label}
            className={
              c.big
                ? "col-span-2 rounded-2xl border border-border bg-surface/70 p-4"
                : "rounded-2xl border border-border bg-surface/70 p-4"
            }
          >
            <p className="text-[11px] font-medium uppercase tracking-wider text-subtle">{c.label}</p>
            <p
              className={
                c.big
                  ? "mt-1 text-4xl font-semibold tabular tracking-tight md:text-5xl"
                  : "mt-1 text-2xl font-semibold tabular tracking-tight md:text-3xl"
              }
            >
              <Counter value={c.value} />
            </p>
            {c.hint && <p className="mt-0.5 text-xs text-muted-foreground">{c.hint}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}

export function Hero({ stats, fetchedAt }: { stats: OrgStats; fetchedAt: string }) {
  return (
    <section className="relative overflow-hidden pb-16 pt-32 md:pb-24 md:pt-40">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="bg-grid mask-radial absolute inset-0 opacity-60" />
        <div className="absolute left-1/2 top-0 h-[44rem] w-[70rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,var(--accent-glow),transparent)] opacity-50 blur-3xl" />
      </div>
      <div className="container-x">
        <div className="grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <div className="animate-fade-up">
            <Eyebrow>Open distillation lab</Eyebrow>
            <h1 className="mt-6 text-balance text-5xl font-semibold leading-[1.02] tracking-tight md:text-7xl">
              Frontier reasoning, <span className="text-gradient">distilled</span> into models you can run at home.
            </h1>
            <p className="mt-7 max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground">
              We capture reasoning and agent traces from {stats.teachers} frontier models across {stats.vendors}{" "}
              labs, fine-tune open bases like Qwen and Gemma on them, and publish everything: the weights, the GGUF
              quants, and the datasets themselves.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Button asChild size="lg" variant="ember">
                <Link href="/models">
                  Browse {stats.releases} models <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="secondary">
                <Link href="/datasets">{stats.datasets} datasets</Link>
              </Button>
              <Button asChild size="lg" variant="ghost">
                <a href={site.links.discord} target="_blank" rel="noopener noreferrer">
                  <DiscordIcon className="size-4" /> Join the Discord <ArrowUpRight className="size-3.5 opacity-60" />
                </a>
              </Button>
            </div>
            <ul className="mt-12 flex flex-wrap gap-x-7 gap-y-2 font-mono text-[11px] uppercase tracking-wider text-subtle">
              <li>Apache-2.0 weights</li>
              <li>GGUF for llama.cpp &amp; Ollama</li>
              <li>Trained with Unsloth</li>
              <li>Traces generated with teich</li>
            </ul>
          </div>

          <div className="relative mx-auto w-full max-w-[26rem] animate-fade-up [animation-delay:150ms] lg:max-w-none">
            <div className="pointer-events-none absolute inset-0 -z-10 rounded-full bg-[radial-gradient(closest-side,var(--accent-glow),transparent)] opacity-60 blur-3xl" />
            <LogoCircuit
              variant="outline"
              uniform
              strokeWidth={9}
              className="animate-float mx-auto w-[78%] lg:w-[86%]"
            />
          </div>
        </div>

        <div className="mt-16 animate-fade-up [animation-delay:300ms] md:mt-20">
          <Telemetry stats={stats} fetchedAt={fetchedAt} />
        </div>
      </div>
    </section>
  );
}
