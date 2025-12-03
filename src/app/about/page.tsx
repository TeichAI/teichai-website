import { ExternalLink } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { team } from "@/lib/data";

export const metadata = {
  title: "About - TeichAI",
  description: "Learn about TeichAI and the team behind our open-source AI research.",
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[var(--background)]">
      <Navbar />

      <section className="pt-24 pb-8 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-[var(--foreground)] mb-3">About TeichAI</h1>
          <p className="text-[var(--muted-foreground)] max-w-2xl">
            A collaboration between two AI researchers focused on making frontier model
            capabilities accessible through open-source distillation.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="pb-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-6 md:p-8">
            <h2 className="text-xl font-semibold text-[var(--foreground)] mb-4">Our Mission</h2>
            <div className="text-[var(--muted-foreground)] space-y-4">
              <p>
                Frontier AI models from Anthropic, OpenAI, and Google are incredibly capable but
                require API access and can be expensive to use at scale. We believe the open-source
                community deserves access to similar reasoning capabilities.
              </p>
              <p>
                Our approach is simple: we create high-quality datasets by querying frontier models
                with diverse prompts, then fine-tune open-source base models on these reasoning traces.
                The result is smaller, locally-runnable models that capture much of the original
                model&apos;s reasoning style.
              </p>
              <p>
                All our work is open source. We use <a href="https://github.com/unslothai/unsloth" target="_blank" rel="noopener noreferrer" className="text-amber-600 dark:text-amber-500 hover:underline">Unsloth</a> for
                efficient fine-tuning and release models in GGUF format for easy local deployment.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-xl font-semibold text-[var(--foreground)] mb-6">Team</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {team.map((member) => (
              <a
                key={member.name}
                href={member.link}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-5 hover:border-amber-600/50 transition-colors block"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-[var(--muted)] rounded-full flex items-center justify-center text-[var(--foreground)] font-medium">
                    {member.name[0]}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-[var(--foreground)]">{member.name}</h3>
                      <ExternalLink className="w-3 h-3 text-[var(--muted-foreground)]" />
                    </div>
                    <p className="text-xs text-[var(--muted-foreground)]">{member.role}</p>
                  </div>
                </div>
                <p className="text-[var(--muted-foreground)] text-sm">{member.focus}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* How We Work */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-xl font-semibold text-[var(--foreground)] mb-6">How We Work</h2>
          <div className="space-y-4">
            <div className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-5">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-amber-600/20 text-amber-600 dark:text-amber-500 rounded flex items-center justify-center font-medium text-sm shrink-0">
                  1
                </div>
                <div>
                  <h3 className="font-medium text-[var(--foreground)] mb-1">Dataset Creation</h3>
                  <p className="text-[var(--muted-foreground)] text-sm">
                    We curate diverse prompts covering coding, math, science, and general reasoning.
                    These are sent to frontier models with high reasoning effort settings to capture
                    detailed thinking traces.
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-5">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-amber-600/20 text-amber-600 dark:text-amber-500 rounded flex items-center justify-center font-medium text-sm shrink-0">
                  2
                </div>
                <div>
                  <h3 className="font-medium text-[var(--foreground)] mb-1">Fine-tuning</h3>
                  <p className="text-[var(--muted-foreground)] text-sm">
                    Using Unsloth for 2x faster training, we fine-tune open-source base models
                    (primarily Qwen3 variants) on our reasoning datasets. This transfers the
                    frontier model&apos;s reasoning patterns to the smaller model.
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-5">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-amber-600/20 text-amber-600 dark:text-amber-500 rounded flex items-center justify-center font-medium text-sm shrink-0">
                  3
                </div>
                <div>
                  <h3 className="font-medium text-[var(--foreground)] mb-1">Quantization & Release</h3>
                  <p className="text-[var(--muted-foreground)] text-sm">
                    Models are converted to GGUF format with multiple quantization levels (Q3, Q4, Q6, Q8)
                    for use with llama.cpp. This enables local deployment on consumer hardware.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Support */}
      <section className="py-12 pb-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-6 md:p-8">
            <h2 className="text-xl font-semibold text-[var(--foreground)] mb-4">Support Our Work</h2>
            <p className="text-[var(--muted-foreground)] mb-6">
              We&apos;re college students funding this research ourselves. Creating high-quality datasets
              from frontier models isn&apos;t cheap - our Claude Opus dataset alone cost over $52 to generate.
              If you find our models useful, please consider supporting us.
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href="https://paypal.me/TeichAI"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-500 text-white px-5 py-2.5 rounded font-medium transition-colors"
              >
                Donate via PayPal
              </a>
              <a
                href="https://huggingface.co/TeichAI"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[var(--muted)] hover:bg-[var(--border)] text-[var(--foreground)] px-5 py-2.5 rounded font-medium transition-colors"
              >
                Follow on Hugging Face
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
