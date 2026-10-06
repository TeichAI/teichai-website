// Site-wide configuration: links, copy, and the team roster.
// Everything that is *not* derivable from Hugging Face lives here.

export const site = {
  name: "TeichAI",
  tagline: "Frontier reasoning, distilled into models you can run at home.",
  description:
    "TeichAI is an open distillation lab. We generate reasoning and agent traces from frontier models, fine-tune open-weight bases on them, and ship everything as safetensors and GGUF on Hugging Face.",
  url: "https://teichai.com",
  org: "TeichAI",
  links: {
    huggingface: "https://huggingface.co/TeichAI",
    github: "https://github.com/TeichAI",
    teichRepo: "https://github.com/TeichAI/teich",
    teichPypi: "https://pypi.org/project/teich/",
    teichDocs: "https://github.com/TeichAI/teich/tree/main/docs",
    discord: "https://discord.gg/zSsFYQBdYR",
    kofi: "https://ko-fi.com/M4M31XC0G7",
    paypal: "https://paypal.me/TeichAI",
    unsloth: "https://github.com/unslothai/unsloth",
    llamacpp: "https://github.com/ggml-org/llama.cpp",
    // Distill requests are taken on Discord.
    distillRequests: "https://discord.gg/zSsFYQBdYR",
  },
} as const;

export interface TeamMember {
  handle: string;
  role: string;
  focus?: string;
}

// Current roster. Avatars are pulled live from Hugging Face; only people
// listed here are shown, regardless of who is in the HF organization.
export const team: TeamMember[] = [
  { handle: "Liontix", role: "Co-founder", focus: "Dataset curation & model training" },
  { handle: "armand0e", role: "Co-founder", focus: "Fine-tuning, quantization & tooling" },
  { handle: "EclipseMist", role: "Core team" },
  { handle: "CompactAI", role: "Core team" },
];

export const navLinks = [
  { name: "Models", href: "/models" },
  { name: "Datasets", href: "/datasets" },
  { name: "Teich", href: "/teich" },
  { name: "About", href: "/about" },
] as const;
