// Decorative identity dots for teacher vendors. Text always carries the
// identity; these hues are a secondary cue only.
const VENDOR_COLORS: Record<string, string> = {
  anthropic: "#d98a5f",
  openai: "#5ec8b0",
  google: "#5b93f5",
  deepseek: "#6b7cff",
  moonshot: "#a78bfa",
  zai: "#38bdf8",
  xai: "#b3b3b3",
  minimax: "#f0557f",
  xiaomi: "#fb923c",
  mistral: "#f5b433",
  cohere: "#c084fc",
  stepfun: "#34d399",
  stealth: "#94a3b8",
  other: "#7c7c7c",
};

export function vendorColor(id: string): string {
  return VENDOR_COLORS[id] ?? VENDOR_COLORS.other;
}
