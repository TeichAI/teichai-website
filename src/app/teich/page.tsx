import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Boxes,
  FileJson,
  GitBranch,
  MonitorPlay,
  ScanSearch,
  ShieldCheck,
  Star,
  Wand2,
} from "lucide-react";
import { getSnapshot, getTeichMeta } from "@/lib/hf";
import { site } from "@/lib/site";
import { formatCompact } from "@/lib/format";
import { PageHeader, StatPill } from "@/components/PageHeader";
import { Section, SectionHeader } from "@/components/ui/section";
import { Snippet } from "@/components/ui/snippet";
import { Button } from "@/components/ui/button";
import { Terminal } from "@/components/home/TeichPromo";
import { GithubIcon } from "@/components/BrandIcons";
import { DatasetCard } from "@/components/DatasetCard";

export const revalidate = 3600;

const title = "Teich toolkit";
const description =
  "teich is TeichAI's open-source Python toolkit for generating, extracting, normalizing and masking agent traces into auditable supervised fine-tuning data.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/teich" },
  openGraph: { title: `${title} · TeichAI`, description, url: "/teich" },
};

const features = [
  {
    icon: <Wand2 className="size-5" />,
    title: "Generate traces",
    body: "Run Codex, Pi, Claude Code, Hermes or plain chat agents against your prompts and real GitHub repos. Resume interrupted batches.",
  },
  {
    icon: <ScanSearch className="size-5" />,
    title: "Extract local sessions",
    body: "Turn the Claude Code, Codex, Cursor, Pi and Hermes sessions already on your machine into an anonymized dataset with one command.",
  },
  {
    icon: <FileJson className="size-5" />,
    title: "Normalize everything",
    body: "Raw traces, JSONL, Hugging Face datasets and in-memory Dataset objects become OpenAI-style messages plus tools, with provenance intact.",
  },
  {
    icon: <GitBranch className="size-5" />,
    title: "Render with your template",
    body: "Rows are rendered through the target tokenizer's chat template, including live Gemma 4, Qwen 3.6 / 3.8 and Granite 4.2 thinking modes.",
  },
  {
    icon: <ShieldCheck className="size-5" />,
    title: "Mask the loss correctly",
    body: "Typed supervision spans are recorded before tokenization and applied after TRL or Unsloth tokenizes, so labels land exactly on assistant turns.",
  },
  {
    icon: <Boxes className="size-5" />,
    title: "Audit the run",
    body: "Dropped, oversized, trimmed, malformed and fully-masked rows are reported instead of silently vanishing into your training set.",
  },
];

const docs = [
  { name: "CLI reference", path: "docs/cli.md" },
  { name: "Teich Studio (browser UI)", path: "docs/studio.md" },
  { name: "Generation", path: "docs/generation.md" },
  { name: "Preparing data", path: "docs/prepare-data.md" },
  { name: "Training with TRL / Unsloth", path: "docs/training.md" },
  { name: "Data format", path: "docs/data-format.md" },
  { name: "Python API", path: "docs/python-api.md" },
  { name: "Pipeline flow", path: "docs/pipeline.md" },
];

