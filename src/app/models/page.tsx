import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ModelsClient } from "./ModelsClient";
import { Card, CardContent } from "@/components/ui/card";

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
    <main className="min-h-screen bg-background">
      <Navbar />

      <section className="relative overflow-hidden pt-24 pb-10">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(255,76,0,0.18),transparent_55%)]" />
        <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 sm:px-6 md:flex-row md:items-center md:justify-between">
          <div className="max-w-xl">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-primary/80">
              Model Catalog
            </p>
            <h1 className="mb-4 text-3xl font-bold leading-tight tracking-tight text-foreground md:text-4xl">
              Distilled models ready for local deployment
            </h1>
            <p className="max-w-xl text-sm text-muted-foreground md:text-base">
              Fine-tuned Qwen and other open models on high-quality reasoning traces from Claude, GPT,
              and Gemini. Optimized for GGUF inference on consumer GPUs and laptops.
            </p>
          </div>

          <Card className="w-full max-w-md bg-[var(--muted)]/40 shadow-[0_18px_60px_rgba(0,0,0,0.6)]">
            <CardContent className="p-5">
              <p className="mb-2 text-xs font-medium text-muted-foreground">How we train</p>
              <p className="text-sm text-muted-foreground">
                All models are fine-tuned with{" "}
                <a
                  href="https://github.com/unslothai/unsloth"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Unsloth
                </a>{" "}
                and released in GGUF format for llama.cpp. Metadata is refreshed hourly from
                Hugging Face.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="pb-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <ModelsClient models={models} />
        </div>
      </section>

      <Footer />
    </main>
  );
}
