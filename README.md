# teichai.com

The website for [TeichAI](https://huggingface.co/TeichAI), an open distillation lab. Everything on the site is
derived live from the Hugging Face API, so publishing a model or dataset to the org is all it takes to update
the catalog.

## What the site does

- **Models** — every repository in the org is parsed and grouped into *releases* (the safetensors, GGUF and
  LoRA repos of one fine-tune become one card). Teacher model, teacher lab, base family, parameter count,
  context length, quant list, vision projector and Ollama Modelfile are all detected automatically.
- **Datasets** — reasoning, agent and chat datasets with source model, sample count, license and cross-links
  to the models trained on them.
- **Home** — live org telemetry, a base × teacher distillation matrix, release cadence, leaderboards, the
  pipeline, and the `teich` toolkit.
- **`/api/huggingface`** — the normalized snapshot as JSON for anyone who wants it.

Data is fetched with a one-hour revalidation window. Team roster, links and copy live in
[`src/lib/site.ts`](src/lib/site.ts). Name-parsing rules (teachers, labs, base families) live in
[`src/lib/taxonomy.ts`](src/lib/taxonomy.ts); add a pattern there when a new frontier model shows up.

## Development

```bash
npm install
npm run dev
```

Open <http://localhost:3000>.

```bash
npm run lint        # eslint
npx tsc --noEmit    # type-check
npm run build       # next build + OpenNext (Cloudflare) bundle
npm run preview     # run the Cloudflare build locally
npm run deploy      # deploy with wrangler
```

## Stack

Next.js 16 (App Router, React 19), Tailwind CSS v4, Radix primitives, framer-motion, deployed to Cloudflare
Workers via OpenNext.
