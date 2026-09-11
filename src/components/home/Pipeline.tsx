import { Flame, ListChecks, Package, Sparkles } from "lucide-react";
import type { ReactNode } from "react";

const steps: Array<{ icon: ReactNode; title: string; body: string; tag: string }> = [
  {
    icon: <ListChecks className="size-5" />,
    title: "Curate prompts",
    body: "Coding, math, science and open-ended tasks. For agent traces we point real repositories at the teacher and let it work.",
    tag: "prompts.jsonl",
  },
  {
    icon: <Sparkles className="size-5" />,
    title: "Generate traces",
    body: "Frontier models answer with maximum reasoning effort. Thinking, tool calls and results are captured with teich and published as a dataset.",
    tag: "teich generate",
  },
  {
    icon: <Flame className="size-5" />,
    title: "Fine-tune an open base",
    body: "Qwen, Gemma, GLM, gpt-oss and friends are trained with Unsloth. Response-only masking keeps the loss on what the teacher actually said.",
    tag: "mask_data()",
  },
  {
    icon: <Package className="size-5" />,
    title: "Quantize and ship",
    body: "Safetensors plus imatrix GGUF from Q2 to Q8, vision projectors when the base sees images, and an Ollama Modelfile. Apache-2.0.",
    tag: "llama-server -hf",
  },
];

export function Pipeline() {
  return (
    <ol className="relative grid gap-4 md:grid-cols-4 md:before:pointer-events-none md:before:absolute md:before:left-0 md:before:right-0 md:before:top-9 md:before:h-px md:before:bg-gradient-to-r md:before:from-transparent md:before:via-ember/50 md:before:to-transparent md:before:content-['']">
      {steps.map((s, i) => (
        <li key={s.title} className="relative rounded-2xl border border-border bg-surface p-5">
          <div className="flex items-center justify-between">
            <span className="inline-flex size-10 items-center justify-center rounded-xl bg-accent text-ember ring-1 ring-ember/30">
              {s.icon}
            </span>
            <span className="font-mono text-[11px] text-subtle">0{i + 1}</span>
          </div>
          <h3 className="mt-4 text-base font-semibold">{s.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
          <p className="mt-4 inline-block rounded-md bg-code px-2 py-1 font-mono text-[11px] text-code-foreground/80">{s.tag}</p>
        </li>
      ))}
    </ol>
  );
}
