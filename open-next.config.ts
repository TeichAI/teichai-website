import { defineCloudflareConfig } from "@opennextjs/cloudflare";

// With no incremental cache configured, OpenNext on Cloudflare re-renders every
// request and re-fetches Hugging Face each time (the `revalidate = 3600` on the
// pages has nothing to write to). To turn ISR on, create an R2 bucket and a
// Durable Object queue, then switch to:
//
//   import r2IncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/r2-incremental-cache";
//   import { withRegionalCache } from "@opennextjs/cloudflare/overrides/incremental-cache/regional-cache";
//   import doQueue from "@opennextjs/cloudflare/overrides/queue/do-queue";
//   export default defineCloudflareConfig({
//     incrementalCache: withRegionalCache(r2IncrementalCache, { mode: "long-lived" }),
//     queue: doQueue,
//     enableCacheInterception: true,
//   });
//
// and add the matching bindings to wrangler.jsonc (see the comments there).
export default defineCloudflareConfig();
