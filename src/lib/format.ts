// Number, size, and date formatting helpers shared by server and client code.

export function formatCompact(n: number | undefined | null): string {
  if (n === undefined || n === null || !Number.isFinite(n)) return "–";
  // Round before picking the unit so 999,600 becomes "1M", not "1000K".
  if (n >= 999_500) return `${trim((n / 1_000_000).toFixed(n >= 9_995_000 ? 0 : 1))}M`;
  if (n >= 999.5) return `${trim((n / 1_000).toFixed(n >= 99_950 ? 0 : 1))}K`;
  return n.toLocaleString("en-US");
}

export function formatFull(n: number | undefined | null): string {
  if (n === undefined || n === null || Number.isNaN(n)) return "–";
  return n.toLocaleString("en-US");
}

// 27_781_427_952 -> "27B", 1_200_000_000 -> "1.2B", 600_000_000 -> "600M"
export function formatParams(n: number | undefined | null): string | null {
  if (!n) return null;
  if (n >= 1e9) return `${trim((n / 1e9).toFixed(n / 1e9 < 10 ? 1 : 0))}B`;
  if (n >= 1e6) return `${Math.round(n / 1e6)}M`;
  return `${n}`;
}

// 262144 -> "256K", 32768 -> "32K", 202752 -> "198K"
export function formatContext(n: number | undefined | null): string | null {
  if (!n) return null;
  if (n >= 1024 * 1024) return `${trim((n / (1024 * 1024)).toFixed(1))}M`;
  if (n >= 1024) return `${Math.round(n / 1024)}K`;
  return `${n}`;
}

export function formatMonth(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", { month: "short", year: "numeric", timeZone: "UTC" });
}

export function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

export function relativeTime(iso: string, now = Date.now()): string {
  const diff = Math.max(0, now - new Date(iso).getTime());
  const s = Math.floor(diff / 1000);
  const m = Math.floor(s / 60);
  const h = Math.floor(m / 60);
  const d = Math.floor(h / 24);
  if (d >= 365) return `${Math.floor(d / 365)}y ago`;
  if (d >= 30) return `${Math.floor(d / 30)}mo ago`;
  if (d >= 1) return `${d}d ago`;
  if (h >= 1) return `${h}h ago`;
  if (m >= 1) return `${m}m ago`;
  return "just now";
}

export function monthKey(iso: string): string {
  return iso.slice(0, 7);
}

function trim(s: string): string {
  return s.replace(/\.0$/, "");
}

export function pluralize(n: number, word: string, plural = `${word}s`): string {
  return `${formatFull(n)} ${n === 1 ? word : plural}`;
}
