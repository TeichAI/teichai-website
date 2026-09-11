import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getSnapshot, getTeichMeta } from "@/lib/hf";
import { Hero } from "@/components/home/Hero";
import { TeacherMarquee } from "@/components/home/TeacherMarquee";
import { Matrix } from "@/components/home/Matrix";
import { Leaderboard } from "@/components/home/Leaderboard";
import { Pipeline } from "@/components/home/Pipeline";
import { TeichPromo } from "@/components/home/TeichPromo";
import { Community } from "@/components/home/Community";
import { ReleaseCard } from "@/components/ReleaseCard";
import { DatasetCard } from "@/components/DatasetCard";
import { Section, SectionHeader } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { DegradedNotice } from "@/components/DegradedNotice";
import { site } from "@/lib/site";

export const revalidate = 3600;

export const metadata: Metadata = {
  alternates: { canonical: "/" },
  openGraph: { title: "TeichAI — Open distillation lab", description: site.description, url: "/" },
};

export default async function Home() {
  const [snap, teich] = await Promise.all([getSnapshot(), getTeichMeta()]);
  const latest = snap.releases.slice(0, 6);
  const latestDatasets = snap.datasets.slice(0, 3);
  const datasetsWithTeich = snap.datasets.filter((d) => d.generatedWithTeich).length;

  return (
    <>
      <Hero stats={snap.stats} fetchedAt={snap.fetchedAt} />
      {snap.degraded && (
        <div className="container-x -mt-8 mb-8">
          <DegradedNotice />
        </div>
      )}
      <TeacherMarquee teachers={snap.teachers} />

      <Section id="latest">
        <SectionHeader
          eyebrow="Fresh off the GPU"
          title="Latest releases"
          description="Every fine-tune ships as full weights plus GGUF quants. Click a card for quant lists, run commands, and the datasets it was trained on."
          action={
            <Button asChild variant="outline">
              <Link href="/models">
                All {snap.stats.releases} models <ArrowRight className="size-4" />
              </Link>
            </Button>
          }
        />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {latest.map((r) => (
            <ReleaseCard key={r.slug} release={r} newSince={snap.newSince} />
          ))}
        </div>
      </Section>

      <Section className="border-t border-border bg-surface/30" id="matrix">
        <SectionHeader
          eyebrow="The distillation matrix"
          title="Every base we have trained, against every lab we have learned from."
          description="Rows are open-weight base families, columns are the labs whose frontier models taught them. Hover a cell to see the releases, click to open them in the catalog."
        />
        <Matrix matrix={snap.matrix} />
      </Section>

      <Section id="leaderboard">
        <SectionHeader
          eyebrow="Community favorites"
          title="What people actually run"
          description="Ranked by all-time downloads across Hugging Face, counted across every repository of a release."
        />
        <Leaderboard releases={snap.releases} datasets={snap.datasets} />
      </Section>

      <Section className="border-t border-border bg-surface/30" id="how">
        <SectionHeader
          eyebrow="How a distill is made"
          title="From frontier trace to local GGUF in four steps."
          description="The whole pipeline is open. The datasets are on Hugging Face, the tooling is on PyPI, and the recipes are in the model cards."
        />
        <Pipeline />
      </Section>

      <Section id="datasets">
        <SectionHeader
          eyebrow="Training data, published"
          title="Newest datasets"
          description="Reasoning traces, agent sessions and chat data from frontier models, released so you can train your own."
          action={
            <Button asChild variant="outline">
              <Link href="/datasets">
                All {snap.stats.datasets} datasets <ArrowRight className="size-4" />
              </Link>
            </Button>
          }
        />
        <div className="grid gap-4 md:grid-cols-3">
          {latestDatasets.map((d) => (
            <DatasetCard key={d.id} dataset={d} newSince={snap.newSince} />
          ))}
        </div>
      </Section>

      <Section className="pt-0" id="teich">
        <TeichPromo meta={teich} datasetsWithTeich={datasetsWithTeich} />
      </Section>

      <Section className="border-t border-border bg-surface/30" id="community">
        <SectionHeader
          eyebrow="Built in public"
          title="Come hang out, request a distill, or keep the lights on."
        />
        <Community followers={snap.stats.followers} />
      </Section>
    </>
  );
}
