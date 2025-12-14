"use client";

import { useState, useMemo } from "react";
import { ExternalLink, Download, Heart, ArrowUpDown } from "lucide-react";
import { formatDownloads, parseModelName } from "@/lib/huggingface";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
    <div className="space-y-6">
      <Card className="border border-border/60 bg-[var(--muted)]/20">
        <CardContent className="flex flex-col gap-3 p-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <ArrowUpDown className="size-4 text-muted-foreground" />
            <Select value={sortBy} onValueChange={(value: SortOption) => setSortBy(value)}>
              <SelectTrigger className="w-44">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent align="start">
                <SelectItem value="downloads">Most Downloads</SelectItem>
                <SelectItem value="likes">Most Likes</SelectItem>
                <SelectItem value="recent">Newest First</SelectItem>
                <SelectItem value="name">Name (A-Z)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Source:</span>
            <Select
              value={filterSource}
              onValueChange={(value: string) => setFilterSource(value)}
            >
              <SelectTrigger className="w-44">
                <SelectValue placeholder="All Sources" />
              </SelectTrigger>
              <SelectContent align="start">
                <SelectItem value="all">All Sources</SelectItem>
                {sourceModels.map((source) => (
                  <SelectItem key={source} value={source}>
                    {source}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <span className="text-sm text-muted-foreground">
            {filteredModels.length} model{filteredModels.length !== 1 ? "s" : ""}
          </span>
        </CardContent>
      </Card>

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
              className="block"
            >
              <Card className="relative overflow-hidden border border-border/60 bg-[var(--muted)]/25 transition-all hover:-translate-y-0.5 hover:border-primary/50 hover:bg-[var(--muted)]/40 hover:shadow-[0_18px_60px_rgba(0,0,0,0.7)]">
                <div className="absolute inset-y-0 left-0 w-1 bg-[var(--accent)]" />
                <CardContent className="p-5 md:p-6">
                  <div className="flex flex-col gap-3">
                    <div className="flex items-start justify-between gap-2">
                      <h2 className="text-sm font-semibold text-foreground md:text-base">
                        {model.id.split("/")[1]}
                      </h2>
                      <ExternalLink className="mt-1 size-4 shrink-0 text-muted-foreground" />
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {parsed.sourceModel !== "Unknown" && (
                        <Badge
                          variant="secondary"
                          className="bg-accent text-primary hover:bg-accent"
                        >
                          {parsed.sourceModel}
                        </Badge>
                      )}
                      {isGGUF && (
                        <Badge variant="secondary" className="font-normal">
                          GGUF
                        </Badge>
                      )}
                      {parsed.params !== "Unknown" && (
                        <Badge variant="secondary" className="font-normal">
                          {parsed.params}
                        </Badge>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Download className="size-3" />
                        {formatDownloads(model.downloads)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Heart className="size-3" />
                        {model.likes}
                      </span>
                      <span>by {parsed.org}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </a>
          );
        })}
      </div>

      {filteredModels.length === 0 && (
        <div className="py-12 text-center text-muted-foreground">
          No models found matching your filters.
        </div>
      )}
    </div>
  );
}
