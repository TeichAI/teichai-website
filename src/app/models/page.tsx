import type { Metadata } from "next";
import { getSnapshot } from "@/lib/hf";
import { formatCompact } from "@/lib/format";
import { PageHeader, StatPill } from "@/components/PageHeader";
import { ModelExplorer } from "@/components/ModelExplorer";
import { DegradedNotice } from "@/components/DegradedNotice";

export const revalidate = 3600;

const title = "Models";
const description =
  "Every TeichAI distill in one place: open-weight bases fine-tuned on frontier reasoning and agent traces, with GGUF quants and run commands.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/models" },
  openGraph: { title: `${title} · TeichAI`, description, url: "/models" },
};

export default async function ModelsPage() {
  const snap = await getSnapshot();
  return (
    <>
      <PageHeader
        eyebrow="Model catalog"
        title="Distilled models, grouped by release."
        description="Each card bundles the safetensors, GGUF and LoRA repositories of one fine-tune. Filter by the lab that taught it, the base family, size, and format. Open a card for quant lists, llama.cpp and Ollama commands, and lineage."
      >
        <div className="flex flex-wrap gap-2">
          <StatPill value={snap.stats.releases} label="releases" />
          <StatPill value={snap.stats.repos} label="repositories" />
          <StatPill value={formatCompact(snap.stats.downloadsAllTime)} label="downloads" />
          <StatPill value={snap.stats.ggufFiles} label="GGUF quants" />
        </div>
      </PageHeader>
      <section className="container-x pb-24">
        {snap.degraded && <DegradedNotice className="mb-6" />}
        <ModelExplorer
          releases={snap.releases}
          datasetIds={snap.datasets.map((d) => d.id)}
          newSince={snap.newSince}
        />
      </section>
    </>
  );
}
