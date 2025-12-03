"use client";

import { useState } from "react";
import { BenchmarkResult } from "@/lib/benchmarks";

interface BenchmarksClientProps {
  benchmarkResults: BenchmarkResult[];
  baseModel: BenchmarkResult;
  benchmarkInfo: Record<string, { name: string; description: string }>;
}

type BenchmarkKey = "arc_challenge" | "gpqa_diamond" | "hellaswag" | "mmlu" | "truthfulqa" | "winogrande" | "average";

export function BenchmarksClient({ benchmarkResults, baseModel, benchmarkInfo }: BenchmarksClientProps) {
  const [selectedBenchmark, setSelectedBenchmark] = useState<BenchmarkKey>("average");
  const [selectedModel, setSelectedModel] = useState<string | null>(null);

  const benchmarks: BenchmarkKey[] = ["average", "arc_challenge", "gpqa_diamond", "hellaswag", "mmlu", "truthfulqa", "winogrande"];

  // Sort results by selected benchmark
  const sortedResults = [...benchmarkResults].sort((a, b) => b[selectedBenchmark] - a[selectedBenchmark]);

  // Find max value for chart scaling
  const maxValue = Math.max(
    ...benchmarkResults.map(r => r[selectedBenchmark]),
    baseModel[selectedBenchmark]
  );

  const getBenchmarkLabel = (key: BenchmarkKey) => {
    if (key === "average") return "Average";
    return benchmarkInfo[key]?.name || key;
  };

  return (
    <section className="py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <h2 className="text-xl font-semibold text-[var(--foreground)]">Performance Comparison</h2>

          {/* Benchmark selector */}
          <div className="flex flex-wrap gap-2">
            {benchmarks.map((benchmark) => (
              <button
                key={benchmark}
                onClick={() => setSelectedBenchmark(benchmark)}
                className={`px-3 py-1.5 text-xs rounded transition-colors ${
                  selectedBenchmark === benchmark
                    ? "bg-amber-600 text-white"
                    : "bg-[var(--muted)] text-[var(--muted-foreground)] hover:bg-[var(--border)]"
                }`}
              >
                {getBenchmarkLabel(benchmark)}
              </button>
            ))}
          </div>
        </div>

        {/* Chart description */}
        <p className="text-[var(--muted-foreground)] text-sm mb-4">
          {selectedBenchmark === "average"
            ? "Average accuracy across all 6 benchmarks. Higher is better."
            : benchmarkInfo[selectedBenchmark]?.description || ""}
        </p>

        {/* Bar chart */}
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-5">
          <div className="space-y-3">
            {/* Base model bar */}
            <div
              className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => setSelectedModel(null)}
            >
              <div className="w-32 text-sm text-[var(--muted-foreground)] truncate font-medium">
                Base Model
              </div>
              <div className="flex-1 h-8 bg-[var(--muted)] rounded overflow-hidden relative">
                <div
                  className="h-full bg-zinc-500 dark:bg-zinc-600 transition-all duration-500"
                  style={{ width: `${(baseModel[selectedBenchmark] / maxValue) * 100}%` }}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-[var(--foreground)]">
                  {baseModel[selectedBenchmark].toFixed(1)}%
                </span>
              </div>
            </div>

            {/* Distilled model bars */}
            {sortedResults.map((result, index) => {
              const value = result[selectedBenchmark];
              const delta = value - baseModel[selectedBenchmark];
              const isPositive = delta >= 0;
              const isSelected = selectedModel === result.model;

              return (
                <div
                  key={result.model}
                  className={`flex items-center gap-3 cursor-pointer transition-opacity ${
                    selectedModel && !isSelected ? "opacity-40" : "hover:opacity-80"
                  }`}
                  onClick={() => setSelectedModel(isSelected ? null : result.model)}
                >
                  <div className="w-32 text-sm text-[var(--foreground)] truncate" title={result.shortName}>
                    <span className="text-[var(--muted-foreground)] mr-1">#{index + 1}</span>
                    {result.shortName}
                  </div>
                  <div className="flex-1 h-8 bg-[var(--muted)] rounded overflow-hidden relative">
                    <div
                      className={`h-full transition-all duration-500 ${
                        isPositive ? "bg-green-600 dark:bg-green-500" : "bg-red-500 dark:bg-red-400"
                      }`}
                      style={{ width: `${(value / maxValue) * 100}%` }}
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-[var(--foreground)]">
                      {value.toFixed(1)}%
                      <span className={`ml-2 text-xs ${isPositive ? "text-green-600 dark:text-green-400" : "text-red-500 dark:text-red-400"}`}>
                        ({isPositive ? "+" : ""}{delta.toFixed(1)})
                      </span>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected model details */}
        {selectedModel && (
          <div className="mt-6 bg-[var(--card)] border border-[var(--border)] rounded-lg p-5">
            <h3 className="font-medium text-[var(--foreground)] mb-4">
              {benchmarkResults.find(r => r.model === selectedModel)?.shortName} - All Benchmarks
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {(["arc_challenge", "gpqa_diamond", "hellaswag", "mmlu", "truthfulqa", "winogrande"] as const).map((benchmark) => {
                const result = benchmarkResults.find(r => r.model === selectedModel)!;
                const value = result[benchmark];
                const baseValue = baseModel[benchmark];
                const delta = value - baseValue;
                const isPositive = delta >= 0;

                return (
                  <div key={benchmark} className="text-center">
                    <div className="text-xs text-[var(--muted-foreground)] mb-1">
                      {benchmarkInfo[benchmark].name}
                    </div>
                    <div className={`text-lg font-medium ${isPositive ? "text-green-600 dark:text-green-400" : "text-red-500 dark:text-red-400"}`}>
                      {value.toFixed(1)}%
                    </div>
                    <div className={`text-xs ${isPositive ? "text-green-600 dark:text-green-400" : "text-red-500 dark:text-red-400"}`}>
                      {isPositive ? "+" : ""}{delta.toFixed(1)} vs base
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
