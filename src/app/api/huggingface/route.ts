import { NextResponse } from "next/server";

const HF_API_BASE = "https://huggingface.co/api";

export async function GET() {
  try {
    // Fetch models and datasets in parallel
    const [teichModels, liontixModels, datasets] = await Promise.all([
      fetch(`${HF_API_BASE}/models?author=TeichAI&limit=100`).then(r => r.json()),
      fetch(`${HF_API_BASE}/models?author=Liontix&limit=100`).then(r => r.json()),
      fetch(`${HF_API_BASE}/datasets?author=TeichAI&limit=100`).then(r => r.json()),
    ]);

    const allModels = [...teichModels, ...liontixModels];

    // Calculate stats
    const totalDownloads = allModels.reduce((sum: number, m: { downloads: number }) => sum + m.downloads, 0) +
      datasets.reduce((sum: number, d: { downloads: number }) => sum + d.downloads, 0);
    const totalLikes = allModels.reduce((sum: number, m: { likes: number }) => sum + m.likes, 0);

    return NextResponse.json({
      models: allModels,
      datasets,
      stats: {
        totalDownloads,
        totalModels: allModels.length,
        totalDatasets: datasets.length,
        totalLikes,
      },
    }, {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    });
  } catch (error) {
    console.error("Error fetching HuggingFace data:", error);
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
  }
}
