import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { benchmarkResults, baseModel, benchmarkInfo, getTopPerformers } from "@/lib/benchmarks";
import { BenchmarksClient } from "./BenchmarksClient";

export const metadata = {
  title: "Benchmarks - TeichAI",
  description: "Compare our distilled models against base models with detailed benchmark analysis.",
};

export default function BenchmarksPage() {
  const topPerformers = getTopPerformers();

  // Calculate overall best model
  const sortedByAverage = [...benchmarkResults].sort((a, b) => b.average - a.average);
  const bestOverall = sortedByAverage[0];

  // Find models that beat base on most benchmarks
  const benchmarks = ["arc_challenge", "gpqa_diamond", "hellaswag", "mmlu", "truthfulqa", "winogrande"] as const;
  const modelWins = benchmarkResults.map(model => ({
    model,
    wins: benchmarks.filter(b => model[b] > baseModel[b]).length,
    totalDelta: benchmarks.reduce((sum, b) => sum + (model[b] - baseModel[b]), 0),
  }));
  const mostWins = modelWins.sort((a, b) => b.wins - a.wins || b.totalDelta - a.totalDelta)[0];

  return (
    <main className="min-h-screen bg-[var(--background)]">
      <Navbar />

      <section className="pt-24 pb-8 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-[var(--foreground)] mb-3">Benchmarks</h1>
          <p className="text-[var(--muted-foreground)] max-w-2xl">
            Comprehensive benchmark analysis comparing our distilled Qwen3-4B models against the base model.
            All tests run with 4-bit quantization using lm-eval harness.
          </p>
        </div>
      </section>

      {/* Key Insights */}
      <section className="pb-8 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-xl font-semibold text-[var(--foreground)] mb-4">Key Insights</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-5">
              <div className="text-xs text-green-600 dark:text-green-400 font-medium mb-2">HIGHEST AVERAGE</div>
              <h3 className="font-medium text-[var(--foreground)] mb-1">{bestOverall.shortName}</h3>
              <p className="text-[var(--muted-foreground)] text-sm">
                {bestOverall.average.toFixed(1)}% average across all benchmarks
                <span className="text-green-600 dark:text-green-400 ml-1">
                  (+{(bestOverall.average - baseModel.average).toFixed(1)} vs base)
                </span>
              </p>
            </div>
            <div className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-5">
              <div className="text-xs text-amber-600 dark:text-amber-400 font-medium mb-2">MOST CONSISTENT</div>
              <h3 className="font-medium text-[var(--foreground)] mb-1">{mostWins.model.shortName}</h3>
              <p className="text-[var(--muted-foreground)] text-sm">
                Beats base model on {mostWins.wins}/6 benchmarks
                <span className="text-amber-600 dark:text-amber-400 ml-1">
                  ({mostWins.totalDelta > 0 ? "+" : ""}{mostWins.totalDelta.toFixed(1)} total)
                </span>
              </p>
            </div>
            <div className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-5">
              <div className="text-xs text-blue-600 dark:text-blue-400 font-medium mb-2">BEST GPQA</div>
              <h3 className="font-medium text-[var(--foreground)] mb-1">{topPerformers.gpqa_diamond.shortName}</h3>
              <p className="text-[var(--muted-foreground)] text-sm">
                {topPerformers.gpqa_diamond.gpqa_diamond.toFixed(1)}% on graduate-level science
                <span className="text-blue-600 dark:text-blue-400 ml-1">
                  (+{(topPerformers.gpqa_diamond.gpqa_diamond - baseModel.gpqa_diamond).toFixed(1)} vs base)
                </span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Charts */}
      <BenchmarksClient
        benchmarkResults={benchmarkResults}
        baseModel={baseModel}
        benchmarkInfo={benchmarkInfo}
      />

      {/* Detailed Comparison Table */}
      <section className="py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-xl font-semibold text-[var(--foreground)] mb-4">Full Results</h2>
          <p className="text-[var(--muted-foreground)] text-sm mb-4">
            All scores shown as accuracy percentages. Green indicates improvement over base model, red indicates regression.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--border)]">
                  <th className="text-left py-3 px-3 text-[var(--muted-foreground)] font-medium">Model</th>
                  <th className="text-center py-3 px-2 text-[var(--muted-foreground)] font-medium">ARC</th>
                  <th className="text-center py-3 px-2 text-[var(--muted-foreground)] font-medium">GPQA</th>
                  <th className="text-center py-3 px-2 text-[var(--muted-foreground)] font-medium">HellaSwag</th>
                  <th className="text-center py-3 px-2 text-[var(--muted-foreground)] font-medium">MMLU</th>
                  <th className="text-center py-3 px-2 text-[var(--muted-foreground)] font-medium">TruthfulQA</th>
                  <th className="text-center py-3 px-2 text-[var(--muted-foreground)] font-medium">WinoGrande</th>
                  <th className="text-center py-3 px-2 text-[var(--muted-foreground)] font-medium">Avg</th>
                </tr>
              </thead>
              <tbody>
                {/* Base model row */}
                <tr className="border-b border-[var(--border)] bg-[var(--muted)]/30">
                  <td className="py-3 px-3 text-[var(--foreground)] font-medium">Base (Qwen3-4B)</td>
                  <td className="py-3 px-2 text-center text-[var(--muted-foreground)]">{baseModel.arc_challenge.toFixed(1)}</td>
                  <td className="py-3 px-2 text-center text-[var(--muted-foreground)]">{baseModel.gpqa_diamond.toFixed(1)}</td>
                  <td className="py-3 px-2 text-center text-[var(--muted-foreground)]">{baseModel.hellaswag.toFixed(1)}</td>
                  <td className="py-3 px-2 text-center text-[var(--muted-foreground)]">{baseModel.mmlu.toFixed(1)}</td>
                  <td className="py-3 px-2 text-center text-[var(--muted-foreground)]">{baseModel.truthfulqa.toFixed(1)}</td>
                  <td className="py-3 px-2 text-center text-[var(--muted-foreground)]">{baseModel.winogrande.toFixed(1)}</td>
                  <td className="py-3 px-2 text-center text-[var(--muted-foreground)] font-medium">{baseModel.average.toFixed(1)}</td>
                </tr>
                {/* Distilled models */}
                {benchmarkResults.map((result) => (
                  <tr key={result.model} className="border-b border-[var(--border)]/50 hover:bg-[var(--muted)]/30">
                    <td className="py-3 px-3 text-[var(--foreground)]">{result.shortName}</td>
                    <ScoreCell value={result.arc_challenge} base={baseModel.arc_challenge} />
                    <ScoreCell value={result.gpqa_diamond} base={baseModel.gpqa_diamond} />
                    <ScoreCell value={result.hellaswag} base={baseModel.hellaswag} />
                    <ScoreCell value={result.mmlu} base={baseModel.mmlu} />
                    <ScoreCell value={result.truthfulqa} base={baseModel.truthfulqa} />
                    <ScoreCell value={result.winogrande} base={baseModel.winogrande} />
                    <ScoreCell value={result.average} base={baseModel.average} bold />
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Methodology */}
      <section className="py-8 pb-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-xl font-semibold text-[var(--foreground)] mb-4">Methodology</h2>
          <div className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-5">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium text-[var(--foreground)] mb-2">Test Configuration</h3>
                <ul className="text-[var(--muted-foreground)] text-sm space-y-1">
                  <li>• <strong>Quantization:</strong> 4-bit (matching typical deployment)</li>
                  <li>• <strong>Framework:</strong> lm-eval harness</li>
                  <li>• <strong>Temperature:</strong> 0.6</li>
                  <li>• <strong>Top-p:</strong> 0.95</li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium text-[var(--foreground)] mb-2">Benchmarks Used</h3>
                <ul className="text-[var(--muted-foreground)] text-sm space-y-1">
                  <li>• <strong>ARC-Challenge:</strong> Science reasoning</li>
                  <li>• <strong>GPQA Diamond:</strong> Graduate-level science</li>
                  <li>• <strong>HellaSwag:</strong> Commonsense reasoning</li>
                  <li>• <strong>MMLU:</strong> Multi-task language understanding</li>
                  <li>• <strong>TruthfulQA:</strong> Truthfulness evaluation</li>
                  <li>• <strong>WinoGrande:</strong> Pronoun resolution</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

// Helper component for score cells
function ScoreCell({ value, base, bold = false }: { value: number; base: number; bold?: boolean }) {
  const delta = value - base;
  const isPositive = delta >= 0;

  return (
    <td className={`py-3 px-2 text-center ${bold ? "font-medium" : ""}`}>
      <span className={isPositive ? "text-green-600 dark:text-green-400" : "text-red-500 dark:text-red-400"}>
        {value.toFixed(1)}
      </span>
    </td>
  );
}
