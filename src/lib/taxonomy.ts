// Parsing rules that turn Hugging Face repo names into structured metadata:
// which frontier model was the teacher, which lab made it, and which open
// base model was fine-tuned. Pure functions, safe to run on the client.

export interface VendorMeta {
  id: string;
  label: string;
  short: string;
}

export const VENDORS: VendorMeta[] = [
  { id: "anthropic", label: "Anthropic", short: "Anthropic" },
  { id: "openai", label: "OpenAI", short: "OpenAI" },
  { id: "google", label: "Google", short: "Google" },
  { id: "deepseek", label: "DeepSeek", short: "DeepSeek" },
  { id: "moonshot", label: "Moonshot AI", short: "Moonshot" },
  { id: "zai", label: "Z.ai", short: "Z.ai" },
  { id: "xai", label: "xAI", short: "xAI" },
  { id: "minimax", label: "MiniMax", short: "MiniMax" },
  { id: "xiaomi", label: "Xiaomi", short: "Xiaomi" },
  { id: "mistral", label: "Mistral AI", short: "Mistral" },
  { id: "cohere", label: "Cohere", short: "Cohere" },
  { id: "stepfun", label: "StepFun", short: "StepFun" },
  { id: "alibaba", label: "Alibaba", short: "Alibaba" },
  { id: "meta", label: "Meta", short: "Meta" },
  { id: "stealth", label: "Stealth models", short: "Stealth" },
  { id: "other", label: "Other", short: "Other" },
];

const VENDOR_BY_ID = new Map(VENDORS.map((v) => [v.id, v]));
export function vendorLabel(id: string): string {
  return VENDOR_BY_ID.get(id)?.label ?? "Other";
}
export function vendorShort(id: string): string {
  return VENDOR_BY_ID.get(id)?.short ?? "Other";
}

export interface Teacher {
  label: string;
  vendor: string;
}

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
const words = (s: string) => s.split(/[- ]+/).filter(Boolean).map(cap).join(" ");

