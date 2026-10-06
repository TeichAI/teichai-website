import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, BookOpenCheck, Globe2, Hammer, Users } from "lucide-react";
import { getSnapshot, getTeam } from "@/lib/hf";
import { site } from "@/lib/site";
import { PageHeader } from "@/components/PageHeader";
import { Section, SectionHeader } from "@/components/ui/section";
import { Counter } from "@/components/Counter";
import { Pipeline } from "@/components/home/Pipeline";
import { Community } from "@/components/home/Community";
import { Button } from "@/components/ui/button";
import { HuggingFaceIcon } from "@/components/BrandIcons";

export const revalidate = 3600;

const title = "About";
const description = "TeichAI is a small, self-funded open distillation lab. Meet the team and learn how we work.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/about" },
  openGraph: { title: `${title} · TeichAI`, description, url: "/about" },
};

const principles = [
  {
    icon: <Globe2 className="size-5" />,
    title: "Open weights, open data",
    body: "Every model ships with the dataset that made it. If you can download the distill, you can download what it learned from and retrain it yourself.",
  },
  {
    icon: <Hammer className="size-5" />,
    title: "Open tooling",
    body: "The generation, extraction and masking pipeline is published as teich on PyPI. Our recipes are reproducible, not folklore.",
  },
  {
    icon: <BookOpenCheck className="size-5" />,
    title: "Honest model cards",
    body: "Base model, dataset, training setup and known limitations are in every card. We would rather be boring than overclaim.",
  },
  {
    icon: <Users className="size-5" />,
    title: "Community-directed",
    body: "Distill requests come in through Discord. A lot of what we ship started as someone asking for it.",
  },
];

export default async function AboutPage() {
  const [snap, team] = await Promise.all([getSnapshot(), getTeam()]);
  const s = snap.stats;

  return (
    <>
      <PageHeader
        eyebrow="About TeichAI"
        title="A small lab with a simple loop: ask the best models, teach the open ones, publish everything."
        description="Frontier models from Anthropic, OpenAI, Google, DeepSeek and others are extraordinary, but they live behind APIs. We think their reasoning style should be something you can run on your own hardware. So we capture it, distill it into open-weight bases, and give the whole chain away."
      />

      <Section className="pt-4">
        <dl className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {[
            { label: "Model releases", value: s.releases },
            { label: "Datasets", value: s.datasets },
            { label: "All-time downloads", value: s.downloadsAllTime },
            { label: "HF followers", value: s.followers },
          ].map((x) => (
            <div key={x.label} className="rounded-2xl border border-border bg-surface p-5">
              <dt className="text-[11px] font-medium uppercase tracking-wider text-subtle">{x.label}</dt>
              <dd className="mt-1 text-3xl font-semibold tabular tracking-tight">
                <Counter value={x.value} />
              </dd>
            </div>
          ))}
        </dl>
      </Section>

      <Section className="pt-0" id="team">
        <SectionHeader
          eyebrow="The people"
          title="Four of us, a lot of GPU hours."
          description="Everything here is a side project funded out of pocket. Say hi on Hugging Face."
        />
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {team.map((m) => (
            <li key={m.handle}>
              <a
                href={m.url}
                target="_blank"
                rel="noopener noreferrer"
                className="card-hover group flex h-full flex-col items-start rounded-2xl border border-border bg-surface p-5"
              >
                <span className="relative">
                  <span className="absolute -inset-1 rounded-full bg-ember/30 opacity-0 blur-md transition group-hover:opacity-100" />
                  {m.avatarUrl ? (
                    <Image
                      src={m.avatarUrl}
                      alt=""
                      width={64}
                      height={64}
                      unoptimized
                      className="relative size-16 rounded-full object-cover ring-2 ring-border"
                    />
                  ) : (
                    <span
                      aria-hidden
                      className="relative flex size-16 items-center justify-center rounded-full bg-surface-2 text-xl font-semibold ring-2 ring-border"
                    >
                      {m.handle[0]}
                    </span>
                  )}
                </span>
                <h3 className="mt-4 flex items-center gap-1.5 text-lg font-semibold">
                  {m.handle}
                  <ArrowUpRight className="size-3.5 text-subtle transition group-hover:text-ember" />
                </h3>
                <p className="text-xs font-medium uppercase tracking-wider text-ember">{m.role}</p>
                {m.focus && <p className="mt-2 text-sm text-muted-foreground">{m.focus}</p>}
                <span className="mt-auto pt-4 font-mono text-[11px] text-subtle">hf.co/{m.handle}</span>
              </a>
            </li>
          ))}
        </ul>
      </Section>

      <Section className="border-t border-border bg-surface/30">
        <SectionHeader eyebrow="How we work" title="One pipeline, end to end." />
        <Pipeline />
        <div className="mt-6 flex flex-wrap gap-3">
          <Button asChild variant="outline">
            <Link href="/teich">
              The tooling <ArrowRight className="size-4" />
            </Link>
          </Button>
          <Button asChild variant="ghost">
            <a href={site.links.unsloth} target="_blank" rel="noopener noreferrer">
              Trained with Unsloth <ArrowUpRight className="size-3.5 opacity-60" />
            </a>
          </Button>
        </div>
      </Section>

      <Section>
        <SectionHeader eyebrow="What we stand for" title="Principles we try not to break." />
        <div className="grid gap-4 md:grid-cols-2">
          {principles.map((p) => (
            <div key={p.title} className="flex gap-4 rounded-2xl border border-border bg-surface p-5">
              <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl bg-accent text-ember ring-1 ring-ember/30">
                {p.icon}
              </span>
              <div>
                <h3 className="font-semibold">{p.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{p.body}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section className="border-t border-border bg-surface/30">
        <SectionHeader
          eyebrow="Get involved"
          title="Join the community or fund the next run."
          action={
            <Button asChild>
              <a href={site.links.huggingface} target="_blank" rel="noopener noreferrer">
                <HuggingFaceIcon className="size-4" /> Follow on Hugging Face
              </a>
            </Button>
          }
        />
        <Community followers={s.followers} />
      </Section>
    </>
  );
}
