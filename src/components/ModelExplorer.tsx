"use client";

import { useDeferredValue, useMemo } from "react";
import type { Release } from "@/lib/hf";
import {
  SIZE_BUCKETS,
  SIZE_BUCKET_IDS,
  VARIANT_LABELS,
  VENDORS,
  vendorShort,
  type SizeBucket,
  type VariantKind,
} from "@/lib/taxonomy";
import { vendorColor } from "@/lib/vendor-colors";
import { pickParam, useSearchString, useUpdateSearch } from "@/lib/use-url-state";
import { ReleaseCard } from "./ReleaseCard";
import { ModelDrawer } from "./ModelDrawer";
import {
  EmptyState,
  FilterChip,
  FilterGroup,
  FilterPanel,
  ResultsBar,
  SearchInput,
  SortSelect,
} from "./ui/explorer";

type SortKey = "newest" | "downloads" | "likes" | "trending" | "name";
type Feature = "vision" | "thinking";

const SORTS: Array<{ value: SortKey; label: string }> = [
  { value: "newest", label: "Newest first" },
  { value: "downloads", label: "Most downloaded" },
  { value: "likes", label: "Most liked" },
  { value: "trending", label: "Trending" },
  { value: "name", label: "Name A–Z" },
];
const SORT_KEYS = SORTS.map((s) => s.value);
const KIND_KEYS = Object.keys(VARIANT_LABELS) as VariantKind[];
const FEATURE_KEYS: Feature[] = ["vision", "thinking"];
const VENDOR_IDS = VENDORS.map((v) => v.id);

export function ModelExplorer({
  releases,
  datasetIds,
  newSince,
}: {
  releases: Release[];
  datasetIds: string[];
  newSince: string;
}) {
  // The URL is the single source of truth for filters and the open drawer,
  // so views are shareable and back/forward just work.
  const search = useSearchString();
  const update = useUpdateSearch();
  const params = useMemo(() => new URLSearchParams(search), [search]);

  const baseIds = useMemo(() => Array.from(new Set(releases.map((r) => r.base))), [releases]);
  const teacherIds = useMemo(() => Array.from(new Set(releases.map((r) => r.teacher))), [releases]);

  const q = params.get("q") ?? "";
  const vendor = pickParam(params, "vendor", VENDOR_IDS);
  const base = pickParam(params, "base", baseIds);
  const teacher = pickParam(params, "teacher", teacherIds);
  const kind = pickParam(params, "kind", KIND_KEYS);
  const size = pickParam(params, "size", SIZE_BUCKET_IDS as readonly SizeBucket[]);
  const feature = pickParam(params, "feature", FEATURE_KEYS);
  const sort = pickParam(params, "sort", SORT_KEYS) ?? "newest";
  const openSlug = params.get("open")?.toLowerCase() ?? null;
  const showFilters = params.get("filters") === "1";
  const dq = useDeferredValue(q.trim().toLowerCase());

  const knownDatasets = useMemo(() => new Set(datasetIds), [datasetIds]);

  const vendorCounts = useMemo(() => {
    const m = new Map<string, number>();
    for (const r of releases) m.set(r.vendor, (m.get(r.vendor) ?? 0) + 1);
    return m;
  }, [releases]);

  const baseCounts = useMemo(() => {
    const m = new Map<string, number>();
    for (const r of releases) m.set(r.base, (m.get(r.base) ?? 0) + 1);
    return Array.from(m.entries()).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
  }, [releases]);

  const filtered = useMemo(() => {
    let list = releases.filter((r) => {
      if (vendor && r.vendor !== vendor) return false;
      if (base && r.base !== base) return false;
      if (teacher && r.teacher !== teacher) return false;
      if (kind && !r.kinds.includes(kind)) return false;
      if (size && r.sizeBucket !== size) return false;
      if (feature === "vision" && !r.vision) return false;
      if (feature === "thinking" && !r.thinking) return false;
      if (dq) {
        const hay =
          `${r.name} ${r.title} ${r.teacher} ${r.vendorLabel} ${r.base} ${r.descriptors.join(" ")}`.toLowerCase();
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
      case "name":
        list = [...list].sort((a, b) => a.title.localeCompare(b.title) || a.teacher.localeCompare(b.teacher));
        break;
      default:
        list = [...list].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    }
    return list;
  }, [releases, vendor, base, teacher, kind, size, feature, dq, sort]);

  const activeCount = [vendor, base, teacher, kind, size, feature].filter(Boolean).length;
  const hasFilters = !!q || activeCount > 0;
  const clear = () =>
    update({ q: null, vendor: null, base: null, teacher: null, kind: null, size: null, feature: null });

  const open = openSlug ? (releases.find((r) => r.slug === openSlug) ?? null) : null;

  return (
    <div className="space-y-6">
      <h2 className="sr-only">Model releases</h2>
      <div className="flex flex-col gap-3 sm:flex-row">
        <SearchInput
          value={q}
          onChange={(v) => update({ q: v })}
          placeholder="Search by base, teacher, or repo name…"
          label="Search models"
        />
        <SortSelect value={sort} onChange={(v) => update({ sort: v === "newest" ? null : v })} options={SORTS} />
      </div>

      <FilterPanel open={showFilters} onToggle={() => update({ filters: showFilters ? null : "1" })} activeCount={activeCount}>
        {teacher && (
          <FilterGroup label="Teacher">
            <FilterChip active onClick={() => update({ teacher: null })}>
              {teacher} ×
            </FilterChip>
          </FilterGroup>
        )}
        <FilterGroup label="Teacher lab">
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
        <FilterGroup label="Base family">
          {baseCounts.map(([b, n]) => (
            <FilterChip key={b} active={base === b} onClick={() => update({ base: base === b ? null : b })} count={n}>
              {b}
            </FilterChip>
          ))}
        </FilterGroup>
        <div className="flex flex-col gap-3 lg:flex-row lg:gap-8">
          <FilterGroup label="Format">
            {KIND_KEYS.map((k) => (
              <FilterChip key={k} active={kind === k} onClick={() => update({ kind: kind === k ? null : k })}>
                {VARIANT_LABELS[k]}
              </FilterChip>
            ))}
          </FilterGroup>
          <FilterGroup label="Size">
            {SIZE_BUCKETS.map((b) => (
              <FilterChip key={b.id} active={size === b.id} onClick={() => update({ size: size === b.id ? null : b.id })}>
                {b.label}
              </FilterChip>
            ))}
          </FilterGroup>
          <FilterGroup label="Features">
            <FilterChip
              active={feature === "vision"}
              onClick={() => update({ feature: feature === "vision" ? null : "vision" })}
            >
              Vision
            </FilterChip>
            <FilterChip
              active={feature === "thinking"}
              onClick={() => update({ feature: feature === "thinking" ? null : "thinking" })}
            >
              Thinking
            </FilterChip>
          </FilterGroup>
        </div>
      </FilterPanel>

      <ResultsBar count={filtered.length} total={releases.length} noun="releases" hasFilters={hasFilters} onClear={clear} />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filtered.length === 0 ? (
          <EmptyState onClear={clear} noun="models" />
        ) : (
          filtered.map((r) => (
            <ReleaseCard key={r.slug} release={r} newSince={newSince} onOpen={(slug) => update({ open: slug })} />
          ))
        )}
      </div>

      <ModelDrawer release={open} onClose={() => update({ open: null })} knownDatasets={knownDatasets} />
    </div>
  );
}
