"use client";

import { useState } from "react";
import { BenchmarkResult } from "@/lib/benchmarks";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface BenchmarksClientProps {
  benchmarkResults: BenchmarkResult[];
  baseModel: BenchmarkResult;
  benchmarkInfo: Record<string, { name: string; description: string }>;
}

type BenchmarkKey = "arc_challenge" | "gpqa_diamond" | "hellaswag" | "mmlu" | "truthfulqa" | "winogrande" | "average";

export function BenchmarksClient({ benchmarkResults, baseModel, benchmarkInfo }: BenchmarksClientProps) {
  const [selectedBenchmark, setSelectedBenchmark] = useState<BenchmarkKey>("average");
  const [selectedModel, setSelectedModel] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);

  const benchmarks: BenchmarkKey[] = ["average", "arc_challenge", "gpqa_diamond", "hellaswag", "mmlu", "truthfulqa", "winogrande"];

  // Sort results by selected benchmark
  const sortedResults = [...benchmarkResults].sort((a, b) => b[selectedBenchmark] - a[selectedBenchmark]);
  const displayResults = showAll ? sortedResults : sortedResults.slice(0, 12);

  // Find max value for chart scaling
  const maxValue = Math.max(
    ...benchmarkResults.map(r => r[selectedBenchmark]),
    baseModel[selectedBenchmark]
  );
  const basePct = (baseModel[selectedBenchmark] / maxValue) * 100;

  const getBenchmarkLabel = (key: BenchmarkKey) => {
    if (key === "average") return "Average";
    return benchmarkInfo[key]?.name || key;
  };

  return (
    <section className="py-8">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-foreground">Performance Comparison</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Pick a benchmark to sort the chart. Click a model to pin it and view all scores.
            </p>
          </div>

          {/* Benchmark selector */}
          <div className="flex items-center gap-3">
            <div className="flex max-w-full gap-1 overflow-x-auto rounded-xl border border-border/60 bg-[var(--muted)]/20 p-1">
              {benchmarks.map((benchmark) => (
                <Button
                  key={benchmark}
                  onClick={() => setSelectedBenchmark(benchmark)}
                  size="sm"
                  variant={selectedBenchmark === benchmark ? "default" : "ghost"}
                  className="h-8 shrink-0 px-3 text-xs"
                >
                  {getBenchmarkLabel(benchmark)}
                </Button>
              ))}
            </div>

            <Button
              size="sm"
              variant="secondary"
              className="h-8 shrink-0 px-3 text-xs"
              onClick={() => setShowAll((v) => !v)}
            >
              {showAll ? "Top 12" : "Show all"}
            </Button>
          </div>
        </div>

        {/* Chart description */}
        <p className="mb-4 text-sm text-muted-foreground">
          {selectedBenchmark === "average"
            ? "Average accuracy across all 6 benchmarks. Higher is better."
            : benchmarkInfo[selectedBenchmark]?.description || ""}
        </p>

        {/* Bar chart */}
        <Card className="border border-border/60 bg-[var(--muted)]/20">
          <CardContent className="p-5">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground">
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-zinc-500" />
                  Base
                </span>
                <span className="inline-flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-green-500" />
                  Above base
                </span>
                <span className="inline-flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-red-500" />
                  Below base
                </span>
              </div>
              <span className="tabular-nums">
                Base: {baseModel[selectedBenchmark].toFixed(1)}%
              </span>
            </div>

            <div className="space-y-2">
              <div
                className="group flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-[var(--muted)]/30"
                onClick={() => setSelectedModel(null)}
              >
                <div className="w-32 text-sm text-muted-foreground truncate font-medium">Base Model</div>
                <div className="relative h-9 flex-1 overflow-hidden rounded-lg bg-muted/70">
                  <div
                    className="absolute inset-y-1 w-px bg-primary/30"
                    style={{ left: `${basePct}%` }}
                  />
                  <div
                    className="h-full bg-zinc-500/70 dark:bg-zinc-600/70 transition-all duration-500"
                    style={{ width: `${(baseModel[selectedBenchmark] / maxValue) * 100}%` }}
                  />
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md bg-background/40 px-2 py-1 text-xs font-medium text-foreground backdrop-blur">
                    {baseModel[selectedBenchmark].toFixed(1)}%
                  </div>
                </div>
              </div>

              {displayResults.map((result, index) => {
                const value = result[selectedBenchmark];
                const delta = value - baseModel[selectedBenchmark];
                const isPositive = delta >= 0;
                const isSelected = selectedModel === result.model;

                return (
                  <div
                    key={result.model}
                    className={`flex items-center gap-3 cursor-pointer rounded-lg p-2 transition-colors ${
                      selectedModel && !isSelected ? "opacity-40" : "hover:bg-[var(--muted)]/30"
                    } ${isSelected ? "bg-[var(--muted)]/30 ring-1 ring-primary/30" : ""}`}
                    onClick={() => setSelectedModel(isSelected ? null : result.model)}
                  >
                    <div className="w-32 text-sm text-foreground truncate" title={result.shortName}>
                      <span className="mr-1 text-muted-foreground tabular-nums">#{index + 1}</span>
                      {result.shortName}
                    </div>
                    <div className="relative h-9 flex-1 overflow-hidden rounded-lg bg-muted/70">
                      <div
                        className="absolute inset-y-1 w-px bg-primary/30"
                        style={{ left: `${basePct}%` }}
                      />
                      <div
                        className={`h-full transition-all duration-500 ${
                          isPositive
                            ? "bg-gradient-to-r from-green-600/70 to-green-500"
                            : "bg-gradient-to-r from-red-500/60 to-red-400"
                        }`}
                        style={{ width: `${(value / maxValue) * 100}%` }}
                      />
                      <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2 rounded-md bg-background/40 px-2 py-1 text-xs font-medium text-foreground backdrop-blur tabular-nums">
                        <span>{value.toFixed(1)}%</span>
                        <span className={isPositive ? "text-green-600 dark:text-green-400" : "text-red-500 dark:text-red-400"}>
                          {isPositive ? "+" : ""}
                          {delta.toFixed(1)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Selected model details */}
        {selectedModel && (
          <Card className="mt-6 border border-border/60 bg-[var(--muted)]/20">
            <CardContent className="p-5">
              <h3 className="mb-4 font-medium text-foreground">
              {benchmarkResults.find(r => r.model === selectedModel)?.shortName} - All Benchmarks
              </h3>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
                {(["arc_challenge", "gpqa_diamond", "hellaswag", "mmlu", "truthfulqa", "winogrande"] as const).map(
                  (benchmark) => {
                    const result = benchmarkResults.find(r => r.model === selectedModel)!;
                    const value = result[benchmark];
                    const baseValue = baseModel[benchmark];
                    const delta = value - baseValue;
                    const isPositive = delta >= 0;

                    return (
                      <div key={benchmark} className="text-center">
                        <div className="mb-1 text-xs text-muted-foreground">
                          {benchmarkInfo[benchmark].name}
                        </div>
                        <div
                          className={`text-lg font-medium ${
                            isPositive ? "text-green-600 dark:text-green-400" : "text-red-500 dark:text-red-400"
                          }`}
                        >
                          {value.toFixed(1)}%
                        </div>
                        <div
                          className={`text-xs ${
                            isPositive ? "text-green-600 dark:text-green-400" : "text-red-500 dark:text-red-400"
                          }`}
                        >
                          {isPositive ? "+" : ""}
                          {delta.toFixed(1)} vs base
                        </div>
                      </div>
                    );
                  },
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </section>
  );
}
