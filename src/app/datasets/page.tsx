import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { DatasetsClient } from "./DatasetsClient";
import { Card, CardContent } from "@/components/ui/card";

export const metadata = {
  title: "Datasets - TeichAI",
  description: "High-quality reasoning datasets curated from frontier AI models.",
};

interface HFDataset {
  id: string;
  downloads: number;
  likes: number;
  tags: string[];
  createdAt: string;
}

async function getDatasets(): Promise<HFDataset[]> {
  try {
    const response = await fetch("https://huggingface.co/api/datasets?author=TeichAI&limit=100", {
      next: { revalidate: 3600 },
    });
    const datasets = await response.json();
    return datasets;
  } catch (error) {
    console.error("Error fetching datasets:", error);
    return [];
  }
}

export default async function DatasetsPage() {
  const datasets = await getDatasets();

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      <section className="relative overflow-hidden pt-24 pb-10">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(255,76,0,0.18),transparent_55%)]" />
        <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 sm:px-6 md:flex-row md:items-center md:justify-between">
          <div className="max-w-xl">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-primary/80">
              Dataset Library
            </p>
            <h1 className="mb-4 text-3xl font-bold leading-tight tracking-tight text-foreground md:text-4xl">
              Reasoning traces for distilling frontier models
            </h1>
            <p className="max-w-xl text-sm text-muted-foreground md:text-base">
              Curated datasets built by querying Claude, GPT, Gemini and other frontier models with
              diverse coding, math, and reasoning prompts. Designed for training small open models
              that still think clearly.
            </p>
          </div>

          <Card className="w-full max-w-md bg-[var(--muted)]/40 shadow-[0_18px_60px_rgba(0,0,0,0.6)]">
            <CardContent className="p-5">
              <p className="mb-2 text-xs font-medium text-muted-foreground">What&apos;s included</p>
              <p className="text-sm text-muted-foreground">
                Each dataset includes detailed reasoning traces, carefully filtered conversations, and
                metadata ready for fine-tuning. Listings are synced hourly from{" "}
                <a
                  href="https://huggingface.co/TeichAI"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Hugging Face
                </a>
                .
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="pb-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <DatasetsClient datasets={datasets} />
        </div>
      </section>

      <Footer />
    </main>
  );
}
