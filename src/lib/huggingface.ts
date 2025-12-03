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

// Parse model name to extract info
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

  // Extract base model and source from name
  let baseModel = "Unknown";
  let sourceModel = "Unknown";
  let params = "Unknown";

  if (name.includes("Qwen3-4B")) {
    baseModel = "Qwen3-4B";
    params = "4B";
  } else if (name.includes("Qwen3-8B")) {
    baseModel = "Qwen3-8B";
    params = "8B";
  } else if (name.includes("Qwen3-14B")) {
    baseModel = "Qwen3-14B";
    params = "14B";
  } else if (name.includes("Qwen3-30B")) {
    baseModel = "Qwen3-30B-A3B";
    params = "30B (3B active)";
  } else if (name.includes("GPT-OSS")) {
    baseModel = "GPT-OSS";
    params = "20B (3B active)";
  }

  // Extract source model
  if (name.includes("Claude-4.5-Opus")) sourceModel = "Claude Opus 4.5";
  else if (name.includes("Claude-Sonnet") || name.includes("Claude-4.5-Sonnet")) sourceModel = "Claude Sonnet 4.5";
  else if (name.includes("Gemini-3-Pro")) sourceModel = "Gemini 3 Pro";
  else if (name.includes("Gemini-2.5-Pro")) sourceModel = "Gemini 2.5 Pro";
  else if (name.includes("Gemini-2.5-Flash")) sourceModel = "Gemini 2.5 Flash";
  else if (name.includes("GPT-5.1")) sourceModel = "GPT-5.1";
  else if (name.includes("GPT-5-Codex")) sourceModel = "GPT-5 Codex";
  else if (name.includes("Kimi-K2")) sourceModel = "Kimi K2";
  else if (name.includes("GLM-4.6")) sourceModel = "GLM 4.6";
  else if (name.includes("Command-A")) sourceModel = "Command A";

  return { org, name, baseModel, sourceModel, params };
}
