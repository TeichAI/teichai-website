import Link from "next/link";
import type { DatasetInfo, Release } from "@/lib/hf";
import { formatCompact } from "@/lib/format";

function Bar({ pct }: { pct: number }) {
  return (
    <div className="h-2 flex-1 overflow-hidden rounded-full bg-surface-3">
      <div className="h-full rounded-full bg-chart-1" style={{ width: `${Math.max(3, pct)}%` }} />
    </div>
  );
}

export function Leaderboard({ releases, datasets }: { releases: Release[]; datasets: DatasetInfo[] }) {
  const topModels = [...releases].sort((a, b) => b.downloadsAllTime - a.downloadsAllTime).slice(0, 8);
  const topDatasets = [...datasets].sort((a, b) => b.downloadsAllTime - a.downloadsAllTime).slice(0, 6);
  const maxM = Math.max(1, topModels[0]?.downloadsAllTime ?? 0);
  const maxD = Math.max(1, topDatasets[0]?.downloadsAllTime ?? 0);

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="rounded-2xl border border-border bg-surface p-5">
        <div className="mb-4 flex items-baseline justify-between">
          <h3 className="text-sm font-medium">Most downloaded models</h3>
          <span className="font-mono text-[11px] text-subtle">all time</span>
        </div>
        <ol className="space-y-2.5">
          {topModels.map((r, i) => (
            <li key={r.slug}>
              <Link
                href={`/models?open=${encodeURIComponent(r.slug)}`}
                className="group grid grid-cols-[1.5rem_minmax(0,1fr)_minmax(4rem,30%)_3.5rem] items-center gap-3 text-sm"
              >
                <span className="font-mono text-xs text-subtle">{String(i + 1).padStart(2, "0")}</span>
                <span className="truncate">
                  <span className="font-medium text-foreground group-hover:text-ember">{r.title}</span>
                  <span className="text-subtle"> · {r.teacher}</span>
                </span>
                <Bar pct={(r.downloadsAllTime / maxM) * 100} />
                <span className="text-right font-mono text-xs tabular text-muted-foreground">
                  {formatCompact(r.downloadsAllTime)}
                </span>
              </Link>
            </li>
          ))}
        </ol>
      </div>
      <div className="rounded-2xl border border-border bg-surface p-5">
        <div className="mb-4 flex items-baseline justify-between">
          <h3 className="text-sm font-medium">Most downloaded datasets</h3>
          <span className="font-mono text-[11px] text-subtle">all time</span>
        </div>
        <ol className="space-y-2.5">
          {topDatasets.map((d, i) => (
            <li key={d.id}>
              <Link
                href={`/datasets?open=${encodeURIComponent(d.name)}`}
                className="group grid grid-cols-[1.5rem_minmax(0,1fr)_minmax(4rem,30%)_3.5rem] items-center gap-3 text-sm"
              >
                <span className="font-mono text-xs text-subtle">{String(i + 1).padStart(2, "0")}</span>
                <span className="truncate">
                  <span className="font-medium text-foreground group-hover:text-ember">{d.title}</span>
                </span>
                <Bar pct={(d.downloadsAllTime / maxD) * 100} />
                <span className="text-right font-mono text-xs tabular text-muted-foreground">
                  {formatCompact(d.downloadsAllTime)}
                </span>
              </Link>
            </li>
          ))}
        </ol>
        <p className="mt-5 text-xs text-subtle">
          Likes and 30-day trends are in the catalog. Sort by &ldquo;Trending&rdquo; to see what people are pulling this week.
        </p>
      </div>
    </div>
  );
}
