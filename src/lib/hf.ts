// Hugging Face data layer. Fetches the TeichAI organization, normalizes it into
// lean, serializable shapes, and derives everything the UI shows: grouped
// releases, dataset metadata, org-wide stats, the release timeline and the
// base × teacher matrix. All fetches are cached for an hour.

import { cache } from "react";
import { site, team as teamConfig, type TeamMember } from "./site";
import { monthKey } from "./format";
import {
  detectDatasetKind,
  detectSampleCount,
  detectTeacher,
  detectVariant,
  parseModelName,
  quantFromFilename,
  releaseKey,
  releaseName,
  sizeBucket,
  sortQuants,
  vendorLabel,
  type DatasetKind,
  type SizeBucket,
  type VariantKind,
} from "./taxonomy";

const HF = "https://huggingface.co";
const REVALIDATE = 3600;

// ---------------------------------------------------------------------------
// Raw API shapes (only the fields we read)
// ---------------------------------------------------------------------------

interface RawCardData {
  base_model?: string | string[];
  license?: string | string[];
  datasets?: string | string[];
  tags?: string[];
  pretty_name?: string;
  task_categories?: string[];
  size_categories?: string[];
}

interface RawModel {
  id: string;
  likes?: number;
  downloads?: number;
  downloadsAllTime?: number;
  trendingScore?: number;
  createdAt?: string;
  lastModified?: string;
  pipeline_tag?: string;
  library_name?: string;
  tags?: string[];
  cardData?: RawCardData;
  safetensors?: { total?: number };
  gguf?: { total?: number; architecture?: string; context_length?: number };
  siblings?: { rfilename: string }[];
}

interface RawDataset {
  id: string;
  likes?: number;
  downloads?: number;
  downloadsAllTime?: number;
  trendingScore?: number;
  createdAt?: string;
  lastModified?: string;
  tags?: string[];
  description?: string;
  cardData?: RawCardData;
}

interface RawOrgOverview {
  numFollowers?: number;
  numModels?: number;
  numDatasets?: number;
  numUsers?: number;
}

interface RawMember {
  user: string;
  fullname?: string;
  avatarUrl?: string;
}

// ---------------------------------------------------------------------------
// Public shapes
// ---------------------------------------------------------------------------

export interface ModelVariant {
  id: string;
  name: string;
  kind: VariantKind;
  url: string;
  downloads: number;
  downloadsAllTime: number;
  likes: number;
  createdAt: string;
  lastModified: string;
  quants: string[];
  hasMmproj: boolean;
  hasModelfile: boolean;
}

export interface Release {
  slug: string;
  name: string;
  title: string;
  teacher: string;
  vendor: string;
  vendorLabel: string;
  base: string;
  size?: string;
  active?: string;
  flavor?: string;
  descriptors: string[];
  version?: string;
  experimental: boolean;
  baseModel?: string;
  params?: number;
  sizeBucket: SizeBucket | null;
  contextLength?: number;
  architecture?: string;
  license?: string;
  datasets: string[];
  vision: boolean;
  thinking: boolean;
  variants: ModelVariant[];
  kinds: VariantKind[];
  downloads: number;
  downloadsAllTime: number;
  likes: number;
  trendingScore: number;
  createdAt: string;
  lastModified: string;
}

export interface DatasetInfo {
  id: string;
  name: string;
  title: string;
  url: string;
  description: string;
  teacher?: string;
  vendor: string;
  vendorLabel: string;
  kind: DatasetKind;
  samples?: number;
  sizeCategory?: string;
  license?: string;
  formats: string[];
  taskCategories: string[];
  tags: string[];
  generatedWithTeich: boolean;
  downloads: number;
  downloadsAllTime: number;
  likes: number;
  trendingScore: number;
  createdAt: string;
  lastModified: string;
}

export interface OrgStats {
  repos: number;
  releases: number;
  datasets: number;
  downloadsAllTime: number;
  downloads30d: number;
  likes: number;
  followers: number;
  teachers: number;
  vendors: number;
  bases: number;
  ggufFiles: number;
  ggufReleases: number;
}

export interface TimelinePoint {
  month: string; // "2026-03"
  label: string; // "Mar 2026"
  models: number;
  datasets: number;
}

export interface MatrixCell {
  base: string;
  vendor: string;
  count: number;
  releases: { slug: string; title: string; teacher: string }[];
}

