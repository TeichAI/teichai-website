// TeichAI Data - Sourced from Hugging Face model READMEs

export interface Model {
  id: string;
  name: string;
  shortName: string;
  description: string;
  effectiveParams: string;
  activeParams: string;
  architecture: string;
  baseModel: string;
  dataset: string;
  useCases: string[];
  downloads: string;
  likes: number;
  license: string;
  link: string;
  quantizations: string[];
}

export interface Dataset {
  id: string;
  name: string;
  description: string;
  sourceModel: string;
  samples: string;
  cost?: string;
  totalTokens?: string;
  downloads: string;
  likes: number;
  topics: string[];
  link: string;
}

export interface Benchmark {
  model: string;
  params: string;
  activeParams: string;
  mmlu?: number;
  humaneval?: number;
  gsm8k?: number;
  arc?: number;
  hellaswag?: number;
  notes: string;
}

export const models: Model[] = [
  {
    id: "qwen3-30b-a3b-claude-sonnet",
    name: "Qwen3-30B-A3B-Thinking-2507-Claude-4.5-Sonnet-High-Reasoning-Distill-GGUF",
    shortName: "Qwen3 30B A3B Claude Sonnet 4.5",
    description: "MoE model trained on Claude Sonnet 4.5 reasoning dataset. Uses Qwen3 30B A3B architecture with only 3B active parameters for efficient inference.",
    effectiveParams: "30B",
    activeParams: "3B",
    architecture: "qwen3_moe",
    baseModel: "unsloth/Qwen3-30B-A3B-Thinking-2507",
    dataset: "TeichAI/claude-sonnet-4.5-high-reasoning-250x",
    useCases: ["Coding", "Science"],
    downloads: "3.5K",
    likes: 4,
    license: "Apache 2.0",
    link: "https://hf.co/TeichAI/Qwen3-30B-A3B-Thinking-2507-Claude-4.5-Sonnet-High-Reasoning-Distill-GGUF",
    quantizations: ["Q3_K_M", "Q4_K_M", "Q8_0", "F16"],
  },
  {
    id: "qwen3-14b-claude-sonnet",
    name: "Qwen3-14B-Claude-Sonnet-4.5-Reasoning-Distill-GGUF",
    shortName: "Qwen3 14B Claude Sonnet 4.5",
    description: "Dense 14B model distilled from Claude Sonnet 4.5 with high reasoning effort. Strong performance on coding and science tasks.",
    effectiveParams: "14B",
    activeParams: "14B",
    architecture: "qwen3",
    baseModel: "unsloth/Qwen3-14B-unsloth-bnb-4bit",
    dataset: "TeichAI/claude-sonnet-4.5-high-reasoning-250x",
    useCases: ["Coding", "Science"],
    downloads: "16.9K",
    likes: 8,
    license: "Apache 2.0",
    link: "https://hf.co/TeichAI/Qwen3-14B-Claude-Sonnet-4.5-Reasoning-Distill-GGUF",
    quantizations: ["Q3_K_M", "Q4_K_M", "Q6_K", "Q8_0"],
  },
  {
    id: "qwen3-30b-a3b-gemini-flash",
    name: "Qwen3-30B-A3B-Thinking-2507-Gemini-2.5-Flash-Distill-GGUF",
    shortName: "Qwen3 30B A3B Gemini 2.5 Flash",
    description: "MoE model capturing Gemini 2.5 Flash behavior from 11,000+ samples. Efficient 3B active parameters.",
    effectiveParams: "30B",
    activeParams: "3B",
    architecture: "qwen3_moe",
    baseModel: "unsloth/Qwen3-30B-A3B-Thinking-2507",
    dataset: "TeichAI/gemini-2.5-flash-11000x",
    useCases: ["General Purpose", "Reasoning"],
    downloads: "10.4K",
    likes: 1,
    license: "Apache 2.0",
    link: "https://hf.co/TeichAI/Qwen3-30B-A3B-Thinking-2507-Gemini-2.5-Flash-Distill-GGUF",
    quantizations: ["Q3_K_M", "Q4_K_M", "Q8_0"],
  },
  {
    id: "gpt-oss-20b-claude-sonnet",
    name: "gpt-oss-20b-claude-4.5-sonnet-high-reasoning-distill-GGUF",
    shortName: "GPT-OSS 20B Claude Sonnet 4.5",
    description: "GPT-OSS architecture with 20B effective params but only 3B active. Trained on Claude Sonnet 4.5 high reasoning dataset.",
    effectiveParams: "20B",
    activeParams: "3B",
    architecture: "gpt_oss",
    baseModel: "unsloth/gpt-oss-20b-unsloth-bnb-4bit",
    dataset: "TeichAI/claude-sonnet-4.5-high-reasoning-250x",
    useCases: ["Coding", "Science"],
    downloads: "9.7K",
    likes: 3,
    license: "Apache 2.0",
    link: "https://hf.co/TeichAI/gpt-oss-20b-claude-4.5-sonnet-high-reasoning-distill-GGUF",
    quantizations: ["Q4_K_M", "Q8_0"],
  },
  {
    id: "qwen3-8b-gemini-3-pro",
    name: "Qwen3-8B-Gemini-3-Pro-Preview-Distill-GGUF",
    shortName: "Qwen3 8B Gemini 3 Pro",
    description: "Compact 8B model trained on Gemini 3 Pro Preview dataset. Dataset cost ~$32.7 USD with 2.73M tokens.",
    effectiveParams: "8B",
    activeParams: "8B",
    architecture: "qwen3",
    baseModel: "unsloth/Qwen3-8B-unsloth-bnb-4bit",
    dataset: "TeichAI/gemini-3-pro-preview-high-reasoning-250x",
    useCases: ["Coding", "Science"],
    downloads: "3.8K",
    likes: 11,
    license: "Apache 2.0",
    link: "https://hf.co/TeichAI/Qwen3-8B-Gemini-3-Pro-Preview-Distill-GGUF",
    quantizations: ["Q3_K_M", "Q4_K_M", "Q6_K", "Q8_0"],
  },
  {
    id: "qwen3-8b-claude-sonnet",
    name: "Qwen3-8B-Claude-Sonnet-4.5-Reasoning-Distill-GGUF",
    shortName: "Qwen3 8B Claude Sonnet 4.5",
    description: "Efficient 8B model with Claude Sonnet 4.5 reasoning capabilities. Good balance of size and performance.",
    effectiveParams: "8B",
    activeParams: "8B",
    architecture: "qwen3",
    baseModel: "unsloth/Qwen3-8B-unsloth-bnb-4bit",
    dataset: "TeichAI/claude-sonnet-4.5-high-reasoning-250x",
    useCases: ["Coding", "Science"],
    downloads: "5.8K",
    likes: 3,
    license: "Apache 2.0",
    link: "https://hf.co/TeichAI/Qwen3-8B-Claude-Sonnet-4.5-Reasoning-Distill-GGUF",
    quantizations: ["Q4_K_M", "Q8_0"],
  },
  {
    id: "qwen3-4b-claude-opus",
    name: "Qwen3-4B-Thinking-2507-Claude-4.5-Opus-High-Reasoning-Distill",
    shortName: "Qwen3 4B Claude Opus 4.5",
    description: "Small but capable 4B model trained on Claude Opus 4.5 (the most capable Claude). Dataset cost ~$52.3 USD.",
    effectiveParams: "4B",
    activeParams: "4B",
    architecture: "qwen3",
    baseModel: "unsloth/Qwen3-4B-Thinking-2507",
    dataset: "TeichAI/claude-4.5-opus-high-reasoning-250x",
    useCases: ["Coding", "Science", "General Purpose"],
    downloads: "92",
    likes: 1,
    license: "Apache 2.0",
    link: "https://hf.co/TeichAI/Qwen3-4B-Thinking-2507-Claude-4.5-Opus-High-Reasoning-Distill",
    quantizations: ["Q4_K_M", "Q8_0"],
  },
  {
    id: "qwen3-8b-kimi-k2",
    name: "Qwen3-8B-Kimi-K2-Thinking-Distill-GGUF",
    shortName: "Qwen3 8B Kimi K2",
    description: "Distilled from MoonshotAI's Kimi K2 Thinking model. Captures unique reasoning patterns.",
    effectiveParams: "8B",
    activeParams: "8B",
    architecture: "qwen3",
    baseModel: "unsloth/Qwen3-8B-unsloth-bnb-4bit",
    dataset: "TeichAI/kimi-k2-thinking-1000x",
    useCases: ["Reasoning", "General Purpose"],
    downloads: "1.3K",
    likes: 0,
    license: "Apache 2.0",
    link: "https://hf.co/TeichAI/Qwen3-8B-Kimi-K2-Thinking-Distill-GGUF",
    quantizations: ["Q4_K_M", "Q8_0"],
  },
];

