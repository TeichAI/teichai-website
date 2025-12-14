import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { benchmarkResults, baseModel, benchmarkInfo, getTopPerformers } from "@/lib/benchmarks";
import { BenchmarksClient } from "./BenchmarksClient";
import { Card, CardContent } from "@/components/ui/card";

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
    <main className="min-h-screen bg-background">
      <Navbar />

      <section className="relative overflow-hidden pt-24 pb-10">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(255,76,0,0.18),transparent_55%)]" />
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-primary/80">
            Evaluation
          </p>
          <h1 className="mb-4 text-3xl font-bold leading-tight tracking-tight text-foreground md:text-4xl">
            Benchmark results, clearly explained
          </h1>
          <p className="max-w-2xl text-sm text-muted-foreground md:text-base">
            Compare our distilled Qwen3-4B models against the base model across ARC, GPQA, HellaSwag,
            MMLU, TruthfulQA, and WinoGrande. All tests use 4-bit quantization via lm-eval harness.
          </p>
        </div>
      </section>

      {/* Key Insights */}
      <section className="pb-8">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="mb-4 text-xl font-semibold text-foreground">Key Insights</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <Card className="border border-border/60 bg-[var(--muted)]/20 transition-shadow hover:shadow-md">
              <CardContent className="p-5">
                <div className="mb-2 text-xs font-medium text-green-600 dark:text-green-400">HIGHEST AVERAGE</div>
                <h3 className="mb-1 font-medium text-foreground">{bestOverall.shortName}</h3>
                <p className="text-sm text-muted-foreground">
                  {bestOverall.average.toFixed(1)}% average across all benchmarks
                  <span className="ml-1 text-green-600 dark:text-green-400">
                    (+{(bestOverall.average - baseModel.average).toFixed(1)} vs base)
                  </span>
                </p>
              </CardContent>
            </Card>
            <Card className="border border-border/60 bg-[var(--muted)]/20 transition-shadow hover:shadow-md">
              <CardContent className="p-5">
                <div className="mb-2 text-xs font-medium text-primary">MOST CONSISTENT</div>
                <h3 className="mb-1 font-medium text-foreground">{mostWins.model.shortName}</h3>
                <p className="text-sm text-muted-foreground">
                  Beats base model on {mostWins.wins}/6 benchmarks
                  <span className="ml-1 text-primary">
                    ({mostWins.totalDelta > 0 ? "+" : ""}
                    {mostWins.totalDelta.toFixed(1)} total)
                  </span>
                </p>
              </CardContent>
            </Card>
            <Card className="border border-border/60 bg-[var(--muted)]/20 transition-shadow hover:shadow-md">
              <CardContent className="p-5">
                <div className="mb-2 text-xs font-medium text-blue-600 dark:text-blue-400">BEST GPQA</div>
                <h3 className="mb-1 font-medium text-foreground">{topPerformers.gpqa_diamond.shortName}</h3>
                <p className="text-sm text-muted-foreground">
                  {topPerformers.gpqa_diamond.gpqa_diamond.toFixed(1)}% on graduate-level science
                  <span className="ml-1 text-blue-600 dark:text-blue-400">
                    (+{(topPerformers.gpqa_diamond.gpqa_diamond - baseModel.gpqa_diamond).toFixed(1)} vs base)
                  </span>
                </p>
              </CardContent>
            </Card>
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
      <section className="py-8">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="mb-4 text-xl font-semibold text-foreground">Full Results</h2>
          <p className="mb-4 text-sm text-muted-foreground">
            All scores shown as accuracy percentages. Green indicates improvement over base model, red indicates regression.
          </p>
          <Card className="border border-border/60 bg-[var(--muted)]/20">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-[var(--muted)]/20">
                      <th className="px-3 py-3 text-left font-medium text-muted-foreground">Model</th>
                      <th className="px-2 py-3 text-center font-medium text-muted-foreground">ARC</th>
                      <th className="px-2 py-3 text-center font-medium text-muted-foreground">GPQA</th>
                      <th className="px-2 py-3 text-center font-medium text-muted-foreground">HellaSwag</th>
                      <th className="px-2 py-3 text-center font-medium text-muted-foreground">MMLU</th>
                      <th className="px-2 py-3 text-center font-medium text-muted-foreground">TruthfulQA</th>
                      <th className="px-2 py-3 text-center font-medium text-muted-foreground">WinoGrande</th>
                      <th className="px-2 py-3 text-center font-medium text-muted-foreground">Avg</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-border bg-muted/30">
                      <td className="px-3 py-3 font-medium text-foreground">Base (Qwen3-4B)</td>
                      <td className="px-2 py-3 text-center text-muted-foreground">{baseModel.arc_challenge.toFixed(1)}</td>
                      <td className="px-2 py-3 text-center text-muted-foreground">{baseModel.gpqa_diamond.toFixed(1)}</td>
                      <td className="px-2 py-3 text-center text-muted-foreground">{baseModel.hellaswag.toFixed(1)}</td>
                      <td className="px-2 py-3 text-center text-muted-foreground">{baseModel.mmlu.toFixed(1)}</td>
                      <td className="px-2 py-3 text-center text-muted-foreground">{baseModel.truthfulqa.toFixed(1)}</td>
                      <td className="px-2 py-3 text-center text-muted-foreground">{baseModel.winogrande.toFixed(1)}</td>
                      <td className="px-2 py-3 text-center font-medium text-muted-foreground">{baseModel.average.toFixed(1)}</td>
                    </tr>
                    {benchmarkResults.map((result) => (
                      <tr key={result.model} className="border-b border-border/50 hover:bg-muted/30">
                        <td className="px-3 py-3 text-foreground">{result.shortName}</td>
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
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Methodology */}
      <section className="py-8 pb-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="mb-4 text-xl font-semibold text-foreground">Methodology</h2>
          <Card>
            <CardContent className="p-5">
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <h3 className="mb-2 font-medium text-foreground">Test Configuration</h3>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• <strong>Quantization:</strong> 4-bit (matching typical deployment)</li>
                  <li>• <strong>Framework:</strong> lm-eval harness</li>
                  <li>• <strong>Temperature:</strong> 0.6</li>
                  <li>• <strong>Top-p:</strong> 0.95</li>
                  </ul>
                </div>
                <div>
                  <h3 className="mb-2 font-medium text-foreground">Benchmarks Used</h3>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• <strong>ARC-Challenge:</strong> Science reasoning</li>
                  <li>• <strong>GPQA Diamond:</strong> Graduate-level science</li>
                  <li>• <strong>HellaSwag:</strong> Commonsense reasoning</li>
                  <li>• <strong>MMLU:</strong> Multi-task language understanding</li>
                  <li>• <strong>TruthfulQA:</strong> Truthfulness evaluation</li>
                  <li>• <strong>WinoGrande:</strong> Pronoun resolution</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
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
    <td className={`px-2 py-3 text-center tabular-nums ${bold ? "font-medium" : ""}`}>
      <span className={isPositive ? "text-green-600 dark:text-green-400" : "text-red-500 dark:text-red-400"}>
        {value.toFixed(1)}
      </span>
      <span className="ml-1 text-[11px] text-muted-foreground">
        ({isPositive ? "+" : ""}
        {delta.toFixed(1)})
      </span>
    </td>
  );
}
