// Starts the production server from the standalone build (output: "standalone").
// `next start` refuses to run in standalone mode, and the standalone server
// expects .next/static and public/ next to it, so this copies them in and
// launches node .next/standalone/server.js.
// Usage: npm run start   (PORT and HOSTNAME env vars are honoured)
import { cpSync, existsSync } from "node:fs";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const standalone = path.join(root, ".next", "standalone");
const server = path.join(standalone, "server.js");

if (!existsSync(server)) {
  console.error("No standalone build found. Run `npm run build:next` first.");
  process.exit(1);
}

cpSync(path.join(root, ".next", "static"), path.join(standalone, ".next", "static"), { recursive: true });
if (existsSync(path.join(root, "public"))) {
  cpSync(path.join(root, "public"), path.join(standalone, "public"), { recursive: true });
}

const child = spawn(process.execPath, [server], {
  cwd: standalone,
  stdio: "inherit",
  env: {
    ...process.env,
    NODE_ENV: "production",
    PORT: process.env.PORT || "3000",
    HOSTNAME: process.env.HOSTNAME || "0.0.0.0",
  },
});
child.on("exit", (code) => process.exit(code ?? 0));