// Each rule captures the version instead of enumerating releases, so a
// "Claude Opus 4.8" or "GPT-6" repo is labelled correctly the day it appears.
// Order only matters where one family's keyword is a substring of another's.
const TEACHER_RULES: Array<{ re: RegExp; vendor: string; label: (m: RegExpMatchArray) => string }> = [
  // Anthropic
  { re: /fable(?:[- ]?(\d(?:\.\d+)?))?/i, vendor: "anthropic", label: (m) => `Claude Fable ${m[1] ?? "5"}` },
  {
    re: /(?:claude[- ]?)?(opus|sonnet|haiku)[- ]?(\d(?:\.\d+)?)\b/i,
    vendor: "anthropic",
    label: (m) => `Claude ${cap(m[1])} ${m[2]}`,
  },
  {
    re: /claude[- ]?(\d(?:\.\d+)?)[- ]?(opus|sonnet|haiku)/i,
    vendor: "anthropic",
    label: (m) => `Claude ${cap(m[2])} ${m[1]}`,
  },
  { re: /claude[- ]?(opus|sonnet|haiku)/i, vendor: "anthropic", label: (m) => `Claude ${cap(m[1])}` },
  { re: /claude/i, vendor: "anthropic", label: () => "Claude" },
  // OpenAI (gpt-oss is a base model, never a teacher: the digit requirement excludes it)
  {
    re: /gpt[- ]?(\d+(?:\.\d+)?)(?:[- ]?(codex(?:[- ]?max)?|mini|nano|pro|chat))?/i,
    vendor: "openai",
    label: (m) => `GPT-${m[1]}${m[2] ? ` ${words(m[2]).replace("Codex Max", "Codex Max")}` : ""}`,
  },
  { re: /\bo(\d)(?:[- ]?(mini|pro))?\b/, vendor: "openai", label: (m) => `o${m[1]}${m[2] ? ` ${m[2]}` : ""}` },
  // Google
  {
    re: /gemini[- ]?(\d+(?:\.\d+)?)(?:[- ]?(pro|flash(?:[- ]?lite)?|ultra))?/i,
    vendor: "google",
    label: (m) => `Gemini ${m[1]}${m[2] ? ` ${words(m[2])}` : ""}`,
  },
  { re: /gemini/i, vendor: "google", label: () => "Gemini" },
  // DeepSeek
  { re: /deepseek[- ]?r(\d+)/i, vendor: "deepseek", label: (m) => `DeepSeek R${m[1]}` },
  {
    re: /deepseek[- ]?v?(\d+(?:\.\d+)?)(?:[- ]?(speciale?|pro|flash|lite|chat|reasoner))?/i,
    vendor: "deepseek",
    label: (m) => `DeepSeek V${m[1]}${m[2] ? ` ${cap(m[2]).replace(/^Special$/, "Speciale")}` : ""}`,
  },
  { re: /deepseek/i, vendor: "deepseek", label: () => "DeepSeek" },
  // Moonshot
  {
    re: /kimi[- ]?k(\d+(?:\.\d+)?)(?:[- ]?(thinking|instruct))?/i,
    vendor: "moonshot",
    label: (m) => `Kimi K${m[1]}${m[2]?.toLowerCase() === "thinking" ? " Thinking" : ""}`,
  },
  { re: /kimi/i, vendor: "moonshot", label: () => "Kimi" },
  // Z.ai
  {
    re: /glm[- ]?(\d+(?:\.\d+)?)(?:[- ]?(flash|air|plus))?/i,
    vendor: "zai",
    label: (m) => `GLM ${m[1]}${m[2] ? ` ${cap(m[2])}` : ""}`,
  },
  { re: /\bglm/i, vendor: "zai", label: () => "GLM" },
  // xAI
  { re: /grok[- ]?code[- ]?fast(?:[- ]?(\d+))?/i, vendor: "xai", label: (m) => `Grok Code Fast ${m[1] ?? "1"}` },
  {
    re: /grok[- ]?(\d+(?:\.\d+)?)(?:[- ]?(fast|mini|heavy))?/i,
    vendor: "xai",
    label: (m) => `Grok ${m[1]}${m[2] ? ` ${cap(m[2])}` : ""}`,
  },
  { re: /grok/i, vendor: "xai", label: () => "Grok" },
  // MiniMax
  { re: /minimax[- ]?m(\d+(?:\.\d+)?)/i, vendor: "minimax", label: (m) => `MiniMax M${m[1]}` },
  { re: /minimax/i, vendor: "minimax", label: () => "MiniMax" },
  // Xiaomi
  {
    re: /mimo[- ]?v?(\d+(?:\.\d+)?)(?:[- ]?(flash|pro))?/i,
    vendor: "xiaomi",
    label: (m) => `MiMo V${m[1]}${m[2] ? ` ${cap(m[2])}` : ""}`,
  },
  // Cohere
  { re: /command[- ]?(a|r\+|r7b|r)\b/i, vendor: "cohere", label: (m) => `Command ${m[1].toUpperCase()}` },
  // Mistral
  {
    re: /mistral[- ]?(small|medium|large|nemo)(?:[- ]?(\d+(?:\.\d+)?))?/i,
    vendor: "mistral",
    label: (m) => `Mistral ${cap(m[1])}${m[2] ? ` ${m[2]}` : ""}`,
  },
  { re: /devstral(?:[- ]?(\d+(?:\.\d+)?))?/i, vendor: "mistral", label: (m) => `Devstral${m[1] ? ` ${m[1]}` : ""}` },
  { re: /magistral/i, vendor: "mistral", label: () => "Magistral" },
  // StepFun
  {
    re: /step[- ]?(\d+(?:\.\d+)?)(?:[- ]?(flash|pro))?/i,
    vendor: "stepfun",
    label: (m) => `Step ${m[1]}${m[2] ? ` ${cap(m[2])}` : ""}`,
  },
  // Alibaba (only as a teacher, e.g. Qwen3-Max distills)
  { re: /qwen[- ]?(\d+(?:\.\d+)?)[- ]?max/i, vendor: "alibaba", label: (m) => `Qwen${m[1]} Max` },
  // Meta
  { re: /llama[- ]?(\d+(?:\.\d+)?)[- ]?(maverick|behemoth)/i, vendor: "meta", label: (m) => `Llama ${m[1]} ${cap(m[2])}` },
  // Stealth / preview models published under code names
  {
    re: /(polaris|pony|hunter|healer|aurora|ox|sherlock)(?:[- ]?(?:think(?:ing)?|dash))?[- ]?alpha/i,
    vendor: "stealth",
    label: (m) => `${cap(m[1])} Alpha`,
  },
];

interface TeacherMatch extends Teacher {
  index: number;
  length: number;
}

