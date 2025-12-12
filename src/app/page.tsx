import Link from "next/link";
import { ArrowRight, Download, Database, Cpu } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { formatDownloads } from "@/lib/huggingface";

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
    <main className="min-h-screen bg-[var(--background)]">
      <Navbar />

      {/* Hero */}
      <section className="pt-24 pb-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-3xl">
            <p className="text-[var(--accent)] font-medium mb-3">Open Source AI Research</p>
            <h1 className="text-4xl md:text-5xl font-bold text-[var(--foreground)] mb-6 leading-tight">
              Distilled models and curated datasets for the community
            </h1>
            <p className="text-lg text-[var(--muted-foreground)] mb-8 leading-relaxed">
              We fine-tune open-source models on high-quality reasoning datasets from frontier models
              like Claude, GPT, and Gemini. All models are released in GGUF format for local deployment.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/models"
                className="inline-flex items-center gap-2 bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white px-6 py-3 rounded-lg font-medium transition-all shadow-sm hover:shadow-md"
              >
                Browse Models
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/datasets"
                className="inline-flex items-center gap-2 bg-[var(--muted)] hover:bg-[var(--border)] text-[var(--foreground)] px-6 py-3 rounded-lg font-medium transition-all"
              >
                View Datasets
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 px-4 border-y border-[var(--border)]">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-3 gap-8">
            <div>
              <p className="text-3xl font-bold text-[var(--foreground)]">{stats.totalDownloads}</p>
              <p className="text-[var(--muted-foreground)] text-sm mt-1">Downloads (last 30 days)</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-[var(--foreground)]">{stats.totalModels}</p>
              <p className="text-[var(--muted-foreground)] text-sm mt-1">Models Released</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-[var(--foreground)]">{stats.totalDatasets}</p>
              <p className="text-[var(--muted-foreground)] text-sm mt-1">Datasets Published</p>
            </div>
          </div>
        </div>
      </section>

      {/* What We Do */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-[var(--foreground)] mb-8">What We Do</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-6">
              <Cpu className="w-8 h-8 text-[var(--accent)] mb-4" />
              <h3 className="text-lg font-semibold text-[var(--foreground)] mb-2">Model Distillation</h3>
              <p className="text-[var(--muted-foreground)] text-sm leading-relaxed">
                We train open-source base models (Qwen3, GPT-OSS) on reasoning traces from
                frontier models. This transfers capabilities while keeping models small and efficient.
              </p>
            </div>
            <div className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-6">
              <Database className="w-8 h-8 text-[var(--accent)] mb-4" />
              <h3 className="text-lg font-semibold text-[var(--foreground)] mb-2">Dataset Curation</h3>
              <p className="text-[var(--muted-foreground)] text-sm leading-relaxed">
                We create high-quality reasoning datasets by querying models like Claude Opus,
                Gemini Pro, and GPT-5 with diverse prompts covering coding, math, and science.
              </p>
            </div>
            <div className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-6">
              <Download className="w-8 h-8 text-[var(--accent)] mb-4" />
              <h3 className="text-lg font-semibold text-[var(--foreground)] mb-2">GGUF Quantization</h3>
              <p className="text-[var(--muted-foreground)] text-sm leading-relaxed">
                All models are released in GGUF format with multiple quantization levels
                (Q4, Q8, etc.) for use with llama.cpp on consumer hardware.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Models */}
      <section className="py-16 px-4 bg-[var(--muted)]/50">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-[var(--foreground)]">Top Models</h2>
            <Link href="/models" className="text-[var(--accent)] hover:text-[var(--accent-hover)] text-sm font-medium transition-colors">
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
                  className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-5 hover:border-[var(--accent)]/50 transition-colors block"
                >
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-medium text-[var(--foreground)]">{model.id.split("/")[1]}</h3>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-[var(--muted-foreground)]">
                    <span>{formatDownloads(model.downloads)} downloads</span>
                    <span>{model.likes} likes</span>
                  </div>
                </a>
              ))
            ) : (
              <>
                <a
                  href="https://hf.co/TeichAI/Qwen3-14B-Claude-Sonnet-4.5-Reasoning-Distill-GGUF"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-5 hover:border-[var(--accent)]/50 transition-colors block"
                >
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-medium text-[var(--foreground)]">Qwen3 14B Claude Sonnet 4.5</h3>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-[var(--muted-foreground)]">
                    <span>16.9K downloads</span>
                    <span>8 likes</span>
                  </div>
                </a>
                <a
                  href="https://hf.co/TeichAI/Qwen3-8B-Gemini-3-Pro-Preview-Distill-GGUF"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-5 hover:border-[var(--accent)]/50 transition-colors block"
                >
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-medium text-[var(--foreground)]">Qwen3 8B Gemini 3 Pro</h3>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-[var(--muted-foreground)]">
                    <span>3.8K downloads</span>
                    <span>11 likes</span>
                  </div>
                </a>
              </>
            )}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-8 md:p-12">
            <div className="max-w-2xl">
              <h2 className="text-2xl font-bold text-[var(--foreground)] mb-4">Support Our Work</h2>
              <p className="text-[var(--muted-foreground)] mb-6">
                We&apos;re two college students funding this research out of pocket. Dataset generation
                costs add up quickly - our Claude Opus dataset alone cost $52+ to create.
                If you find our models useful, consider supporting us.
              </p>
              <a
                href="https://paypal.me/TeichAI"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white px-6 py-3 rounded-lg font-medium transition-all shadow-sm hover:shadow-md"
              >
                Donate via PayPal
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