export interface Matrix {
  bases: string[];
  vendors: string[];
  cells: MatrixCell[];
  max: number;
}

export interface TeacherSummary {
  label: string;
  vendor: string;
  models: number;
  datasets: number;
}

export interface Snapshot {
  fetchedAt: string;
  // Releases/datasets created after this ISO timestamp count as "new".
  newSince: string;
  // True when a primary Hugging Face request failed; the data shown may be partial.
  degraded: boolean;
  releases: Release[];
  datasets: DatasetInfo[];
  stats: OrgStats;
  timeline: TimelinePoint[];
  matrix: Matrix;
  teachers: TeacherSummary[];
}

export interface TeamProfile extends TeamMember {
  avatarUrl?: string;
  url: string;
}

export interface TeichMeta {
  stars: number;
  forks: number;
  version: string;
  releases: number;
  summary: string;
  live: boolean;
}

// ---------------------------------------------------------------------------
// Fetch helpers
// ---------------------------------------------------------------------------

const FETCH_TIMEOUT_MS = 12_000;

type FetchResult<T> = { ok: true; data: T } | { ok: false };

// Fetch JSON with a timeout. Failures are logged and reported, never thrown,
// so a flaky upstream degrades the page instead of taking it down.
async function fetchJson<T>(url: string, init?: RequestInit): Promise<FetchResult<T>> {
  try {
    const res = await fetch(url, {
      ...init,
      headers: { accept: "application/json", ...(init?.headers ?? {}) },
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
      next: { revalidate: REVALIDATE },
    });
    if (!res.ok) {
      console.error(`[hf] ${res.status} ${res.statusText}: ${url}`);
      return { ok: false };
    }
    return { ok: true, data: (await res.json()) as T };
  } catch (error) {
    console.error(`[hf] fetch failed: ${url}`, error);
    return { ok: false };
  }
}

async function getJson<T>(url: string, init?: RequestInit): Promise<T | null> {
  const r = await fetchJson<T>(url, init);
  return r.ok ? r.data : null;
}

async function fetchList<T>(url: string): Promise<FetchResult<T[]>> {
  const r = await fetchJson<unknown>(url);
  if (!r.ok) return r;
  if (!Array.isArray(r.data)) {
    console.error(`[hf] expected an array from ${url}`);
    return { ok: false };
  }
  return { ok: true, data: r.data as T[] };
}

function hfUrl(path: string, params: Array<[string, string]>): string {
  const qs = params.map(([k, v]) => `${k}=${encodeURIComponent(v)}`).join("&");
  return `${HF}/api/${path}?${qs}`;
}

const MODEL_EXPAND = [
  "cardData",
  "gguf",
  "safetensors",
  "siblings",
  "downloadsAllTime",
  "trendingScore",
  "lastModified",
  "createdAt",
  "downloads",
  "likes",
  "pipeline_tag",
  "library_name",
  "tags",
];

const DATASET_EXPAND = [
  "cardData",
  "downloadsAllTime",
  "trendingScore",
  "lastModified",
  "createdAt",
  "downloads",
  "likes",
  "tags",
  "description",
];

export async function fetchRawModels(): Promise<FetchResult<RawModel[]>> {
  const url = hfUrl("models", [
    ["author", site.org],
    ["limit", "500"],
    ...MODEL_EXPAND.map((e) => ["expand[]", e] as [string, string]),
  ]);
  return fetchList<RawModel>(url);
}

export async function fetchRawDatasets(): Promise<FetchResult<RawDataset[]>> {
  const url = hfUrl("datasets", [
    ["author", site.org],
    ["limit", "500"],
    ...DATASET_EXPAND.map((e) => ["expand[]", e] as [string, string]),
  ]);
  return fetchList<RawDataset>(url);
}

async function fetchOrgOverview(): Promise<RawOrgOverview | null> {
  return getJson<RawOrgOverview>(`${HF}/api/organizations/${site.org}/overview`);
}

async function fetchMembers(): Promise<RawMember[]> {
  const r = await fetchList<RawMember>(`${HF}/api/organizations/${site.org}/members`);
  return r.ok ? r.data.filter((m) => typeof m?.user === "string") : [];
}

// ---------------------------------------------------------------------------
// Normalization
// ---------------------------------------------------------------------------

function asList(v: string | string[] | undefined): string[] {
  if (!v) return [];
  return Array.isArray(v) ? v : [v];
}