function matchTeachers(text: string): TeacherMatch[] {
  const out: TeacherMatch[] = [];
  for (const rule of TEACHER_RULES) {
    const m = text.match(rule.re);
    if (m && m.index !== undefined) {
      out.push({ label: rule.label(m), vendor: rule.vendor, index: m.index, length: m[0].length });
    }
  }
  // Earliest match wins; on a tie the more specific (longer) match wins, and
  // matches nested inside an earlier one ("Grok" inside "Grok Code Fast") drop.
  const sorted = out.sort((a, b) => a.index - b.index || b.length - a.length);
  const kept: TeacherMatch[] = [];
  for (const m of sorted) {
    if (kept.some((k) => m.index >= k.index && m.index + m.length <= k.index + k.length)) continue;
    kept.push(m);
  }
  return kept;
}

export function detectTeacher(text: string): Teacher | null {
  const m = matchTeachers(text)[0];
  return m ? { label: m.label, vendor: m.vendor } : null;
}

export interface BaseInfo {
  family: string; // "Qwen3.5"
  size?: string; // "27B"
  active?: string; // "4B" for MoE
  flavor?: string; // "Thinking" | "Instruct"
  consumed: number; // characters consumed from the start of the name
}

// Curated base families first (capture groups: 1 family, 2 size, 3 active, 4 flavor),
// then a generic "<Family>-<size>B" fallback so unknown bases still get a row.
const BASES: Array<{ re: RegExp; family: string | ((m: RegExpMatchArray) => string) }> = [
  {
    re: /^(Qwen3(?:\.\d)?)-(\d+(?:\.\d+)?B)(?:-A(\d+B))?(?:-(Thinking|Instruct)(?:-2507)?)?/i,
    family: (m) => m[1],
  },
  { re: /^(gemma-?4)-(E?\d+B)(?:-A(\d+B))?(?:-it)?/i, family: "Gemma 4" },
  { re: /^(GLM-4\.7-Flash)()/i, family: "GLM 4.7 Flash" },
  { re: /^(gpt-oss)-(\d+)b/i, family: "gpt-oss" },
  { re: /^(Nemotron-Cascade)-(\d+B)(?:-A(\d+B))?(?:-(Thinking))?/i, family: "Nemotron Cascade" },
  { re: /^(Nemotron-Orchestrator)-(\d+B)/i, family: "Nemotron Orchestrator" },
  { re: /^(Devstral-Small)-\d+()/i, family: "Devstral Small" },
  { re: /^(Mistral-7B)-v0\.\d()/i, family: "Mistral 7B" },
  { re: /^(LFM2\.5)-(\d+(?:\.\d+)?B)(?:()-(Thinking))?/i, family: "LFM2.5" },
  { re: /^(Minimax-M2\.7)()/i, family: "MiniMax M2.7" },
  { re: /^(ERNIE-4\.5)-(\d+B)(?:-A(\d+B))?(?:-(Thinking))?/i, family: "ERNIE 4.5" },
  // Generic: "Family[-N][-Variant]-<size>B[-A<active>B][-<n>E][-Thinking|Instruct][-YYMM]"
  {
    re: /^([A-Za-z][A-Za-z0-9.]*(?:-\d+(?:\.\d+)?)?(?:-(?:VL|Coder|Next|Scout|Maverick|Omni|Small|Medium|Large|Mini|Nano|it))*)-(E?\d+(?:\.\d+)?B)(?:-A(\d+(?:\.\d+)?B))?(?:-\d+E)?(?:-(Thinking|Instruct|it))?(?:-\d{4})?/i,
    family: (m) => m[1],
  },
];

function normalizeFamily(f: string): string {
  const spaced = f.replace(/-/g, " ").replace(/\s+/g, " ").trim();
  const l = spaced.toLowerCase();
  if (l.startsWith("qwen")) return spaced.replace(/^qwen/i, "Qwen");
  if (l.startsWith("gemma")) return spaced.replace(/^gemma\s?/i, "Gemma ");
  if (l.startsWith("llama")) return spaced.replace(/^llama\s?/i, "Llama ").replace(/\s+/g, " ");
  if (l.startsWith("gpt oss")) return "gpt-oss";
  return spaced.charAt(0).toUpperCase() + spaced.slice(1);
}

export function detectBase(name: string): BaseInfo | null {
  for (const { re, family } of BASES) {
    const m = name.match(re);
    if (!m) continue;
    const fam = typeof family === "function" ? family(m) : family;
    const rawSize = m[2];
    const size = rawSize ? rawSize.toUpperCase() : undefined;
    const active = m[3] ? m[3].toUpperCase() : undefined;
    const flavor = m[4] && m[4].toLowerCase() !== "it" ? cap(m[4]) : undefined;
    return {
      family: normalizeFamily(fam),
      size: size ? (size.endsWith("B") ? size : `${size}B`) : undefined,
      active,
      flavor,
      consumed: m[0].length,
    };
  }
  return null;
}

