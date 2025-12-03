"use client";

import { BenchmarkResult, baseModel, benchmarkInfo } from "@/lib/benchmarks";

interface BenchmarkChartProps {
  results: BenchmarkResult[];
  benchmark: keyof typeof benchmarkInfo;
  showBase?: boolean;
}

export function BenchmarkChart({ results, benchmark, showBase = true }: BenchmarkChartProps) {
  const info = benchmarkInfo[benchmark];
  const baseValue = baseModel[benchmark as keyof BenchmarkResult] as number;

  // Sort by this benchmark
  const sorted = [...results].sort(
    (a, b) => (b[benchmark as keyof BenchmarkResult] as number) - (a[benchmark as keyof BenchmarkResult] as number)
  );

  // Find max for scaling
  const allValues = [...sorted.map(r => r[benchmark as keyof BenchmarkResult] as number), baseValue];
  const maxValue = Math.max(...allValues);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-[var(--foreground)]">{info.name}</h3>
        <span className="text-xs text-[var(--muted-foreground)]">{info.description}</span>
      </div>

      <div className="space-y-2">
        {showBase && (
          <div className="flex items-center gap-3">
            <div className="w-28 text-xs text-[var(--muted-foreground)] truncate">Base Model</div>
            <div className="flex-1 h-6 bg-[var(--muted)] rounded overflow-hidden relative">
              <div
                className="h-full bg-zinc-500 dark:bg-zinc-600 transition-all duration-500"
                style={{ width: `${(baseValue / maxValue) * 100}%` }}
              />
              <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-medium text-[var(--foreground)]">
                {baseValue.toFixed(1)}%
              </span>
            </div>
          </div>
        )}

        {sorted.slice(0, 5).map((result) => {
          const value = result[benchmark as keyof BenchmarkResult] as number;
          const delta = value - baseValue;
          const isPositive = delta > 0;

          return (
            <div key={result.model} className="flex items-center gap-3">
              <div className="w-28 text-xs text-[var(--foreground)] truncate" title={result.shortName}>
                {result.shortName}
              </div>
              <div className="flex-1 h-6 bg-[var(--muted)] rounded overflow-hidden relative">
                <div
                  className={`h-full transition-all duration-500 ${
                    isPositive ? "bg-green-600 dark:bg-green-500" : "bg-amber-600 dark:bg-amber-500"
                  }`}
                  style={{ width: `${(value / maxValue) * 100}%` }}
                />
                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-medium text-[var(--foreground)]">
                  {value.toFixed(1)}%
                  <span className={`ml-1 ${isPositive ? "text-green-600 dark:text-green-400" : "text-amber-600 dark:text-amber-400"}`}>
                    ({isPositive ? "+" : ""}{delta.toFixed(1)})
                  </span>
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

interface ComparisonBarProps {
  label: string;
  value: number;
  baseValue: number;
  maxValue: number;
  color?: string;
}

export function ComparisonBar({ label, value, baseValue, maxValue }: ComparisonBarProps) {
  const delta = value - baseValue;
  const isPositive = delta >= 0;

  return (
    <div className="flex items-center gap-2">
      <div className="w-20 text-xs text-[var(--muted-foreground)] truncate">{label}</div>
      <div className="flex-1 h-5 bg-[var(--muted)] rounded overflow-hidden relative">
        {/* Base line indicator */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-zinc-400 dark:bg-zinc-500 z-10"
          style={{ left: `${(baseValue / maxValue) * 100}%` }}
        />
        <div
          className={`h-full transition-all duration-300 ${
            isPositive ? "bg-green-500" : "bg-red-400"
          }`}
          style={{ width: `${(value / maxValue) * 100}%` }}
        />
        <span className="absolute right-1 top-1/2 -translate-y-1/2 text-[10px] font-medium text-[var(--foreground)]">
          {value.toFixed(1)}%
        </span>
      </div>
      <div className={`w-12 text-xs text-right ${isPositive ? "text-green-600 dark:text-green-400" : "text-red-500"}`}>
        {isPositive ? "+" : ""}{delta.toFixed(1)}
      </div>
    </div>
  );
}

interface ModelDetailChartProps {
  result: BenchmarkResult;
}

export function ModelDetailChart({ result }: ModelDetailChartProps) {
  const benchmarks = ["arc_challenge", "gpqa_diamond", "hellaswag", "mmlu", "truthfulqa", "winogrande"] as const;
  const maxValue = 80; // Fixed scale for consistency

  return (
    <div className="space-y-2">
      {benchmarks.map((benchmark) => {
        const value = result[benchmark];
        const baseValue = baseModel[benchmark];

        return (
          <ComparisonBar
            key={benchmark}
            label={benchmarkInfo[benchmark].name}
            value={value}
            baseValue={baseValue}
            maxValue={maxValue}
          />
        );
      })}
    </div>
  );
}