export default async function TeichPage() {
  const [meta, snap] = await Promise.all([getTeichMeta(), getSnapshot()]);
  const made = snap.datasets.filter((d) => d.generatedWithTeich);

  return (
    <>
      <PageHeader
        eyebrow="Open-source toolkit"
        title={
          <>
            <span className="font-mono text-ember">teich</span>: agent data infrastructure for people who train models.
          </>
        }
        description={meta.summary}
      >
        <div className="flex flex-wrap items-center gap-3">
          <Button asChild size="lg" variant="ember">
            <a href={site.links.teichRepo} target="_blank" rel="noopener noreferrer">
              <GithubIcon className="size-4" /> GitHub <ArrowUpRight className="size-3.5" />
            </a>
          </Button>
          <Button asChild size="lg" variant="secondary">
            <a href={site.links.teichPypi} target="_blank" rel="noopener noreferrer">
              PyPI <ArrowUpRight className="size-3.5 opacity-60" />
            </a>
          </Button>
          {/* Only shown when GitHub and PyPI answered; the fallbacks are not presented as live. */}
          {meta.live && (
            <div className="flex flex-wrap gap-2">
              <StatPill value={`v${meta.version}`} label="latest" />
              <StatPill
                value={
                  <span className="inline-flex items-center gap-1">
                    <Star className="size-4 text-ember" aria-hidden /> {formatCompact(meta.stars)}
                  </span>
                }
                label="stars"
              />
              <StatPill value={meta.releases} label="PyPI releases" />
            </div>
          )}
        </div>
      </PageHeader>

      <Section className="pt-4">
        <div className="grid gap-6 lg:grid-cols-2">
          <Terminal
            title="install & generate"
            lines={[
              { prompt: true, text: "pip install teich        # or: uvx teich --help" },
              { prompt: true, text: "teich init my-project && cd my-project" },
              { text: "# add prompts to prompts.jsonl, set OPENAI_API_KEY", muted: true },
              { prompt: true, text: "teich generate -c config.yaml --resume" },
              { text: "✓ raw traces · training rows · tools.json · dataset card → output/", muted: true },
              { prompt: true, text: "teich studio             # configure runs in the browser" },
            ]}
          />
          <Terminal
            title="extract & convert"
            lines={[
              { prompt: true, text: "teich extract claude --model fable-5 --out data" },
              { text: "✓ anonymized sessions staged · README.md written", muted: true },
              { text: "  upload to Hugging Face? (y/N)", muted: true },
              { prompt: true, text: "teich extract cursor --sessions-dir ~/Cursor/User/workspaceStorage" },
              { prompt: true, text: "teich convert data --out teich-training.jsonl" },
              { text: "✓ standalone OpenAI-style rows: prompt · messages · tools · metadata", muted: true },
            ]}
          />
        </div>
      </Section>

      <Section className="pt-0">
        <SectionHeader
          eyebrow="Why it exists"
          title="Most SFT pipelines flatten agent data too early."
          description="That loses tool schemas, tool results, reasoning boundaries and the exact assistant spans you meant to train on. teich keeps the data structured until the last practical moment."
        />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {features.map((f) => (
            <div key={f.title} className="rounded-2xl border border-border bg-surface p-5">
              <span className="inline-flex size-10 items-center justify-center rounded-xl bg-accent text-ember ring-1 ring-ember/30">
                {f.icon}
              </span>
              <h3 className="mt-4 font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.body}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section className="border-t border-border bg-surface/30">
        <SectionHeader
          eyebrow="Train on our data in two calls"
          title="prepare_data() then mask_data()."
          description="Point it at any dataset on this site. It renders through your tokenizer's chat template, records supervision spans, and applies response-only labels after the trainer tokenizes."
        />
        <div className="grid gap-4 lg:grid-cols-2">
          <Snippet
            label="1 · load and render"
            language="python"
            code={`from teich import prepare_data

train_dataset = prepare_data(
    "TeichAI/Claude-Opus-4.6-Reasoning-887x",
    tokenizer,
    max_length=32768,
    oversized_policy="trim_followups",
    tokenize=True,
    chat_template_kwargs={
        "enable_thinking": True,
        "preserve_thinking": True,
    },
)`}
          />
          <Snippet
            label="2 · mask after tokenization"
            language="python"
            code={`from teich import mask_data

trainer = mask_data(
    trainer,                    # your TRL / Unsloth SFTTrainer
    tokenizer=tokenizer,
    train_on_reasoning=True,
    train_on_final_answers=True,
    train_on_tools=True,
)

trainer.train()`}
          />
        </div>
        <div className="mt-6 rounded-2xl border border-border bg-surface p-5">
          <p className="eyebrow mb-3">Pipeline</p>
          <ol className="flex flex-wrap items-center gap-2 font-mono text-[12px] text-muted-foreground">
            {[
              "prompts / traces / JSONL / HF datasets",
              "load_traces() · prepare_data()",
              "normalized messages + tools",
              "chat template rendering",
              "supervision spans",
              "SFTTrainer tokenization",
              "mask_data()",
              "audited input_ids + labels",
            ].map((s, i, arr) => (
              <li key={s} className="flex items-center gap-2">
                <span className="rounded-md border border-border bg-background px-2 py-1 text-foreground">{s}</span>
                {i < arr.length - 1 && <ArrowRight className="size-3.5 text-ember" />}
              </li>
            ))}
          </ol>
        </div>
      </Section>

      <Section>
        <SectionHeader
          eyebrow="Documentation"
          title="Everything is written down."
          action={
            <Button asChild variant="outline">
              <a href={site.links.teichDocs} target="_blank" rel="noopener noreferrer">
                Browse the docs <ArrowUpRight className="size-4" />
              </a>
            </Button>
          }
        />
        <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {docs.map((d) => (
            <li key={d.path}>
              <a
                href={`${site.links.teichRepo}/blob/main/${d.path}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between rounded-xl border border-border bg-surface px-4 py-3 text-sm transition hover:border-ember/50"
              >
                <span className="flex items-center gap-2">
                  <MonitorPlay className="size-4 text-subtle" />
                  {d.name}
                </span>
                <ArrowUpRight className="size-3.5 text-subtle transition group-hover:text-ember" />
              </a>
            </li>
          ))}
        </ul>
      </Section>

      {made.length > 0 && (
        <Section className="border-t border-border bg-surface/30">
          <SectionHeader
            eyebrow="Made with teich"
            title="Datasets we generated with it"
            description="Agent traces from DeepSeek, Ox Alpha, Claude Fable 5 and more, straight out of the same pipeline."
            action={
              <Button asChild variant="outline">
                <Link href="/datasets?teich=1">
                  All {made.length} <ArrowRight className="size-4" />
                </Link>
              </Button>
            }
          />
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {made.slice(0, 6).map((d) => (
              <DatasetCard key={d.id} dataset={d} newSince={snap.newSince} />
            ))}
          </div>
        </Section>
      )}
    </>
  );
}