function tagValues(tags: string[] | undefined, key: string): string[] {
  const prefix = `${key}:`;
  return (tags ?? [])
    .filter((t) => t.startsWith(prefix))
    .map((t) => t.slice(prefix.length))
    .filter(Boolean);
}

function toVariant(m: RawModel): ModelVariant {
  const name = m.id.split("/")[1] ?? m.id;
  const files = (m.siblings ?? []).map((s) => s.rfilename);
  const quants = new Set<string>();
  let hasMmproj = false;
  for (const f of files) {
    if (/^mmproj/i.test(f.split("/").pop() ?? "")) {
      hasMmproj = true;
      continue;
    }
    const q = quantFromFilename(f);
    if (q) quants.add(q);
  }
  return {
    id: m.id,
    name,
    kind: detectVariant(name, m.tags ?? []),
    url: `${HF}/${m.id}`,
    downloads: m.downloads ?? 0,
    downloadsAllTime: m.downloadsAllTime ?? m.downloads ?? 0,
    likes: m.likes ?? 0,
    createdAt: m.createdAt ?? "1970-01-01T00:00:00.000Z",
    lastModified: m.lastModified ?? m.createdAt ?? "1970-01-01T00:00:00.000Z",
    quants: sortQuants(Array.from(quants)),
    hasMmproj,
    hasModelfile: files.some((f) => /^Modelfile$/i.test(f)),
  };
}

const KIND_PRIORITY: Record<VariantKind, number> = { safetensors: 0, gguf: 1, lora: 2 };

