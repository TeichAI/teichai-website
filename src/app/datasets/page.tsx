import type { Metadata } from "next";
import { getSnapshot } from "@/lib/hf";
import { formatCompact } from "@/lib/format";
import { site } from "@/lib/site";
import { PageHeader, StatPill } from "@/components/PageHeader";
import { DatasetExplorer } from "@/components/DatasetExplorer";
import { DegradedNotice } from "@/components/DegradedNotice";

export const revalidate = 3600;

const title = "Datasets";
const description =
  "Reasoning traces, agent sessions and chat data generated from frontier models like Claude, GPT, Gemini and DeepSeek, published for training open models.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/datasets" },
  openGraph: { title: `${title} · TeichAI`, description, url: "/datasets" },
};

export default async function DatasetsPage() {
  const snap = await getSnapshot();
  const totalRows = snap.datasets.reduce((s, d) => s + (d.samples ?? 0), 0);
  const releaseRefs = snap.releases.map((r) => ({
    slug: r.slug,
    title: r.title,
    teacher: r.teacher,
    datasets: r.datasets,
  }));

  // Google Dataset Search reads schema.org Dataset entries; the catalog itself
  // is client-filtered, so list them here.
  const datasetJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: snap.datasets.map((d, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Dataset",
        name: d.title,
        description: d.description || `${d.title} by TeichAI`,
        url: d.url,
        license: d.license,
        creator: { "@type": "Organization", name: site.name, url: site.url },
        dateCreated: d.createdAt,
        dateModified: d.lastModified,
      },
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(datasetJsonLd) }} />
      <PageHeader
        eyebrow="Dataset library"
        title="The traces behind the models."
        description="Every dataset we train on is public. Reasoning traces with full thinking, multi-turn agent sessions with tool calls, and plain chat data, generated from frontier models and formatted for supervised fine-tuning."
      >
        <div className="flex flex-wrap gap-2">
          <StatPill value={snap.stats.datasets} label="datasets" />
          <StatPill value={`${formatCompact(totalRows)}+`} label="labeled samples" />
          <StatPill
            value={formatCompact(snap.datasets.reduce((s, d) => s + d.downloadsAllTime, 0))}
            label="downloads"
          />
          <StatPill value={snap.datasets.filter((d) => d.generatedWithTeich).length} label="made with teich" />
        </div>
      </PageHeader>
      <section className="container-x pb-24">
        {snap.degraded && <DegradedNotice className="mb-6" />}
        <DatasetExplorer datasets={snap.datasets} releases={releaseRefs} newSince={snap.newSince} />
      </section>
    </>
  );
}