export type VariantKind = "safetensors" | "gguf" | "lora";

export const VARIANT_LABELS: Record<VariantKind, string> = {
  safetensors: "Safetensors",
  gguf: "GGUF",
  lora: "LoRA",
};

const VARIANT_SUFFIX = /-(GGUF|LoRA|Lora|Safetensors?)$/i;

export function detectVariant(name: string, tags: string[] = []): VariantKind {
  if (/-lora$/i.test(name)) return "lora";
  if (/-gguf$/i.test(name)) return "gguf";
  if (tags.includes("lora") || tags.includes("peft")) return "lora";
  // A full-weights repo that also hosts a stray .gguf gets HF's automatic
  // "gguf" tag; only treat it as a GGUF repo when nothing says otherwise.
  if (tags.includes("gguf") && !tags.includes("safetensors")) return "gguf";
  return "safetensors";
}

// Group key shared by the safetensors / GGUF / LoRA repos of one fine-tune.
export function releaseKey(name: string): string {
  return name.replace(VARIANT_SUFFIX, "").toLowerCase();
}

export function releaseName(name: string): string {
  return name.replace(VARIANT_SUFFIX, "");
}

// Words that carry no identity once teacher and base have been extracted.
const NOISE = new Set([
  "distill",
  "distilled",
  "reasoning",
  "high",
  "preview",
  "thinking",
  "instruct",
  "gguf",
  "lora",
  "safetensor",
  "safetensors",
  "it",
  "max",
  "experimental",
  "model",
  "cleaned",
  "unredacted",
  "standalone",
  "the",
  "and",
]);

// Pure numbers, decimals and version fragments left over from a teacher match
// ("4.6", ".8", "v2"); sample-count markers like "1000x" are kept because they
// distinguish otherwise identical releases.
const NUMERIC_FRAGMENT = /^\.?\d+(?:\.\d+)?$|^v\d+(?:\.\d+)?$|^\d{4}$/i;

export interface ParsedModelName {
  base: BaseInfo | null;
  teacher: Teacher | null;
  version?: string;
  experimental: boolean;
  tags: string[]; // leftover descriptors like "Code", "Math", "Agent", "Coder"
}

export function parseModelName(rawName: string): ParsedModelName {
  const name = releaseName(rawName);
  const base = detectBase(name);
  let remainder = base ? name.slice(base.consumed) : name;
  const versionMatch = name.match(/-v(\d+)$/i);
  const version = versionMatch ? `v${versionMatch[1]}` : undefined;
  const experimental = /experimental/i.test(name);
  // "Non-reasoning" is a mode, not a descriptor or a thinking signal.
  remainder = remainder.replace(/non[- ]?(?:reasoning|thinking)/gi, " ");

  // With a known base the remainder starts at the teacher, so the earliest
  // match wins. Without one the base model itself may look like a teacher
  // ("GLM-5-Grok-…"), so take the last match instead.
  const matches = matchTeachers(remainder);
  const match = (base ? matches[0] : matches[matches.length - 1]) ?? null;
  const teacher = match ? { label: match.label, vendor: match.vendor } : null;

  // Strip the teacher's matched text so leftover descriptors can surface.
  if (match) {
    remainder = `${remainder.slice(0, match.index)} ${remainder.slice(match.index + match.length)}`;
  }

  const tags = remainder
    .split(/[-_\s]+/)
    .map((t) => t.trim())
    .filter((t) => t.length > 1 && !NOISE.has(t.toLowerCase()) && !NUMERIC_FRAGMENT.test(t))
    .map((t) => (t === t.toLowerCase() ? cap(t) : t));

  return { base, teacher, version, experimental, tags: Array.from(new Set(tags)) };
}

export type DatasetKind = "reasoning" | "agent" | "chat" | "sft" | "other";

export const DATASET_KINDS: Record<DatasetKind, string> = {
  reasoning: "Reasoning traces",
  agent: "Agent traces",
  chat: "Chat",
  sft: "SFT mixes",
  other: "Other",
};