export function buildReleases(raw: RawModel[]): Release[] {
  const groups = new Map<string, RawModel[]>();
  for (const m of raw) {
    const name = m.id.split("/")[1] ?? m.id;
    const key = releaseKey(name);
    const list = groups.get(key);
    if (list) list.push(m);
    else groups.set(key, [m]);
  }

  const releases: Release[] = [];
  for (const [slug, models] of groups) {
    const variants = models
      .map(toVariant)
      .sort((a, b) => KIND_PRIORITY[a.kind] - KIND_PRIORITY[b.kind]);
    const primaryVariant = variants[0];
    const primaryRaw = models.find((m) => m.id === primaryVariant.id) ?? models[0];
    const name = releaseName(primaryVariant.name);
    const parsed = parseModelName(name);

    // Metadata: prefer the safetensors repo, then GGUF. LoRA adapters only
    // know their own (tiny) parameter count, so they never decide the size.
    const rawById = new Map(models.map((m) => [m.id, m]));
    const weightRepos = variants.filter((v) => v.kind !== "lora").map((v) => rawById.get(v.id)!);
    const safetensorsParams = weightRepos.map((m) => m.safetensors?.total).find((n) => !!n);
    const ggufParams = weightRepos.map((m) => m.gguf?.total).find((n) => !!n);
    const params = safetensorsParams ?? ggufParams;
    const ggufMeta = weightRepos.map((m) => m.gguf).find((g) => !!g);
    const license = models
      .flatMap((m) => asList(m.cardData?.license))
      .concat(models.flatMap((m) => tagValues(m.tags, "license")))
      .find(Boolean);
    const datasets = Array.from(
      new Set(models.flatMap((m) => asList(m.cardData?.datasets))),
    ).filter((d) => d.includes("/"));
    const baseModelRaw = asList(primaryRaw.cardData?.base_model)[0];
    const baseModel =
      baseModelRaw && !baseModelRaw.startsWith(`${site.org}/`) ? baseModelRaw : undefined;
    const vision =
      models.some((m) => m.pipeline_tag === "image-text-to-text") ||
      variants.some((v) => v.hasMmproj);
    const thinking =
      !/non[- ]?(?:reasoning|thinking)/i.test(name) &&
      (/thinking|reasoning/i.test(name) ||
        parsed.base?.flavor === "Thinking" ||
        models.some((m) => (m.cardData?.tags ?? []).includes("reasoning")));

    const teacherLabel = parsed.teacher?.label ?? "Unknown teacher";
    const vendor = parsed.teacher?.vendor ?? "other";
    const base = parsed.base?.family ?? "Other";
    const sizeLabel = parsed.base?.size
      ? parsed.base.active
        ? `${parsed.base.size}-A${parsed.base.active}`
        : parsed.base.size
      : undefined;
    const title = parsed.base
      ? [base, sizeLabel, parsed.base.flavor].filter(Boolean).join(" ")
      : name.replace(/-/g, " ");

    const createdAt = variants.map((v) => v.createdAt).sort()[0];
    const lastModified = variants.map((v) => v.lastModified).sort().at(-1) ?? createdAt;

    releases.push({
      slug,
      name,
      title,
      teacher: teacherLabel,
      vendor,
      vendorLabel: vendorLabel(vendor),
      base,
      size: parsed.base?.size,
      active: parsed.base?.active,
      flavor: parsed.base?.flavor,
      descriptors: parsed.tags,
      version: parsed.version,
      experimental: parsed.experimental,
      baseModel,
      params,
      sizeBucket: sizeBucket(params),
      contextLength: ggufMeta?.context_length,
      architecture: ggufMeta?.architecture,
      license,
      datasets,
      vision,
      thinking,
      variants,
      kinds: Array.from(new Set(variants.map((v) => v.kind))),
      downloads: variants.reduce((s, v) => s + v.downloads, 0),
      downloadsAllTime: variants.reduce((s, v) => s + v.downloadsAllTime, 0),
      likes: variants.reduce((s, v) => s + v.likes, 0),
      trendingScore: Math.max(0, ...models.map((m) => m.trendingScore ?? 0)),
      createdAt,
      lastModified,
    });
  }

  return releases.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

function cleanDescription(
  raw: string | undefined,
  titles: string[] = [],
): {
  text: string;
  generatedWithTeich: boolean;
} {
  let s = (raw ?? "").replace(/\s+/g, " ").trim();
  const generatedWithTeich = /generated using teich/i.test(s);
  s = s.replace(/^This dataset was generated using teich by TeichAI\s*/i, "");
  s = s.replace(
    /Prepare these datasets for supervised fine-tuning in just a few lines of code\s*[—–-]\s*see the Conversion section below\.?\s*/i,
    "",
  );
  s = s.replace(/See the full description on the dataset page:.*$/i, "").trim();
  // The HF description starts with the README's H1, which usually repeats the
  // dataset title. Drop it so the excerpt starts with actual prose.
  const norm = (x: string) => x.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
  for (const t of titles) {
    const nt = norm(t);
    if (!nt) continue;
    const head = norm(s.slice(0, t.length + 8)).slice(0, nt.length);
    if (head === nt) {
      // find the end of the title in the original string by walking tokens
      const re = new RegExp(`^${nt.split(" ").map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("[^a-z0-9]*")}[^a-z0-9]*`, "i");
      s = s.replace(re, "").trim();
      break;
    }
  }
  s = s.replace(/^[-–—:·]\s*/, "").trim();
  s = s.replace(/…$/, "").trim();
  if (s.length > 240) s = `${s.slice(0, 237).replace(/\s+\S*$/, "")}…`;
  return { text: s, generatedWithTeich };
}

export function buildDatasets(raw: RawDataset[]): DatasetInfo[] {
  return raw
    .map((d): DatasetInfo => {
      const name = d.id.split("/")[1] ?? d.id;
      const cardTags = d.cardData?.tags ?? [];
      const teacher = detectTeacher(name) ?? detectTeacher(cardTags.join(" "));
      const title = d.cardData?.pretty_name?.trim() || name;
      const { text, generatedWithTeich } = cleanDescription(d.description, [
        title,
        name,
        name.replace(/[-_]/g, " "),
      ]);
      const license =
        asList(d.cardData?.license)[0] ?? tagValues(d.tags, "license")[0] ?? undefined;
      return {
        id: d.id,
        name,
        title,
        url: `${HF}/datasets/${d.id}`,
        description: text,
        teacher: teacher?.label,
        vendor: teacher?.vendor ?? "other",
        vendorLabel: vendorLabel(teacher?.vendor ?? "other"),
        kind: detectDatasetKind(name, cardTags, d.description ?? ""),
        samples: detectSampleCount(name),
        sizeCategory: tagValues(d.tags, "size_categories")[0],
        license,
        formats: tagValues(d.tags, "format"),
        taskCategories: tagValues(d.tags, "task_categories"),
        tags: cardTags.filter((t) => !t.includes("/")).slice(0, 8),
        generatedWithTeich: generatedWithTeich || cardTags.includes("teich"),
        downloads: d.downloads ?? 0,
        downloadsAllTime: d.downloadsAllTime ?? d.downloads ?? 0,
        likes: d.likes ?? 0,
        trendingScore: d.trendingScore ?? 0,
        createdAt: d.createdAt ?? "1970-01-01T00:00:00.000Z",
        lastModified: d.lastModified ?? d.createdAt ?? "1970-01-01T00:00:00.000Z",
      };
    })
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

// ---------------------------------------------------------------------------
// Derived views
// ---------------------------------------------------------------------------

export function buildTimeline(releases: Release[], datasets: DatasetInfo[]): TimelinePoint[] {
  const dates = [...releases.map((r) => r.createdAt), ...datasets.map((d) => d.createdAt)].filter(
    (d) => /^\d{4}-\d{2}-\d{2}/.test(d) && !d.startsWith("1970"),
  );
  if (dates.length === 0) return [];
  const first = monthKey(dates.sort()[0]);
  const now = new Date();
  const last = `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, "0")}`;

  const months: string[] = [];
  let [y, m] = first.split("-").map(Number);
  while (true) {
    const key = `${y}-${String(m).padStart(2, "0")}`;
    months.push(key);
    if (key === last || months.length > 60) break;
    m += 1;
    if (m > 12) {
      m = 1;
      y += 1;
    }
  }

  const modelCounts = new Map<string, number>();
  const datasetCounts = new Map<string, number>();
  for (const r of releases) {
    const k = monthKey(r.createdAt);
    modelCounts.set(k, (modelCounts.get(k) ?? 0) + 1);
  }
  for (const d of datasets) {
    const k = monthKey(d.createdAt);
    datasetCounts.set(k, (datasetCounts.get(k) ?? 0) + 1);
  }

  return months.map((key) => {
    const [yy, mm] = key.split("-").map(Number);
    const label = new Date(Date.UTC(yy, mm - 1, 1)).toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
      timeZone: "UTC",
    });
    return {
      month: key,
      label,
      models: modelCounts.get(key) ?? 0,
      datasets: datasetCounts.get(key) ?? 0,
    };
  });
}

