import { ExternalLink } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { team } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const metadata = {
  title: "About - TeichAI",
  description: "Learn about TeichAI and the team behind our open-source AI research.",
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      <section className="relative overflow-hidden pt-24 pb-10">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(255,76,0,0.18),transparent_55%)]" />
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-primary/80">
            About
          </p>
          <h1 className="mb-4 text-3xl font-bold leading-tight tracking-tight text-foreground md:text-4xl">
            Open-source distillation, built in public
          </h1>
          <p className="max-w-2xl text-sm text-muted-foreground md:text-base">
            We distill frontier reasoning models into much smaller open models and publish the datasets to
            help the community train, evaluate, and deploy locally.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="pb-12">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <Card className="border border-border/60 bg-[var(--muted)]/20">
            <CardContent className="p-6 md:p-8">
              <h2 className="mb-4 text-xl font-semibold text-foreground">Our Mission</h2>
              <div className="space-y-4 text-muted-foreground">
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
                All our work is open source. We use{" "}
                <a
                  href="https://github.com/unslothai/unsloth"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Unsloth
                </a>{" "}
                for
                efficient fine-tuning and release models in GGUF format for easy local deployment.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Team */}
      <section className="py-12">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="mb-6 text-xl font-semibold text-foreground">Team</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {team.map((member) => (
              <a
                key={member.name}
                href={member.link}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <Card className="border border-border/60 bg-[var(--muted)]/20 transition-all hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-[0_18px_60px_rgba(0,0,0,0.6)]">
                  <CardContent className="p-5">
                    <div className="mb-3 flex items-center gap-3">
                      <div className="flex size-10 items-center justify-center rounded-full bg-[var(--muted)]/60 font-medium text-foreground ring-1 ring-border/60">
                        {member.name[0]}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium text-foreground">{member.name}</h3>
                          <ExternalLink className="size-3 text-muted-foreground" />
                        </div>
                        <p className="text-xs text-muted-foreground">{member.role}</p>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">{member.focus}</p>
                  </CardContent>
                </Card>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* How We Work */}
      <section className="py-12">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="mb-6 text-xl font-semibold text-foreground">How We Work</h2>
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="border border-border/60 bg-[var(--muted)]/20">
              <CardContent className="p-5">
                <div className="mb-3 flex items-center gap-3">
                  <div className="flex size-9 items-center justify-center rounded-lg bg-accent text-primary font-semibold">
                    1
                  </div>
                  <h3 className="font-medium text-foreground">Dataset Creation</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  We curate diverse prompts (coding, math, science) and query frontier models with
                  high reasoning effort to capture detailed traces.
                </p>
              </CardContent>
            </Card>
            <Card className="border border-border/60 bg-[var(--muted)]/20">
              <CardContent className="p-5">
                <div className="mb-3 flex items-center gap-3">
                  <div className="flex size-9 items-center justify-center rounded-lg bg-accent text-primary font-semibold">
                    2
                  </div>
                  <h3 className="font-medium text-foreground">Fine-tuning</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  We fine-tune open-source base models (mostly Qwen3 variants) on our reasoning
                  datasets using Unsloth for faster, cheaper training.
                </p>
              </CardContent>
            </Card>
            <Card className="border border-border/60 bg-[var(--muted)]/20">
              <CardContent className="p-5">
                <div className="mb-3 flex items-center gap-3">
                  <div className="flex size-9 items-center justify-center rounded-lg bg-accent text-primary font-semibold">
                    3
                  </div>
                  <h3 className="font-medium text-foreground">Quantization & Release</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  We export GGUF with multiple quant levels (Q3/Q4/Q6/Q8) for llama.cpp so you can
                  run locally on consumer hardware.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Support */}
      <section className="py-12 pb-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <Card className="border border-border/60 bg-[var(--muted)]/20">
            <CardContent className="p-6 md:p-8">
              <h2 className="mb-4 text-xl font-semibold text-foreground">Support Our Work</h2>
              <p className="mb-6 text-muted-foreground">
              We&apos;re college students funding this research ourselves. Creating high-quality datasets
              from frontier models isn&apos;t cheap - our Claude Opus dataset alone cost over $52 to generate.
              If you find our models useful, please consider supporting us.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button asChild size="lg">
                  <a href="https://paypal.me/TeichAI" target="_blank" rel="noopener noreferrer">
                    Donate via PayPal
                  </a>
                </Button>
                <Button asChild size="lg" variant="secondary">
                  <a href="https://huggingface.co/TeichAI" target="_blank" rel="noopener noreferrer">
                    Follow on Hugging Face
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
