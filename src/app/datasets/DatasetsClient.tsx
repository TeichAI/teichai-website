"use client";

import { useState, useMemo } from "react";
import {
  AudioLines,
  BarChart3,
  Download,
  ExternalLink,
  FileJson,
  Heart,
  Image as ImageIcon,
  ArrowUpDown,
  Type,
  Video,
} from "lucide-react";
import { formatDownloads, parseDatasetName } from "@/lib/huggingface";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

function getTagValue(tags: string[], key: string): string | null {
  const needle = `${key.toLowerCase()}:`;
  const match = tags.find((tag) => tag.trim().toLowerCase().startsWith(needle));
  if (!match) return null;
  const value = match.slice(match.indexOf(":") + 1).trim();
  return value || null;
}

function formatSizeLabel(value: string) {
  const v = value.replace(/\s+/g, "").replace(/k/g, "K").replace(/m/g, "M");

  const lt = v.match(/^n<(.+)$/i);
  if (lt) return `<${lt[1]}`;

  const gt = v.match(/^n>(.+)$/i);
  if (gt) return `>${gt[1]}`;

  const range = v.match(/^(.+)<n<(.+)$/i);
  if (range) return `${range[1]}–${range[2]}`;

  const left = v.match(/^(.+)<n$/i);
  if (left) return `>${left[1]}`;

  const right = v.match(/^n<(.+)$/i);
  if (right) return `<${right[1]}`;

  return v;
}

function formatUpperLabel(value: string) {
  return value.trim().toUpperCase();
}

function modalityIcon(modality: string) {
  const value = modality.trim().toLowerCase();
  if (value.includes("image")) return ImageIcon;
  if (value.includes("audio")) return AudioLines;
  if (value.includes("video")) return Video;
  return Type;
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
            {filteredDatasets.length} dataset{filteredDatasets.length !== 1 ? "s" : ""}
          </span>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        {filteredDatasets.map((dataset) => {
          const parsed = parseDatasetName(dataset.id);
          const size = getTagValue(dataset.tags, "size_categories");
          const format = getTagValue(dataset.tags, "format");
          const modality = getTagValue(dataset.tags, "modality");

          return (
            <a
              key={dataset.id}
              href={`https://huggingface.co/datasets/${dataset.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              <Card className="relative h-full overflow-hidden border border-border/60 bg-gradient-to-br from-[var(--muted)]/40 to-[var(--muted)]/20 transition-all hover:-translate-y-0.5 hover:border-primary/60 hover:shadow-[0_18px_60px_rgba(0,0,0,0.7)]">
                <div className="absolute inset-y-0 left-0 w-1.5 bg-[var(--accent)]" />
                <CardContent className="flex h-full flex-col gap-3 p-5 md:p-6">
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1">
                      <h2 className="text-sm font-semibold text-foreground md:text-base">
                        {parsed.name}
                      </h2>
                      {parsed.sourceModel !== "Unknown" && (
                        <p className="text-xs text-muted-foreground">
                          Distilled from <span className="text-primary">{parsed.sourceModel}</span>
                        </p>
                      )}
                    </div>
                    <ExternalLink className="mt-1 size-3.5 shrink-0 text-muted-foreground" />
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {size && (
                      <span
                        title={`size_categories:${size}`}
                        className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-[var(--muted)]/50 px-3 py-1 text-xs text-foreground/90 shadow-sm"
                      >
                        <BarChart3 className="size-3.5 text-muted-foreground" />
                        <span className="text-[10px] font-semibold tracking-widest text-muted-foreground">
                          SIZE
                        </span>
                        <span className="font-medium tracking-wide">{formatSizeLabel(size)}</span>
                      </span>
                    )}
                    {format && (
                      <span
                        title={`format:${format}`}
                        className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-[var(--muted)]/50 px-3 py-1 text-xs text-foreground/90 shadow-sm"
                      >
                        <FileJson className="size-3.5 text-muted-foreground" />
                        <span className="font-medium tracking-wide">{formatUpperLabel(format)}</span>
                      </span>
                    )}
                    {modality && (
                      <span
                        title={`modality:${modality}`}
                        className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-[var(--muted)]/50 px-3 py-1 text-xs text-foreground/90 shadow-sm"
                      >
                        {(() => {
                          const Icon = modalityIcon(modality);
                          return <Icon className="size-3.5 text-muted-foreground" />;
                        })()}
                        <span className="font-medium tracking-wide">{formatUpperLabel(modality)}</span>
                      </span>
                    )}
                  </div>

                  <div className="mt-auto flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Download className="size-3" />
                      {formatDownloads(dataset.downloads)} downloads
                    </span>
                    <span className="flex items-center gap-1">
                      <Heart className="size-3" />
                      {dataset.likes} likes
                    </span>
                  </div>
                </CardContent>
              </Card>
            </a>
          );
        })}
      </div>

      {filteredDatasets.length === 0 && (
        <div className="py-12 text-center text-muted-foreground">
          No datasets found matching your filters.
        </div>
      )}
    </div>
  );
}
