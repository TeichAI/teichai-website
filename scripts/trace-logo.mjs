// Vectorizes the TeichAI mark (assets/logo-source.png) into real SVG paths,
// detects the ring "node" centers, and writes src/lib/logo-paths.ts.
// Usage: npm run trace-logo   (or: node scripts/trace-logo.mjs [path/to/logo.png])
import sharp from "sharp";
import potrace from "potrace";
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const src = process.argv[2] ?? path.join(root, "assets", "logo-source.png");

// 1. Build a clean black-on-white mask from the alpha channel.
const { data, info } = await sharp(src).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const { width: W, height: H } = info;
const mask = new Uint8Array(W * H);
for (let i = 0; i < W * H; i++) mask[i] = data[i * 4 + 3] > (Number(process.env.ALPHA_T) || 24) ? 1 : 0;

const maskPng = await sharp(Buffer.from(mask.map((v) => (v ? 0 : 255))), {
  raw: { width: W, height: H, channels: 1 },
})
  .png()
  .toBuffer();

// 2. Trace the silhouette.
const svg = await new Promise((resolve, reject) => {
  potrace.trace(
    maskPng,
    { threshold: 128, turdSize: 40, optTolerance: 0.3, alphaMax: 1, color: "#000", background: "transparent" },
    (err, out) => (err ? reject(err) : resolve(out)),
  );
});
const d = svg.match(/<path[^>]*d="([^"]+)"/)?.[1];
if (!d) throw new Error("no path in potrace output");

// 3. Find enclosed holes (ring interiors): background components not touching the border.
const label = new Int32Array(W * H).fill(-1);
const comps = [];
const stack = new Int32Array(W * H);
for (let start = 0; start < W * H; start++) {
  if (mask[start] || label[start] !== -1) continue;
  const id = comps.length;
  let sp = 0;
  stack[sp++] = start;
  label[start] = id;
  let n = 0, sx = 0, sy = 0, touchesBorder = false;
  let minX = W, maxX = 0, minY = H, maxY = 0;
  while (sp > 0) {
    const p = stack[--sp];
    const x = p % W, y = (p / W) | 0;
    n++; sx += x; sy += y;
    if (x < minX) minX = x; if (x > maxX) maxX = x; if (y < minY) minY = y; if (y > maxY) maxY = y;
    if (x === 0 || y === 0 || x === W - 1 || y === H - 1) touchesBorder = true;
    const nb = [p - 1, p + 1, p - W, p + W];
    if (x === 0) nb[0] = -1; if (x === W - 1) nb[1] = -1; if (y === 0) nb[2] = -1; if (y === H - 1) nb[3] = -1;
    for (const q of nb) if (q >= 0 && !mask[q] && label[q] === -1) { label[q] = id; stack[sp++] = q; }
  }
  comps.push({ n, cx: sx / n, cy: sy / n, touchesBorder, w: maxX - minX + 1, h: maxY - minY + 1 });
}
const holes = comps
  .filter((c) => !c.touchesBorder && c.n > 200)
  .filter((c) => Math.abs(c.w - c.h) / Math.max(c.w, c.h) < 0.25) // roughly round
  .map((c) => ({ x: +c.cx.toFixed(1), y: +c.cy.toFixed(1), r: +(Math.max(c.w, c.h) / 2).toFixed(1) }));

// The mark is left/right symmetric about its spine. Rings whose interior
// touches the outside through an anti-aliased gap are recovered by mirroring.
const spineX = holes.reduce((s, h) => s + h.x, 0) / holes.length;
for (const h of [...holes]) {
  const mx = +(2 * spineX - h.x).toFixed(1);
  if (Math.abs(mx - h.x) < 20) continue;
  if (!holes.some((o) => Math.hypot(o.x - mx, o.y - h.y) < 25)) holes.push({ x: mx, y: h.y, r: h.r });
}
holes.sort((a, b) => a.y - b.y || a.x - b.x);

