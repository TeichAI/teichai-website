"use client";

import { useDeferredValue, useMemo } from "react";
import type { DatasetInfo } from "@/lib/hf";
import { DATASET_KINDS, VENDORS, vendorShort, type DatasetKind } from "@/lib/taxonomy";
import { vendorColor } from "@/lib/vendor-colors";
import { pickParam, useSearchString, useUpdateSearch } from "@/lib/use-url-state";
import { DatasetCard, formatSizeCategory } from "./DatasetCard";
import { DatasetDrawer, type ReleaseRef } from "./DatasetDrawer";
import {
  EmptyState,
  FilterChip,
  FilterGroup,
  FilterPanel,
  ResultsBar,
  SearchInput,
  SortSelect,
} from "./ui/explorer";

type SortKey = "newest" | "downloads" | "likes" | "trending" | "samples" | "name";

const SORTS: Array<{ value: SortKey; label: string }> = [
  { value: "newest", label: "Newest first" },
  { value: "downloads", label: "Most downloaded" },
  { value: "likes", label: "Most liked" },
  { value: "trending", label: "Trending" },
  { value: "samples", label: "Largest" },
  { value: "name", label: "Name A–Z" },
];
const SORT_KEYS = SORTS.map((s) => s.value);
const KIND_KEYS = Object.keys(DATASET_KINDS) as DatasetKind[];
const VENDOR_IDS = VENDORS.map((v) => v.id);
const SIZE_ORDER = ["n<1K", "1K<n<10K", "10K<n<100K", "100K<n<1M", "1M<n<10M"];

export function DatasetExplorer({
  datasets,
  releases,
  newSince,
}: {
  datasets: DatasetInfo[];
  releases: ReleaseRef[];
  newSince: string;
}) {
  const search = useSearchString();
  const update = useUpdateSearch();
  const params = useMemo(() => new URLSearchParams(search), [search]);

  const sizes = useMemo(() => {
    const s = new Set(datasets.map((d) => d.sizeCategory).filter((x): x is string => !!x));
    return Array.from(s).sort((a, b) => SIZE_ORDER.indexOf(a) - SIZE_ORDER.indexOf(b));
  }, [datasets]);

  const q = params.get("q") ?? "";
  const vendor = pickParam(params, "vendor", VENDOR_IDS);
  const kind = pickParam(params, "kind", KIND_KEYS);
  const size = pickParam(params, "size", sizes);
  const teichOnly = params.get("teich") === "1";
  const sort = pickParam(params, "sort", SORT_KEYS) ?? "newest";
  const openName = params.get("open");
  const showFilters = params.get("filters") === "1";
  const dq = useDeferredValue(q.trim().toLowerCase());

  const vendorCounts = useMemo(() => {
    const m = new Map<string, number>();
    for (const d of datasets) m.set(d.vendor, (m.get(d.vendor) ?? 0) + 1);
    return m;
  }, [datasets]);

  const kindCounts = useMemo(() => {
    const m = new Map<DatasetKind, number>();
    for (const d of datasets) m.set(d.kind, (m.get(d.kind) ?? 0) + 1);
    return m;
  }, [datasets]);

  const filtered = useMemo(() => {
    let list = datasets.filter((d) => {
      if (vendor && d.vendor !== vendor) return false;
      if (kind && d.kind !== kind) return false;
      if (size && d.sizeCategory !== size) return false;
      if (teichOnly && !d.generatedWithTeich) return false;
      if (dq) {
        const hay =
          `${d.name} ${d.title} ${d.teacher ?? ""} ${d.vendorLabel} ${d.description} ${d.tags.join(" ")}`.toLowerCase();
        if (!hay.includes(dq)) return false;
      }
      return true;
    });
    switch (sort) {
      case "downloads":
        list = [...list].sort((a, b) => b.downloadsAllTime - a.downloadsAllTime);
        break;
      case "likes":
        list = [...list].sort((a, b) => b.likes - a.likes);
        break;
      case "trending":
        list = [...list].sort((a, b) => b.trendingScore - a.trendingScore || b.downloads - a.downloads);
        break;
      case "samples":
        list = [...list].sort((a, b) => (b.samples ?? 0) - (a.samples ?? 0));
        break;
      case "name":
        list = [...list].sort((a, b) => a.title.localeCompare(b.title));
        break;
      default:
        list = [...list].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    }
    return list;
  }, [datasets, vendor, kind, size, teichOnly, dq, sort]);

  const activeCount = [vendor, kind, size, teichOnly || null].filter(Boolean).length;
  const hasFilters = !!q || activeCount > 0;
  const clear = () => update({ q: null, vendor: null, kind: null, size: null, teich: null });

  const open = openName ? (datasets.find((d) => d.name.toLowerCase() === openName.toLowerCase()) ?? null) : null;

  return (
    <div className="space-y-6">
      <h2 className="sr-only">Datasets</h2>
      <div className="flex flex-col gap-3 sm:flex-row">
        <SearchInput
          value={q}
          onChange={(v) => update({ q: v })}
          placeholder="Search datasets by name, source model, or topic…"
          label="Search datasets"
        />
        <SortSelect value={sort} onChange={(v) => update({ sort: v === "newest" ? null : v })} options={SORTS} />
      </div>

      <FilterPanel open={showFilters} onToggle={() => update({ filters: showFilters ? null : "1" })} activeCount={activeCount}>
        <FilterGroup label="Source lab">
          {VENDORS.filter((v) => vendorCounts.has(v.id)).map((v) => (
            <FilterChip
              key={v.id}
              active={vendor === v.id}
              onClick={() => update({ vendor: vendor === v.id ? null : v.id })}
              count={vendorCounts.get(v.id)}
              dot={vendorColor(v.id)}
            >
              {vendorShort(v.id)}
            </FilterChip>
          ))}
        </FilterGroup>
        <FilterGroup label="Type">
          {KIND_KEYS.filter((k) => kindCounts.has(k)).map((k) => (
            <FilterChip
              key={k}
              active={kind === k}
              onClick={() => update({ kind: kind === k ? null : k })}
              count={kindCounts.get(k)}
            >
              {DATASET_KINDS[k]}
            </FilterChip>
          ))}
        </FilterGroup>
        <div className="flex flex-col gap-3 lg:flex-row lg:gap-8">
          <FilterGroup label="Rows">
            {sizes.map((s) => (
              <FilterChip key={s} active={size === s} onClick={() => update({ size: size === s ? null : s })}>
                {formatSizeCategory(s)}
              </FilterChip>
            ))}
          </FilterGroup>
          <FilterGroup label="Tooling">
            <FilterChip active={teichOnly} onClick={() => update({ teich: teichOnly ? null : "1" })}>
              Generated with teich
            </FilterChip>
          </FilterGroup>
        </div>
      </FilterPanel>

      <ResultsBar count={filtered.length} total={datasets.length} noun="datasets" hasFilters={hasFilters} onClear={clear} />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filtered.length === 0 ? (
          <EmptyState onClear={clear} noun="datasets" />
        ) : (
          filtered.map((d) => (
            <DatasetCard key={d.id} dataset={d} newSince={newSince} onOpen={(name) => update({ open: name })} />
          ))
        )}
      </div>

      <DatasetDrawer dataset={open} onClose={() => update({ open: null })} releases={releases} />
    </div>
  );
}
