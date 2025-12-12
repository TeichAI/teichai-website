// Hugging Face API integration for live model/dataset data

const HF_API_BASE = "https://huggingface.co/api";

export interface HFModel {
  id: string;
  modelId: string;
  author: string;
  sha: string;
  lastModified: string;
  private: boolean;
  disabled: boolean;
  gated: boolean;
  pipeline_tag?: string;
  tags: string[];
  downloads: number;
  likes: number;
  library_name?: string;
  createdAt: string;
}

export interface HFDataset {
  id: string;
  author: string;
  sha: string;
  lastModified: string;
  private: boolean;
  disabled: boolean;
  gated: boolean;
  tags: string[];
  downloads: number;
  likes: number;
  createdAt: string;
}

export interface HFOrgInfo {
  models: HFModel[];
  datasets: HFDataset[];
}

// Fetch all models from TeichAI org
export async function fetchTeichAIModels(): Promise<HFModel[]> {
  try {
    const response = await fetch(`${HF_API_BASE}/models?author=TeichAI&limit=100`, {
      next: { revalidate: 3600 }, // Cache for 1 hour
    });
    if (!response.ok) throw new Error("Failed to fetch models");
    return response.json();
  } catch (error) {
    console.error("Error fetching TeichAI models:", error);
    return [];
  }
}

// Fetch all datasets from TeichAI org
export async function fetchTeichAIDatasets(): Promise<HFDataset[]> {
  try {
    const response = await fetch(`${HF_API_BASE}/datasets?author=TeichAI&limit=100`, {
      next: { revalidate: 3600 },
    });
    if (!response.ok) throw new Error("Failed to fetch datasets");
    return response.json();
  } catch (error) {
    console.error("Error fetching TeichAI datasets:", error);
    return [];
  }
}

// Fetch models from Liontix org (collaborator)
export async function fetchLiontixModels(): Promise<HFModel[]> {
  try {
    const response = await fetch(`${HF_API_BASE}/models?author=Liontix&limit=100`, {
      next: { revalidate: 3600 },
    });
    if (!response.ok) throw new Error("Failed to fetch Liontix models");
    return response.json();
  } catch (error) {
    console.error("Error fetching Liontix models:", error);
    return [];
  }
}

// Fetch all org data
export async function fetchAllOrgData(): Promise<HFOrgInfo> {
  const [teichModels, liontixModels, datasets] = await Promise.all([
    fetchTeichAIModels(),
    fetchLiontixModels(),
    fetchTeichAIDatasets(),
  ]);

  return {
    models: [...teichModels, ...liontixModels],
    datasets,
  };
}

// Format download count
export function formatDownloads(downloads: number): string {
  if (downloads >= 1000000) {
    return `${(downloads / 1000000).toFixed(1)}M`;
  }
  if (downloads >= 1000) {
    return `${(downloads / 1000).toFixed(1)}K`;
  }
  return downloads.toString();
}

// Calculate total stats
export function calculateStats(models: HFModel[], datasets: HFDataset[]) {
  const totalDownloads = models.reduce((sum, m) => sum + m.downloads, 0);
  const totalLikes = models.reduce((sum, m) => sum + m.likes, 0);
  const datasetDownloads = datasets.reduce((sum, d) => sum + d.downloads, 0);

  return {
    totalDownloads: formatDownloads(totalDownloads + datasetDownloads),
    totalModels: models.length,
    totalDatasets: datasets.length,
    totalLikes: totalLikes,
  };
}

