// Generates the OpenGraph / Twitter card image at src/app/opengraph-image.png,
// using the vectorized mark from src/lib/logo-paths.ts drawn as the same glowing
// outline the hero uses.
// Usage: npm run og
import sharp from "sharp";
import { readFileSync, renameSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const W = 1200;
const H = 630;

// Pull the traced paths out of the generated TypeScript module.
const paths = readFileSync(path.join(root, "src", "lib", "logo-paths.ts"), "utf8");
const geometry = readFileSync(path.join(root, "src", "lib", "logo-geometry.ts"), "utf8");
const viewBox = geometry.match(/LOGO_VIEWBOX = "([^"]+)"/)[1];
const groups = JSON.parse(paths.match(/LOGO_GROUPS[^=]*= (\[.*\]);/s)[1]);
const nodes = JSON.parse(geometry.match(/LOGO_NODES[^=]*= (\[.*?\]);/s)[1]);

const MARK_H = 380;
const [, , vw, vh] = viewBox.split(" ").map(Number);
const MARK_W = Math.round((MARK_H * vw) / vh);

const outline = (stroke, width, opacity = 1) =>
  groups
    .map((g) => `<path d="${g.d}" fill="none" stroke="${stroke}" stroke-width="${width}" stroke-opacity="${opacity}" stroke-linejoin="round"/>`)
    .join("");
const dots = nodes
  .map((n) => `<circle cx="${n.x}" cy="${n.y}" r="${(n.r * 0.5).toFixed(1)}" fill="#ff8a1f"/>`)
  .join("");

const markSvg = `
<svg xmlns="http://www.w3.org/2000/svg" width="${MARK_W}" height="${MARK_H}" viewBox="${viewBox}">
  ${outline("#ff4c00", 16)}
  ${dots}
</svg>`;
const haloSvg = `
<svg xmlns="http://www.w3.org/2000/svg" width="${MARK_W}" height="${MARK_H}" viewBox="${viewBox}">
  ${outline("#ff5a00", 22, 0.45)}
</svg>`;

const mark = await sharp(Buffer.from(markSvg)).png().toBuffer();
const PAD = 120;
const halo = await sharp(Buffer.from(haloSvg))
  .extend({ top: PAD, bottom: PAD, left: PAD, right: PAD, background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .blur(30)
  .png()
  .toBuffer();

const bg = `
<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="g" cx="80%" cy="48%" r="52%">
      <stop offset="0%" stop-color="#ff4c00" stop-opacity="0.2"/>
      <stop offset="60%" stop-color="#ff4c00" stop-opacity="0.06"/>
      <stop offset="100%" stop-color="#0c0a09" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="t" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#ff4c00"/>
      <stop offset="100%" stop-color="#ffb35c"/>
    </linearGradient>
    <pattern id="dots" width="26" height="26" patternUnits="userSpaceOnUse">
      <circle cx="1" cy="1" r="1" fill="#ffffff" fill-opacity="0.12"/>
    </pattern>
  </defs>
  <rect width="${W}" height="${H}" fill="#0c0a09"/>
  <rect width="${W}" height="${H}" fill="url(#dots)"/>
  <rect width="${W}" height="${H}" fill="url(#g)"/>
  <g font-family="Segoe UI, Inter, Helvetica, Arial, sans-serif">
    <text x="80" y="150" font-size="22" font-weight="600" letter-spacing="5" fill="#ff4c00">OPEN DISTILLATION LAB</text>
    <text x="80" y="255" font-size="78" font-weight="700" fill="#f6f0ea">Teich<tspan fill="#ff4c00">AI</tspan></text>
    <text x="80" y="330" font-size="38" font-weight="500" fill="#f6f0ea">Frontier reasoning, <tspan fill="url(#t)">distilled</tspan></text>
    <text x="80" y="380" font-size="38" font-weight="500" fill="#f6f0ea">into models you can run at home.</text>
    <text x="80" y="470" font-size="22" fill="#b9aea3">Open weights · open datasets · open tooling</text>
    <text x="80" y="510" font-size="22" fill="#7f746a">teichai.com  ·  huggingface.co/TeichAI</text>
  </g>
</svg>`;

const markLeft = W - MARK_W - 110;
const markTop = Math.round((H - MARK_H) / 2);
const out = path.join(root, "src", "app", "opengraph-image.png");
const tmp = `${out}.tmp`;
await sharp(Buffer.from(bg))
  .composite([
    { input: halo, left: markLeft - PAD, top: markTop - PAD },
    { input: mark, left: markLeft, top: markTop },
  ])
  .png({ compressionLevel: 9 })
  .toFile(tmp);
renameSync(tmp, out);
console.log(`wrote ${path.relative(root, out)} (${W}x${H})`);
