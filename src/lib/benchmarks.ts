// Benchmark data parsed from benchmark_results/
// Base model: unsloth/Qwen3-4B-Thinking-2507

export interface BenchmarkResult {
  model: string;
  shortName: string;
  sourceModel: string;
  arc_challenge: number;
  gpqa_diamond: number;
  hellaswag: number;
  mmlu: number;
  truthfulqa: number;
  winogrande: number;
  average: number;
}

// Base model scores for comparison
export const baseModel: BenchmarkResult = {
  model: "unsloth/Qwen3-4B-Thinking-2507",
  shortName: "Qwen3 4B Base",
  sourceModel: "Base Model",
  arc_challenge: 48.63,
  gpqa_diamond: 30.30,
  hellaswag: 47.98,
  mmlu: 65.53,
  truthfulqa: 55.57,
  winogrande: 64.56,
  average: 52.10,
};

// Distilled model benchmark results
export const benchmarkResults: BenchmarkResult[] = [
  {
    model: "TeichAI/Qwen3-4B-Thinking-2507-Gemini-2.5-Flash-Distill",
    shortName: "Gemini 2.5 Flash",
    sourceModel: "Gemini 2.5 Flash",
    arc_challenge: 51.19,
    gpqa_diamond: 35.35,
    hellaswag: 50.44,
    mmlu: 66.16,
    truthfulqa: 55.29,
    winogrande: 65.59,
    average: 54.00,
  },
  {
    model: "TeichAI/Qwen3-4B-Thinking-2507-Claude-4.5-Opus-High-Reasoning-Distill",
    shortName: "Claude 4.5 Opus",
    sourceModel: "Claude Opus 4.5",
    arc_challenge: 48.12,
    gpqa_diamond: 31.31,
    hellaswag: 49.58,
    mmlu: 63.37,
    truthfulqa: 52.61,
    winogrande: 62.12,
    average: 51.19,
  },
  {
    model: "Liontix/Qwen3-4B-Thinking-2507-Gemini-2.5-Pro-Distill",
    shortName: "Gemini 2.5 Pro",
    sourceModel: "Gemini 2.5 Pro",
    arc_challenge: 48.55,
    gpqa_diamond: 30.81,
    hellaswag: 48.49,
    mmlu: 64.35,
    truthfulqa: 54.38,
    winogrande: 61.17,
    average: 51.29,
  },
  {
    model: "TeichAI/Qwen3-4B-Thinking-2507-GPT-5-Codex-Distill",
    shortName: "GPT-5 Codex",
    sourceModel: "GPT-5 Codex",
    arc_challenge: 45.90,
    gpqa_diamond: 43.94,
    hellaswag: 47.69,
    mmlu: 62.51,
    truthfulqa: 57.04,
    winogrande: 61.25,
    average: 53.06,
  },
  {
    model: "TeichAI/Qwen3-4B-Thinking-2507-Kimi-K2-Thinking-Distill",
    shortName: "Kimi K2",
    sourceModel: "Kimi K2 Thinking",
    arc_challenge: 45.82,
    gpqa_diamond: 37.37,
    hellaswag: 49.21,
    mmlu: 62.04,
    truthfulqa: 52.48,
    winogrande: 62.67,
    average: 51.60,
  },
  {
    model: "TeichAI/Qwen3-4B-Thinking-2507-GLM-4.6-Distill",
    shortName: "GLM 4.6",
    sourceModel: "GLM 4.6",
    arc_challenge: 48.72,
    gpqa_diamond: 32.32,
    hellaswag: 48.33,
    mmlu: 64.26,
    truthfulqa: 53.09,
    winogrande: 62.19,
    average: 51.49,
  },
  {
    model: "TeichAI/Qwen3-4B-Thinking-2507-GPT-5.1-High-Reasoning-Distill",
    shortName: "GPT-5.1",
    sourceModel: "GPT-5.1",
    arc_challenge: 47.78,
    gpqa_diamond: 29.80,
    hellaswag: 48.02,
    mmlu: 63.64,
    truthfulqa: 55.71,
    winogrande: 58.64,
    average: 50.60,
  },
  {
    model: "TeichAI/Qwen3-4B-Thinking-2507-Command-A-Reasoning-Distill",
    shortName: "Command A",
    sourceModel: "Command A",
    arc_challenge: 45.82,
    gpqa_diamond: 31.82,
    hellaswag: 48.82,
    mmlu: 63.45,
    truthfulqa: 54.89,
    winogrande: 62.19,
    average: 51.17,
  },
  {
    model: "TeichAI/Qwen3-4B-Thinking-2507-Gemini-3-Pro-Preview-High-Reasoning-Distill",
    shortName: "Gemini 3 Pro",
    sourceModel: "Gemini 3 Pro Preview",
    arc_challenge: 46.50,
    gpqa_diamond: 34.85,
    hellaswag: 48.20,
    mmlu: 62.41,
    truthfulqa: 50.47,
    winogrande: 62.27,
    average: 50.78,
  },
];

// Benchmark descriptions
export const benchmarkInfo: Record<string, { name: string; description: string }> = {
  arc_challenge: {
    name: "ARC Challenge",
    description: "Science questions requiring reasoning and world knowledge",
  },
  gpqa_diamond: {
    name: "GPQA Diamond",
    description: "Graduate-level science questions (physics, chemistry, biology)",
  },
  hellaswag: {
    name: "HellaSwag",
    description: "Commonsense reasoning about everyday situations",
  },
  mmlu: {
    name: "MMLU",
    description: "Massive Multitask Language Understanding across 57 subjects",
  },
  truthfulqa: {
    name: "TruthfulQA",
    description: "Measuring truthfulness and avoiding common misconceptions",
  },
  winogrande: {
    name: "WinoGrande",
    description: "Commonsense reasoning with pronoun resolution",
  },
};

// Calculate delta from base model
export function getDelta(value: number, baseValue: number): number {
  return Math.round((value - baseValue) * 100) / 100;
}

// Get sorted results by a specific benchmark
export function getSortedByBenchmark(
  benchmark: keyof Omit<BenchmarkResult, "model" | "shortName" | "sourceModel">
): BenchmarkResult[] {
  return [...benchmarkResults].sort((a, b) => b[benchmark] - a[benchmark]);
}

// Get top performer for each benchmark
export function getTopPerformers(): Record<string, BenchmarkResult> {
  const benchmarks = ["arc_challenge", "gpqa_diamond", "hellaswag", "mmlu", "truthfulqa", "winogrande"] as const;
  const result: Record<string, BenchmarkResult> = {};

  for (const benchmark of benchmarks) {
    result[benchmark] = benchmarkResults.reduce((best, current) =>
      current[benchmark] > best[benchmark] ? current : best
    );
  }

  return result;
}