export function buildMatrix(releases: Release[]): Matrix {
  const baseCounts = new Map<string, number>();
  const vendorCounts = new Map<string, number>();
  const cellMap = new Map<string, MatrixCell>();

  for (const r of releases) {
    baseCounts.set(r.base, (baseCounts.get(r.base) ?? 0) + 1);
    vendorCounts.set(r.vendor, (vendorCounts.get(r.vendor) ?? 0) + 1);
    const key = `${r.base}|${r.vendor}`;
    const cell = cellMap.get(key) ?? { base: r.base, vendor: r.vendor, count: 0, releases: [] };
    cell.count += 1;
    if (cell.releases.length < 6) {
      cell.releases.push({ slug: r.slug, title: `${r.title} · ${r.teacher}`, teacher: r.teacher });
    }
    cellMap.set(key, cell);
  }

  const byCount = (m: Map<string, number>) =>
    Array.from(m.entries())
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
      .map(([k]) => k);

  const bases = byCount(baseCounts);
  const vendors = byCount(vendorCounts);
  // Push the catch-all buckets to the end.
  const tail = (arr: string[], key: string) =>
    arr.includes(key) ? [...arr.filter((x) => x !== key), key] : arr;

  const cells = Array.from(cellMap.values());
  return {
    bases: tail(bases, "Other"),
    vendors: tail(vendors, "other"),
    cells,
    max: Math.max(1, ...cells.map((c) => c.count)),
  };
}

export function buildTeachers(releases: Release[], datasets: DatasetInfo[]): TeacherSummary[] {
  const map = new Map<string, TeacherSummary>();
  for (const r of releases) {
    if (r.vendor === "other") continue;
    const t = map.get(r.teacher) ?? { label: r.teacher, vendor: r.vendor, models: 0, datasets: 0 };
    t.models += 1;
    map.set(r.teacher, t);
  }
  for (const d of datasets) {
    if (!d.teacher) continue;
    const t = map.get(d.teacher) ?? { label: d.teacher, vendor: d.vendor, models: 0, datasets: 0 };
    t.datasets += 1;
    map.set(d.teacher, t);
  }
  return Array.from(map.values()).sort(
    (a, b) => b.models + b.datasets - (a.models + a.datasets) || a.label.localeCompare(b.label),
  );
}