// Parse model name to extract info - dynamically extracts source model from name
export function parseModelName(modelId: string): {
  org: string;
  name: string;
  baseModel: string;
  sourceModel: string;
  params: string;
} {
  const parts = modelId.split("/");
  const org = parts[0];
  const name = parts[1] || modelId;

  // Extract base model and params dynamically
  let baseModel = "Unknown";
  let params = "Unknown";

  // Match patterns like Qwen3-4B, Qwen3-8B, etc.
  const qwenMatch = name.match(/Qwen3?-(\d+B)/i);
  if (qwenMatch) {
    baseModel = `Qwen3-${qwenMatch[1]}`;
    params = qwenMatch[1];
    if (name.includes("-A3B") || name.includes("-30B-A3B")) {
      params = "30B (3B active)";
    }
  } else if (name.includes("GPT-OSS") || name.includes("gpt-oss")) {
    baseModel = "GPT-OSS";
    const ossMatch = name.match(/(\d+)b/i);
    params = ossMatch ? `${ossMatch[1]}B` : "20B";
  }

  // Dynamically extract source model from name
  // Pattern: after base model info, look for distillation source
  const sourceModel = extractSourceModel(name);

  return { org, name, baseModel, sourceModel, params };
}

// Dynamically extract source model name from model ID
function extractSourceModel(name: string): string {
  // Remove common suffixes and prefixes to isolate the source model name
  const cleanName = name
    .replace(/-GGUF$/i, "")
    .replace(/-Distill$/i, "")
    .replace(/-Reasoning$/i, "")
    .replace(/-High$/i, "");

  // Known source model patterns (order matters - more specific first)
  const sourcePatterns: [RegExp, string][] = [
    [/DeepSeek[- ]?v?3\.?2[- ]?Speciale?/i, "DeepSeek v3.2 Speciale"],
    [/DeepSeek[- ]?v?3\.?2/i, "DeepSeek v3.2"],
    [/DeepSeek[- ]?R1/i, "DeepSeek R1"],
    [/DeepSeek/i, "DeepSeek"],
    [/Claude[- ]?4\.?5[- ]?Opus/i, "Claude Opus 4.5"],
    [/Claude[- ]?Opus[- ]?4\.?5/i, "Claude Opus 4.5"],
    [/Claude[- ]?4\.?5[- ]?Sonnet/i, "Claude Sonnet 4.5"],
    [/Claude[- ]?Sonnet[- ]?4\.?5/i, "Claude Sonnet 4.5"],
    [/Claude[- ]?Sonnet/i, "Claude Sonnet 4.5"],
    [/Gemini[- ]?3[- ]?Pro/i, "Gemini 3 Pro"],
    [/Gemini[- ]?2\.?5[- ]?Pro/i, "Gemini 2.5 Pro"],
    [/Gemini[- ]?2\.?5[- ]?Flash/i, "Gemini 2.5 Flash"],
    [/GPT[- ]?5\.?1/i, "GPT-5.1"],
    [/GPT[- ]?5[- ]?Codex/i, "GPT-5 Codex"],
    [/Kimi[- ]?K2/i, "Kimi K2"],
    [/GLM[- ]?4\.?6/i, "GLM 4.6"],
    [/Command[- ]?A/i, "Command A"],
    [/Grok/i, "Grok"],
    [/Llama[- ]?4/i, "Llama 4"],
    [/Mistral/i, "Mistral"],
  ];

  for (const [pattern, label] of sourcePatterns) {
    if (pattern.test(cleanName)) {
      return label;
    }
  }

  // Fallback: try to extract any recognizable model name pattern
  // Look for capitalized words that might be model names after removing base model prefix
  const afterBase = cleanName.replace(/^.*?(Qwen3?-\d+B|gpt-oss-\d+b)[- ]?/i, "");
  if (afterBase && afterBase !== cleanName) {
    // Clean up and format
    const formatted = afterBase
      .replace(/-/g, " ")
      .replace(/Thinking \d+/i, "")
      .replace(/\s+/g, " ")
      .trim();
    if (formatted.length > 2 && formatted.length < 50) {
      return formatted;
    }
  }

  return "Unknown";
}

// Parse dataset name to extract source model
export function parseDatasetName(datasetId: string): { name: string; sourceModel: string } {
  const name = datasetId.split("/")[1] || datasetId;
  const sourceModel = extractSourceModel(name);
  return { name, sourceModel };
}
