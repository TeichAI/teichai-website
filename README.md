This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Railway Deployment

This app is already a good fit for Railway as a stateless Next.js service. It does not use local
disk, background workers, or a database. The only runtime dependency is outbound fetches to the
Hugging Face API.

### Recommended deployment model

Deploy it as a normal Next.js web service on Railway, not as a Railway Function:

- Railway Functions are designed for a single TypeScript file on Bun and are better for simple
  APIs, webhooks, or cron jobs.
- This repo is a full Next.js app with App Router pages, SSR, and API routes, so it should run as
  a self-hosted Next.js service.

### Config included in this repo

- `next.config.ts` uses `output: "standalone"` for self-hosted deployment.
- `npm run start` serves the generated standalone server.

### Railway setup

1. Create a new Railway project and deploy this repository.
2. Leave the build command as `npm run build`.
3. Leave the start command as `npm run start` unless you want to override it in Railway.
4. Generate a public domain in the service networking settings.
5. Add `NEXT_TELEMETRY_DISABLED=1` to reduce the chance of Next.js telemetry preventing the
   service from sleeping.
6. If you want Railway's sleep-based serverless mode, enable `Settings -> Deploy -> Serverless`.

### Important caveat about "serverless" on Railway

Railway's current "Serverless" mode means the service can sleep when inactive and cold-start on the
next request. It is not the same thing as converting this Next.js app into per-route serverless
functions.

Because this app makes outbound requests to Hugging Face when pages are rendered or revalidated,
the service can still wake and sleep normally, but the first request after inactivity may be slower.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
