import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = "https://teichai.com";

    return [
        {
            url: baseUrl,
            lastModified: new Date(),
        },
        {
            url: `${baseUrl}/about`,
            lastModified: new Date(),
        },
        {
            url: `${baseUrl}/models`,
            lastModified: new Date(),
        },
        {
            url: `${baseUrl}/datasets`,
            lastModified: new Date(),
        },
        {
            url: `${baseUrl}/benchmarks`,
            lastModified: new Date(),
        },
    ];
}
