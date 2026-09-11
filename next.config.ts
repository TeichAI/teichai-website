import type { NextConfig } from "next";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

initOpenNextCloudflareForDev();

const immutable = [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }];

// A package.json/lockfile in a parent directory makes Next infer the wrong
// workspace root, which breaks module resolution for CSS imports. Pin it.
const projectRoot = typeof __dirname !== "undefined" ? __dirname : process.cwd();

const nextConfig: NextConfig = {
  output: "standalone",
  poweredByHeader: false,
  // Dev-only: hosts allowed to load the dev server's internal resources (HMR,
  // fonts, RSC fetches). Without this, a tunnel like test.armand0e.com gets the
  // HTML but React never hydrates, so links fall back to full page loads.
  allowedDevOrigins: ["test.armand0e.com", "*.armand0e.com"],
  turbopack: {
    root: projectRoot,
  },
  outputFileTracingRoot: projectRoot,
  images: {
    // Cloudflare Workers has no sharp; serve images as-is.
    unoptimized: true,
  },
  async redirects() {
    return [
      // The static benchmark page was retired; the catalog carries live data now.
      { source: "/benchmarks", destination: "/models", permanent: true },
    ];
  },
  async headers() {
    const isDev = process.env.NODE_ENV !== "production";

    const cspHeader = `
      default-src 'self';
      script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""};
      style-src 'self' 'unsafe-inline';
      img-src 'self' blob: data: https://cdn-avatars.huggingface.co https://huggingface.co;
      font-src 'self' data:;
      connect-src 'self';
      object-src 'none';
      base-uri 'self';
      form-action 'self';
      frame-ancestors 'none';
      upgrade-insecure-requests;
    `
      .replace(/\s{2,}/g, " ")
      .trim();

    return [
      {
        source: "/(.*)",
        headers: [
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
          { key: "Content-Security-Policy", value: cspHeader },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
        ],
      },
      // Hashed build output. On Cloudflare the asset layer answers before the
      // Worker, so public/_headers carries the same rule for production.
      ...(isDev ? [] : [{ source: "/_next/static/(.*)", headers: immutable }]),
    ];
  },
};

export default nextConfig;