export const datasets: Dataset[] = [
  {
    id: "claude-sonnet-4.5-250x",
    name: "claude-sonnet-4.5-high-reasoning-250x",
    description: "Reasoning dataset created using Claude Sonnet 4.5 with high reasoning effort. Questions sourced from reedmayhew and generated prompts.",
    sourceModel: "Claude Sonnet 4.5",
    samples: "247",
    downloads: "700",
    likes: 22,
    topics: ["Web Development", "Math", "Science", "Coding"],
    link: "https://hf.co/datasets/TeichAI/claude-sonnet-4.5-high-reasoning-250x",
  },
  {
    id: "claude-opus-4.5-250x",
    name: "claude-4.5-opus-high-reasoning-250x",
    description: "Premium reasoning dataset from Claude Opus 4.5 - Anthropic's most capable model. High reasoning depth setting.",
    sourceModel: "Claude Opus 4.5",
    samples: "250",
    cost: "$52.3",
    totalTokens: "2.13M",
    downloads: "114",
    likes: 7,
    topics: ["Coding", "Science", "General Purpose"],
    link: "https://hf.co/datasets/TeichAI/claude-4.5-opus-high-reasoning-250x",
  },
  {
    id: "gemini-3-pro-1000x",
    name: "gemini-3-pro-preview-high-reasoning-1000x",
    description: "1000+ samples from Google's Gemini 3 Pro Preview with high reasoning depth. Covers diverse topics.",
    sourceModel: "Gemini 3 Pro Preview",
    samples: "1000+",
    downloads: "264",
    likes: 6,
    topics: ["Web Development", "Math", "Science"],
    link: "https://hf.co/datasets/TeichAI/gemini-3-pro-preview-high-reasoning-1000x",
  },
  {
    id: "gemini-2.5-flash-11000x",
    name: "gemini-2.5-flash-11000x",
    description: "Massive dataset with 11,000+ queries to Gemini 2.5 Flash. Captures behavior, reasoning traces, and output style.",
    sourceModel: "Gemini 2.5 Flash",
    samples: "11,000+",
    downloads: "117",
    likes: 2,
    topics: ["General Purpose", "Reasoning"],
    link: "https://hf.co/datasets/TeichAI/gemini-2.5-flash-11000x",
  },
  {
    id: "gpt-5.1-1000x",
    name: "gpt-5.1-high-reasoning-1000x",
    description: "Reasoning dataset from OpenAI's GPT 5.1 with high reasoning mode enabled.",
    sourceModel: "GPT 5.1",
    samples: "1000+",
    downloads: "139",
    likes: 3,
    topics: ["Web Development", "Math", "Science"],
    link: "https://hf.co/datasets/TeichAI/gpt-5.1-high-reasoning-1000x",
  },
  {
    id: "kimi-k2-1000x",
    name: "kimi-k2-thinking-1000x",
    description: "Reasoning dataset from MoonshotAI's Kimi K2 Thinking model. Unique reasoning patterns from Chinese AI lab.",
    sourceModel: "Kimi K2 Thinking",
    samples: "1000+",
    downloads: "151",
    likes: 2,
    topics: ["Web Development", "Math", "Science"],
    link: "https://hf.co/datasets/TeichAI/kimi-k2-thinking-1000x",
  },
  {
    id: "gpt-5-codex-250x",
    name: "gpt-5-codex-250x",
    description: "Coding-focused dataset from OpenAI's GPT 5 Codex. Specialized for code generation and understanding.",
    sourceModel: "GPT 5 Codex",
    samples: "250",
    downloads: "249",
    likes: 8,
    topics: ["Coding", "Web Development"],
    link: "https://hf.co/datasets/TeichAI/gpt-5-codex-250x",
  },
];