export function detectDatasetKind(name: string, tags: string[] = [], description = ""): DatasetKind {
  const t = `${name} ${tags.join(" ")}`;
  if (/non[- ]?reasoning/i.test(name) || /non-reasoning/i.test(description)) return "chat";
  if (/reasoning[- ]?traces/i.test(name)) return "reasoning";
  if (/agent|traces|cursor|session|\bpi\b/i.test(t)) return "agent";
  if (/sft/i.test(t)) return "sft";
  if (/reasoning|thinking|think|speciale|brainstorm|-\d+x$/i.test(name)) return "reasoning";
  if (/reasoning dataset/i.test(description)) return "reasoning";
  if (/chat|convo|\d+(\.\d+)?k$/i.test(name)) return "chat";
  return "other";
}

// "claude-4.5-opus-high-reasoning-250x" -> 250, "Pony-Alpha-15k" -> 15000
export function detectSampleCount(name: string): number | undefined {
  const m = name.match(/(\d+(?:\.\d+)?)\s*(k|x)$/i);
  if (!m) return undefined;
  const n = parseFloat(m[1]);
  return m[2].toLowerCase() === "k" ? Math.round(n * 1000) : Math.round(n);
}

export const SIZE_BUCKETS = [
  { id: "xs", label: "≤ 4B", min: 0, max: 4.5e9 },
  { id: "s", label: "5–10B", min: 4.5e9, max: 10.5e9 },
  { id: "m", label: "11–20B", min: 10.5e9, max: 21e9 },
  { id: "l", label: "21B+", min: 21e9, max: Infinity },
] as const;

export type SizeBucket = (typeof SIZE_BUCKETS)[number]["id"];
export const SIZE_BUCKET_IDS: readonly SizeBucket[] = SIZE_BUCKETS.map((b) => b.id);

export function sizeBucket(params?: number | null): SizeBucket | null {
  if (!params) return null;
  for (const b of SIZE_BUCKETS) if (params >= b.min && params < b.max) return b.id;
  return null;
}

export const QUANT_ORDER = [
  "Q4_K_M",
  "Q4_K_S",
  "Q4_K_XL",
  "UD-Q4_K_XL",
  "IQ4_XS",
  "IQ4_NL",
  "Q5_K_M",
  "Q5_K_S",
  "Q6_K",
  "Q8_0",
  "Q3_K_M",
  "Q3_K_L",
  "Q3_K_XL",
  "Q3_K_S",
  "Q2_K",
  "F16",
  "BF16",
  "F32",
];

export function preferredQuant(quants: string[]): string | null {
  for (const q of QUANT_ORDER) if (quants.includes(q)) return q;
  return quants[0] ?? null;
}

// Approximate bits-per-weight, used to order quants from smallest to largest.
function quantRank(q: string): number {
  const u = q.toUpperCase().replace(/^UD-/, "");
  if (/^TQ1/.test(u)) return 1;
  if (/^TQ2|^IQ1/.test(u)) return 1.5;
  if (/^IQ2|^Q2/.test(u)) return 2;
  if (/^IQ3|^Q3/.test(u)) return 3;
  if (/^IQ4|^Q4/.test(u)) return 4;
  if (/^Q5/.test(u)) return 5;
  if (/^Q6/.test(u)) return 6;
  if (/^Q8/.test(u)) return 8;
  if (/^F16|^BF16/.test(u)) return 16;
  if (/^F32/.test(u)) return 32;
  return 99;
}
const SIZE_SUFFIX_RANK: Record<string, number> = { S: 0, M: 1, L: 2, XL: 3 };
export function sortQuants(quants: string[]): string[] {
  return [...quants].sort((a, b) => {
    const d = quantRank(a) - quantRank(b);
    if (d !== 0) return d;
    const sa = SIZE_SUFFIX_RANK[a.split("_").pop() ?? ""] ?? 1;
    const sb = SIZE_SUFFIX_RANK[b.split("_").pop() ?? ""] ?? 1;
    return sa - sb || a.localeCompare(b);
  });
}

// "model-Q4_K_M.gguf", "model.iq4_nl.gguf", "model-UD-Q4_K_XL-00001-of-00002.gguf"
export function quantFromFilename(file: string): string | null {
  const base = file.split("/").pop() ?? file;
  if (/^mmproj/i.test(base) || /mmproj/i.test(base)) return null;
  const m = base.match(
    /[-._]((?:UD-)?(?:IQ\d_[A-Z0-9]+|Q\d_K(?:_[A-Z]+)?|Q\d_\d|TQ\d_\d|BF16|F16|F32))(?:-\d+-of-\d+)?\.gguf$/i,
  );
  return m ? m[1].toUpperCase() : null;
}
