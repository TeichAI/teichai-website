import { NextResponse } from "next/server";
import { getSnapshot } from "@/lib/hf";

export const revalidate = 3600;

// Public JSON mirror of the normalized org snapshot: grouped releases,
// datasets, stats, timeline and the base × teacher matrix.
export async function GET() {
  try {
    const snapshot = await getSnapshot();
    if (snapshot.degraded) {
      // Never let a partial snapshot be cached as if it were complete.
      return NextResponse.json(
        { error: "Hugging Face is temporarily unavailable", fetchedAt: snapshot.fetchedAt },
        { status: 503, headers: { "Cache-Control": "no-store", "Retry-After": "120" } },
      );
    }
    return NextResponse.json(snapshot, {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (error) {
    console.error("Error building snapshot:", error);
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
  }
}
