"use client";

import { useState, useMemo } from "react";
import { ExternalLink, Download, Heart, ArrowUpDown } from "lucide-react";
import { formatDownloads, parseDatasetName } from "@/lib/huggingface";

interface HFDataset {
  id: string;
  downloads: number;
  likes: number;
  tags: string[];
  createdAt: string;
}

type SortOption = "downloads" | "likes" | "name" | "recent";

interface DatasetsClientProps {
  datasets: HFDataset[];
}

export function DatasetsClient({ datasets }: DatasetsClientProps) {
  const [sortBy, setSortBy] = useState<SortOption>("downloads");
  const [filterSource, setFilterSource] = useState<string>("all");

  // Get unique source models for filter
  const sourceModels = useMemo(() => {
    const sources = new Set<string>();
    datasets.forEach((dataset) => {
      const parsed = parseDatasetName(dataset.id);
      if (parsed.sourceModel !== "Unknown") {
        sources.add(parsed.sourceModel);
      }
    });
    return Array.from(sources).sort();
  }, [datasets]);

  // Filter and sort datasets
  const filteredDatasets = useMemo(() => {
    let result = [...datasets];

    // Filter by source model
    if (filterSource !== "all") {
      result = result.filter((dataset) => {
        const parsed = parseDatasetName(dataset.id);
        return parsed.sourceModel === filterSource;
      });
    }

    // Sort
    switch (sortBy) {
      case "downloads":
        result.sort((a, b) => b.downloads - a.downloads);
        break;
      case "likes":
        result.sort((a, b) => b.likes - a.likes);
        break;
      case "name":
        result.sort((a, b) => a.id.localeCompare(b.id));
        break;
      case "recent":
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
    }

    return result;
  }, [datasets, sortBy, filterSource]);

  return (
    <div>
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <div className="flex items-center gap-2">
          <ArrowUpDown className="w-4 h-4 text-[var(--muted-foreground)]" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="bg-[var(--card)] border border-[var(--border)] rounded px-3 py-1.5 text-sm text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
          >
            <option value="downloads">Most Downloads</option>
            <option value="likes">Most Likes</option>
            <option value="recent">Newest First</option>
            <option value="name">Name (A-Z)</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-[var(--muted-foreground)]">Source:</span>
          <select
            value={filterSource}
            onChange={(e) => setFilterSource(e.target.value)}
            className="bg-[var(--card)] border border-[var(--border)] rounded px-3 py-1.5 text-sm text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
          >
            <option value="all">All Sources</option>
            {sourceModels.map((source) => (
              <option key={source} value={source}>
                {source}
              </option>
            ))}
          </select>
        </div>

        <span className="text-sm text-[var(--muted-foreground)]">
          {filteredDatasets.length} dataset{filteredDatasets.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Dataset Grid */}
      <div className="grid md:grid-cols-2 gap-4">
        {filteredDatasets.map((dataset) => {
          const parsed = parseDatasetName(dataset.id);

          return (
            <a
              key={dataset.id}
              href={`https://huggingface.co/datasets/${dataset.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-5 hover:border-[var(--accent)]/50 transition-colors block"
            >
              <div className="flex items-center gap-2 mb-2">
                <h2 className="font-medium text-[var(--foreground)] text-sm">{parsed.name}</h2>
                <ExternalLink className="w-3 h-3 text-[var(--muted-foreground)]" />
              </div>

              <div className="flex flex-wrap gap-2 mb-3">
                {parsed.sourceModel !== "Unknown" && (
                  <span className="text-xs bg-[var(--accent-light)] text-[var(--accent)] px-2 py-1 rounded">
                    {parsed.sourceModel}
                  </span>
                )}
                {dataset.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="text-xs bg-[var(--muted)] text-[var(--muted-foreground)] px-2 py-1 rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-4 text-xs text-[var(--muted-foreground)]">
                <span className="flex items-center gap-1">
                  <Download className="w-3 h-3" />
                  {formatDownloads(dataset.downloads)}
                </span>
                <span className="flex items-center gap-1">
                  <Heart className="w-3 h-3" />
                  {dataset.likes}
                </span>
              </div>
            </a>
          );
        })}
      </div>

      {filteredDatasets.length === 0 && (
        <div className="text-center py-12 text-[var(--muted-foreground)]">
          No datasets found matching your filters.
        </div>
      )}
    </div>
  );
}
