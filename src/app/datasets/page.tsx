import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { DatasetsClient } from "./DatasetsClient";

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
    <main className="min-h-screen bg-[var(--background)]">
      <Navbar />

      <section className="pt-24 pb-8 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-[var(--foreground)] mb-3">Datasets</h1>
          <p className="text-[var(--muted-foreground)] max-w-2xl">
            Reasoning datasets created by querying frontier models with diverse prompts.
            Use these for fine-tuning your own distilled models. Data refreshes hourly from Hugging Face.
          </p>
        </div>
      </section>

      <section className="pb-16 px-4">
        <div className="max-w-6xl mx-auto">
          <DatasetsClient datasets={datasets} />
        </div>
      </section>

      <Footer />
    </main>
  );
}
