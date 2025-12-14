import Link from "next/link";
import { ArrowRight, Download, Database, Cpu } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { formatDownloads } from "@/lib/huggingface";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface HFModel {
  id: string;
  downloads: number;
  likes: number;
}

interface HFDataset {
  id: string;
  downloads: number;
}

async function getStats() {
  try {
    const [teichModels, liontixModels, datasets] = await Promise.all([
      fetch("https://huggingface.co/api/models?author=TeichAI&limit=100", {
        next: { revalidate: 3600 },
      }).then(r => r.json()),
      fetch("https://huggingface.co/api/models?author=Liontix&limit=100", {
        next: { revalidate: 3600 },
      }).then(r => r.json()),
      fetch("https://huggingface.co/api/datasets?author=TeichAI&limit=100", {
        next: { revalidate: 3600 },
      }).then(r => r.json()),
    ]);

    const allModels = [...teichModels, ...liontixModels];
    const totalDownloads = allModels.reduce((sum: number, m: HFModel) => sum + m.downloads, 0) +
      datasets.reduce((sum: number, d: HFDataset) => sum + d.downloads, 0);

    // Get top 2 models by downloads
    const topModels = allModels
      .sort((a: HFModel, b: HFModel) => b.downloads - a.downloads)
      .slice(0, 2);

    return {
      totalDownloads: formatDownloads(totalDownloads),
      totalModels: allModels.length,
      totalDatasets: datasets.length,
      topModels,
    };
  } catch (error) {
    console.error("Error fetching stats:", error);
    return {
      totalDownloads: "50K+",
      totalModels: 30,
      totalDatasets: 10,
      topModels: [],
    };
  }
}

export default async function Home() {
  const stats = await getStats();
  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden pt-24 pb-16">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(255,76,0,0.10),transparent_55%)] dark:bg-[radial-gradient(circle_at_top,rgba(255,76,0,0.16),transparent_55%)]" />
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="max-w-3xl">
            <p className="mb-3 text-sm font-medium text-primary">Open Source AI Research</p>
            <h1 className="mb-6 text-4xl font-bold leading-tight tracking-tight text-foreground md:text-5xl">
              Distilled models and curated datasets for the community
            </h1>
            <p className="mb-8 text-lg leading-relaxed text-muted-foreground">
              We fine-tune open-source models on high-quality reasoning datasets from frontier models
              like Claude, GPT, and Gemini. All models are released in GGUF format for local deployment.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg" className="shadow-sm">
                <Link href="/models">
                  Browse Models
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="secondary">
                <Link href="/datasets">View Datasets</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="bg-[var(--muted)] shadow-[0_18px_60px_rgba(0,0,0,0.6)]">
              <CardContent className="p-6">
                <p className="text-3xl font-bold text-foreground">{stats.totalDownloads}</p>
                <p className="mt-1 text-sm text-muted-foreground">Downloads (last 30 days)</p>
              </CardContent>
            </Card>
            <Card className="bg-[var(--muted)] shadow-[0_18px_60px_rgba(0,0,0,0.6)]">
              <CardContent className="p-6">
                <p className="text-3xl font-bold text-foreground">{stats.totalModels}</p>
                <p className="mt-1 text-sm text-muted-foreground">Models Released</p>
              </CardContent>
            </Card>
            <Card className="bg-[var(--muted)] shadow-[0_18px_60px_rgba(0,0,0,0.6)]">
              <CardContent className="p-6">
                <p className="text-3xl font-bold text-foreground">{stats.totalDatasets}</p>
                <p className="mt-1 text-sm text-muted-foreground">Datasets Published</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* What We Do */}
      <section className="py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="mb-8 text-2xl font-bold text-foreground">What We Do</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="transition-shadow hover:shadow-md">
              <CardHeader className="space-y-3">
                <div className="inline-flex size-10 items-center justify-center rounded-lg bg-accent text-primary">
                  <Cpu className="size-5" />
                </div>
                <CardTitle>Model Distillation</CardTitle>
                <CardDescription className="text-sm leading-relaxed">
                  We train open-source base models (Qwen3, GPT-OSS) on reasoning traces from frontier
                  models. This transfers capabilities while keeping models small and efficient.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="transition-shadow hover:shadow-md">
              <CardHeader className="space-y-3">
                <div className="inline-flex size-10 items-center justify-center rounded-lg bg-accent text-primary">
                  <Database className="size-5" />
                </div>
                <CardTitle>Dataset Curation</CardTitle>
                <CardDescription className="text-sm leading-relaxed">
                  We create high-quality reasoning datasets by querying models like Claude Opus,
                  Gemini Pro, and GPT-5 with diverse prompts covering coding, math, and science.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="transition-shadow hover:shadow-md">
              <CardHeader className="space-y-3">
                <div className="inline-flex size-10 items-center justify-center rounded-lg bg-accent text-primary">
                  <Download className="size-5" />
                </div>
                <CardTitle>GGUF Quantization</CardTitle>
                <CardDescription className="text-sm leading-relaxed">
                  All models are released in GGUF format with multiple quantization levels (Q4, Q8,
                  etc.) for use with llama.cpp on consumer hardware.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Models */}
      <section className="bg-muted/30 py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-foreground">Top Models</h2>
            <Link href="/models" className="text-sm font-medium text-primary transition-colors hover:opacity-80">
              View all →
            </Link>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {stats.topModels.length > 0 ? (
              stats.topModels.map((model: HFModel) => (
                <a
                  key={model.id}
                  href={`https://huggingface.co/${model.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <Card className="transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md">
                    <CardContent className="p-5">
                      <div className="mb-3 flex items-start justify-between">
                        <h3 className="font-medium text-foreground">{model.id.split("/")[1]}</h3>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>{formatDownloads(model.downloads)} downloads</span>
                        <span>{model.likes} likes</span>
                      </div>
                    </CardContent>
                  </Card>
                </a>
              ))
            ) : (
              <>
                <a
                  href="https://hf.co/TeichAI/Qwen3-14B-Claude-Sonnet-4.5-Reasoning-Distill-GGUF"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <Card className="transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md">
                    <CardContent className="p-5">
                      <div className="mb-3 flex items-start justify-between">
                        <h3 className="font-medium text-foreground">Qwen3 14B Claude Sonnet 4.5</h3>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>16.9K downloads</span>
                        <span>8 likes</span>
                      </div>
                    </CardContent>
                  </Card>
                </a>
                <a
                  href="https://hf.co/TeichAI/Qwen3-8B-Gemini-3-Pro-Preview-Distill-GGUF"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <Card className="transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md">
                    <CardContent className="p-5">
                      <div className="mb-3 flex items-start justify-between">
                        <h3 className="font-medium text-foreground">Qwen3 8B Gemini 3 Pro</h3>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>3.8K downloads</span>
                        <span>11 likes</span>
                      </div>
                    </CardContent>
                  </Card>
                </a>
              </>
            )}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <Card className="overflow-hidden">
            <CardContent className="p-8 md:p-12">
              <div className="max-w-2xl">
                <h2 className="mb-4 text-2xl font-bold text-foreground">Support Our Work</h2>
                <p className="mb-6 text-muted-foreground">
                We&apos;re two college students funding this research out of pocket. Dataset generation
                costs add up quickly - our Claude Opus dataset alone cost $52+ to create.
                If you find our models useful, consider supporting us.
                </p>
                <Button asChild size="lg" className="shadow-sm">
                  <a href="https://paypal.me/TeichAI" target="_blank" rel="noopener noreferrer">
                    Donate via PayPal
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </main>
  );
}