export function buildStats(
  raw: RawModel[],
  releases: Release[],
  datasets: DatasetInfo[],
  followers: number,
): OrgStats {
  const teacherSet = new Set<string>();
  const vendorSet = new Set<string>();
  const baseSet = new Set<string>();
  // "Labs" counts real organisations; stealth/preview models have no named lab.
  const isLab = (vendor: string) => vendor !== "other" && vendor !== "stealth";
  for (const r of releases) {
    if (r.vendor !== "other") {
      teacherSet.add(r.teacher);
      if (isLab(r.vendor)) vendorSet.add(r.vendor);
    }
    if (r.base !== "Other") baseSet.add(r.base);
  }
  for (const d of datasets) {
    if (d.teacher) {
      teacherSet.add(d.teacher);
      if (isLab(d.vendor)) vendorSet.add(d.vendor);
    }
  }
  const ggufFiles = releases.reduce(
    (s, r) => s + r.variants.filter((v) => v.kind === "gguf").reduce((x, v) => x + v.quants.length, 0),
    0,
  );
  return {
    repos: raw.length,
    releases: releases.length,
    datasets: datasets.length,
    downloadsAllTime:
      releases.reduce((s, r) => s + r.downloadsAllTime, 0) +
      datasets.reduce((s, d) => s + d.downloadsAllTime, 0),
    downloads30d:
      releases.reduce((s, r) => s + r.downloads, 0) + datasets.reduce((s, d) => s + d.downloads, 0),
    likes: releases.reduce((s, r) => s + r.likes, 0) + datasets.reduce((s, d) => s + d.likes, 0),
    followers,
    teachers: teacherSet.size,
    vendors: vendorSet.size,
    bases: baseSet.size,
    ggufFiles,
    ggufReleases: releases.filter((r) => r.kinds.includes("gguf")).length,
  };
}

// ---------------------------------------------------------------------------
// Entry points (deduplicated per request via React cache)
// ---------------------------------------------------------------------------

const NEW_WINDOW_MS = 30 * 86_400_000;

export const getSnapshot = cache(async (): Promise<Snapshot> => {
  const [modelsResult, datasetsResult, overview] = await Promise.all([
    fetchRawModels(),
    fetchRawDatasets(),
    fetchOrgOverview(),
  ]);
  const rawModels = modelsResult.ok ? modelsResult.data : [];
  const rawDatasets = datasetsResult.ok ? datasetsResult.data : [];
  const releases = buildReleases(rawModels);
  const datasets = buildDatasets(rawDatasets);
  const now = Date.now();
  return {
    fetchedAt: new Date(now).toISOString(),
    newSince: new Date(now - NEW_WINDOW_MS).toISOString(),
    degraded: !modelsResult.ok || !datasetsResult.ok,
    releases,
    datasets,
    stats: buildStats(rawModels, releases, datasets, overview?.numFollowers ?? 0),
    timeline: buildTimeline(releases, datasets),
    matrix: buildMatrix(releases),
    teachers: buildTeachers(releases, datasets),
  };
});

export const getTeam = cache(async (): Promise<TeamProfile[]> => {
  const members = await fetchMembers();
  const byHandle = new Map(members.map((m) => [m.user.toLowerCase(), m] as const));
  return teamConfig.map((t) => ({
    ...t,
    avatarUrl: byHandle.get(t.handle.toLowerCase())?.avatarUrl,
    url: `${HF}/${t.handle}`,
  }));
});

const TEICH_FALLBACK: TeichMeta = {
  stars: 140,
  forks: 16,
  version: "0.3",
  releases: 99,
  summary: "Turn coding agent traces into auditable supervised fine-tuning data",
  live: false,
};

export const getTeichMeta = cache(async (): Promise<TeichMeta> => {
  const [gh, pypi] = await Promise.all([
    getJson<{ stargazers_count?: number; forks_count?: number; description?: string }>(
      "https://api.github.com/repos/TeichAI/teich",
      { headers: { "user-agent": "teichai-website" } },
    ),
    getJson<{ info?: { version?: string; summary?: string }; releases?: Record<string, unknown> }>(
      "https://pypi.org/pypi/teich/json",
    ),
  ]);
  return {
    stars: gh?.stargazers_count ?? TEICH_FALLBACK.stars,
    forks: gh?.forks_count ?? TEICH_FALLBACK.forks,
    version: pypi?.info?.version ?? TEICH_FALLBACK.version,
    releases: pypi?.releases ? Object.keys(pypi.releases).length : TEICH_FALLBACK.releases,
    summary: pypi?.info?.summary ?? TEICH_FALLBACK.summary,
    live: !!gh || !!pypi,
  };
});
