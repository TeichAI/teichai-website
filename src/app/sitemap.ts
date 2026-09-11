import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

// lastModified is omitted on purpose: this route is generated at build time,
// so a timestamp here would only ever reflect the deploy, not the content.
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${site.url}/`, changeFrequency: "daily", priority: 1 },
    { url: `${site.url}/models`, changeFrequency: "daily", priority: 0.9 },
    { url: `${site.url}/datasets`, changeFrequency: "daily", priority: 0.9 },
    { url: `${site.url}/teich`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${site.url}/about`, changeFrequency: "monthly", priority: 0.6 },
  ];
}
