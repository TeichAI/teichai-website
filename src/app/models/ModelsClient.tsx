"use client";

import { useState, useMemo } from "react";
import { ExternalLink, Download, Heart, ArrowUpDown } from "lucide-react";
import { formatDownloads, parseModelName } from "@/lib/huggingface";

interface HFModel {
  id: string;
  downloads: number;
  likes: number;
  tags: string[];
  createdAt: string;
}

type SortOption = "downloads" | "likes" | "name" | "recent";

interface ModelsClientProps {
  models: HFModel[];
}

export function ModelsClient({ models }: ModelsClientProps) {
  const [sortBy, setSortBy] = useState<SortOption>("downloads");
  const [filterSource, setFilterSource] = useState<string>("all");

  // Get unique source models for filter
  const sourceModels = useMemo(() => {
    const sources = new Set<string>();
    models.forEach((model) => {
      const parsed = parseModelName(model.id);
      if (parsed.sourceModel !== "Unknown") {
        sources.add(parsed.sourceModel);
      }
    });
    return Array.from(sources).sort();
  }, [models]);

  // Filter and sort models
  const filteredModels = useMemo(() => {
    let result = [...models];

    // Filter by source model
    if (filterSource !== "all") {
      result = result.filter((model) => {
        const parsed = parseModelName(model.id);
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
  }, [models, sortBy, filterSource]);

  return (
    <div>
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <div className="flex items-center gap-2">
          <ArrowUpDown className="w-4 h-4 text-[var(--muted-foreground)]" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="bg-[var(--card)] border border-[var(--border)] rounded px-3 py-1.5 text-sm text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-amber-500"
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
            className="bg-[var(--card)] border border-[var(--border)] rounded px-3 py-1.5 text-sm text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-amber-500"
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
          {filteredModels.length} model{filteredModels.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Model Grid */}
      <div className="grid gap-4">
        {filteredModels.map((model) => {
          const parsed = parseModelName(model.id);
          const isGGUF = model.id.includes("GGUF");

          return (
            <a
              key={model.id}
              href={`https://huggingface.co/${model.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-5 hover:border-amber-600/50 transition-colors block"
            >
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h2 className="font-medium text-[var(--foreground)]">
                      {model.id.split("/")[1]}
                    </h2>
                    <ExternalLink className="w-4 h-4 text-[var(--muted-foreground)]" />
                  </div>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {parsed.sourceModel !== "Unknown" && (
                      <span className="text-xs bg-amber-600/20 text-amber-600 dark:text-amber-500 px-2 py-1 rounded">
                        {parsed.sourceModel}
                      </span>
                    )}
                    {isGGUF && (
                      <span className="text-xs bg-[var(--muted)] text-[var(--muted-foreground)] px-2 py-1 rounded">
                        GGUF
                      </span>
                    )}
                    {parsed.params !== "Unknown" && (
                      <span className="text-xs bg-[var(--muted)] text-[var(--muted-foreground)] px-2 py-1 rounded">
                        {parsed.params}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-xs text-[var(--muted-foreground)]">
                    <span className="flex items-center gap-1">
                      <Download className="w-3 h-3" />
                      {formatDownloads(model.downloads)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Heart className="w-3 h-3" />
                      {model.likes}
                    </span>
                    <span>by {parsed.org}</span>
                  </div>
                </div>
              </div>
            </a>
          );
        })}
      </div>

      {filteredModels.length === 0 && (
        <div className="text-center py-12 text-[var(--muted-foreground)]">
          No models found matching your filters.
        </div>
      )}
    </div>
  );
}
