import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ModelsClient } from "./ModelsClient";

export const metadata = {
  title: "Models - TeichAI",
  description: "Browse our collection of distilled models trained on frontier AI reasoning datasets.",
};

interface HFModel {
  id: string;
  downloads: number;
  likes: number;
  tags: string[];
  createdAt: string;
}

async function getModels(): Promise<HFModel[]> {
  try {
    const [teichModels, liontixModels] = await Promise.all([
      fetch("https://huggingface.co/api/models?author=TeichAI&limit=100", {
        next: { revalidate: 3600 },
      }).then(r => r.json()),
      fetch("https://huggingface.co/api/models?author=Liontix&limit=100", {
        next: { revalidate: 3600 },
      }).then(r => r.json()),
    ]);
    return [...teichModels, ...liontixModels];
  } catch (error) {
    console.error("Error fetching models:", error);
    return [];
  }
}

export default async function ModelsPage() {
  const models = await getModels();

  return (
    <main className="min-h-screen bg-[var(--background)]">
      <Navbar />

      <section className="pt-24 pb-8 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-[var(--foreground)] mb-3">Models</h1>
          <p className="text-[var(--muted-foreground)] max-w-2xl">
            All models are fine-tuned using <a href="https://github.com/unslothai/unsloth" target="_blank" rel="noopener noreferrer" className="text-amber-600 dark:text-amber-500 hover:underline">Unsloth</a> and
            released in GGUF format for use with llama.cpp. Data refreshes hourly from Hugging Face.
          </p>
        </div>
      </section>

      <section className="pb-16 px-4">
        <div className="max-w-6xl mx-auto">
          <ModelsClient models={models} />
        </div>
      </section>

      <Footer />
    </main>
  );
}