// 3b. Split the traced path into contours, attach each hole to the outer
// contour that contains it, and sample the source alpha so intentionally
// translucent branches keep their dimmer look.
const contours = d
  .split(/(?=M)/)
  .map((s) => s.trim())
  .filter(Boolean)
  .map((s) => {
    const nums = s.match(/-?\d+(?:\.\d+)?/g).map(Number);
    let bx0 = Infinity, by0 = Infinity, bx1 = -Infinity, by1 = -Infinity;
    for (let i = 0; i + 1 < nums.length; i += 2) {
      const x = nums[i], y = nums[i + 1];
      if (x < bx0) bx0 = x; if (x > bx1) bx1 = x; if (y < by0) by0 = y; if (y > by1) by1 = y;
    }
    return { d: s, bx0, by0, bx1, by1, area: (bx1 - bx0) * (by1 - by0) };
  });
const contains = (a, b) => a !== b && a.bx0 <= b.bx0 && a.by0 <= b.by0 && a.bx1 >= b.bx1 && a.by1 >= b.by1 && a.area > b.area;
const outers = contours.filter((c) => !contours.some((o) => contains(o, c)));
const groups = outers.map((o) => {
  const members = [o, ...contours.filter((c) => contains(o, c))];
  // Fully opaque pixels mark a solid piece; a piece with almost none of them is
  // one of the artwork's translucent branches, drawn at its own mean alpha.
  let solid = 0, n = 0, dimSum = 0, dimN = 0;
  const x0 = Math.max(0, Math.floor(o.bx0)), x1 = Math.min(W - 1, Math.ceil(o.bx1));
  const y0 = Math.max(0, Math.floor(o.by0)), y1 = Math.min(H - 1, Math.ceil(o.by1));
  for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) {
    const i = y * W + x;
    if (!mask[i]) continue;
    const a = data[i * 4 + 3];
    n++;
    if (a > 200) solid++; else { dimSum += a; dimN++; }
  }
  const isSolid = n > 0 && solid / n > 0.4;
  const alpha = isSolid ? 1 : +Math.min(1, Math.max(0.3, (dimN ? dimSum / dimN : 255) / 255)).toFixed(2);
  return { d: members.map((m) => m.d).join(" "), alpha };
});
console.log("contour groups:", groups.map((g) => g.alpha));

// 4. Bounding box of the ink, for a tight viewBox.
let minX = W, maxX = 0, minY = H, maxY = 0;
for (let i = 0; i < W * H; i++) if (mask[i]) { const x = i % W, y = (i / W) | 0; if (x < minX) minX = x; if (x > maxX) maxX = x; if (y < minY) minY = y; if (y > maxY) maxY = y; }

const viewBox = `${minX} ${minY} ${maxX - minX + 1} ${maxY - minY + 1}`;

// Small geometry module: safe to import from client components.
const geometry = `// Generated by scripts/trace-logo.mjs from assets/logo-source.png. Do not edit by hand.
export const LOGO_VIEWBOX = "${viewBox}";
export const LOGO_WIDTH = ${W};
export const LOGO_HEIGHT = ${H};
// Ring terminals of the mark, in viewBox units.
export const LOGO_NODES: Array<{ x: number; y: number; r: number }> = ${JSON.stringify(holes)};
`;
writeFileSync(path.join(root, "src", "lib", "logo-geometry.ts"), geometry);

// Heavy path data: rendered once into an SVG sprite by a server component.
const out = `// Generated by scripts/trace-logo.mjs from assets/logo-source.png. Do not edit by hand.
export { LOGO_VIEWBOX, LOGO_WIDTH, LOGO_HEIGHT, LOGO_NODES } from "./logo-geometry";
export const LOGO_PATH = "${d.replace(/\s+/g, " ").trim()}";
// One entry per connected piece of the mark: its path (outer contour plus holes)
// and the opacity it is drawn with in the original artwork.
export const LOGO_GROUPS: Array<{ d: string; alpha: number }> = ${JSON.stringify(groups)};
`;
writeFileSync(path.join(root, "src", "lib", "logo-paths.ts"), out);
writeFileSync(path.join(root, "scripts", ".logo-trace-preview.svg"), svg);
console.log(`traced ${W}x${H}: path ${d.length} chars, ${holes.length} ring nodes, viewBox ${minX} ${minY} ${maxX - minX + 1} ${maxY - minY + 1}`);
console.log(holes);