// Benchmark data - these are representative comparisons
// Note: Actual benchmark scores vary by task and evaluation method
export const benchmarks: Benchmark[] = [
  {
    model: "Qwen3 30B A3B Claude Sonnet 4.5",
    params: "30B",
    activeParams: "3B",
    notes: "MoE architecture - efficient inference with 3B active params",
  },
  {
    model: "Qwen3 14B Claude Sonnet 4.5",
    params: "14B",
    activeParams: "14B",
    notes: "Dense model - highest quality Claude distillation",
  },
  {
    model: "GPT-OSS 20B Claude Sonnet 4.5",
    params: "20B",
    activeParams: "3B",
    notes: "GPT-OSS architecture with efficient MoE",
  },
  {
    model: "Qwen3 8B Gemini 3 Pro",
    params: "8B",
    activeParams: "8B",
    notes: "Best value - compact size with strong reasoning",
  },
  {
    model: "Qwen3 8B Claude Sonnet 4.5",
    params: "8B",
    activeParams: "8B",
    notes: "Balanced size and Claude reasoning capability",
  },
  {
    model: "Qwen3 4B Claude Opus 4.5",
    params: "4B",
    activeParams: "4B",
    notes: "Smallest model trained on most capable Claude",
  },
];

export const stats = {
  totalDownloads: "55K+",
  totalModels: 20,
  totalDatasets: 19,
  totalLikes: 100,
};

export const team = [
  {
    name: "Liontix",
    role: "Co-Founder",
    focus: "Dataset curation & model training",
    link: "https://huggingface.co/Liontix",
  },
  {
    name: "armand0e",
    role: "Co-Founder",
    focus: "Fine-tuning & quantization",
    link: "https://huggingface.co/armand0e",
  },
  {
    name: "owenqwenllmwine",
    role: "Co-Founder",
    focus: "Research & development",
    link: "https://huggingface.co/owenqwenllmwine",
  },
];
