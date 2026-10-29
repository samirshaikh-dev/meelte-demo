/**
 * Meelte — OpenGraph / social share card generator.
 *
 * Produces `public/og-image.png` (1200×630) from the transparent brand logo
 * (`public/transparent_logo_meelTe.png`) so WhatsApp, Facebook, LinkedIn,
 * Slack, X and iMessage render a branded, correctly sized link preview.
 *
 * Why a committed PNG instead of a runtime-generated card:
 * - social crawlers do not run JavaScript, so the file must exist as a static asset
 * - WhatsApp rejects/ignores images above ~600KB — the source logo alone is 1.3MB
 * - WhatsApp, Facebook and X cache the image URL, so a stable path is safer than a
 *   hashed metadata-route URL
 *
 * Colours are read from the design tokens in `src/app/globals.css`
 * (see docs/Design.md §2.1 — globals.css is the source of truth for anything CSS renders).
 *
 * Usage: npm run og:image
 * Requires `sharp`, which ships with Next.js as an optional dependency (used by next/image).
 */

import { readFile, writeFile, stat } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import sharp from "sharp";

const ROOT = process.cwd();
const TOKENS_PATH = path.join(ROOT, "src", "app", "globals.css");
const SOURCE_LOGO = path.join(ROOT, "public", "transparent_logo_meelTe.png");
const OUTPUT = path.join(ROOT, "public", "og-image.png");

const WIDTH = 1200;
const HEIGHT = 630;
const MAX_BYTES = 600 * 1024; // WhatsApp preview ceiling

/** Read a `--color-*` token value out of the @theme block. */
async function readTokens(names) {
  const css = await readFile(TOKENS_PATH, "utf8");
  const tokens = {};

  for (const name of names) {
    const match = css.match(new RegExp(`--color-${name}:\\s*(#[0-9a-fA-F]{3,8})\\s*;`));
    if (!match) {
      throw new Error(`Token --color-${name} was not found in ${TOKENS_PATH}`);
    }
    tokens[name] = match[1];
  }

  return tokens;
}

/** rgba() string from a #RRGGBB token and an alpha value. */
function withAlpha(hex, alpha) {
  const value = hex.replace("#", "");
  const r = parseInt(value.slice(0, 2), 16);
  const g = parseInt(value.slice(2, 4), 16);
  const b = parseInt(value.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function buildBackgroundSvg({ canvas, primary, foregroundSecondary }) {
  const dot = withAlpha(primary, 0.08);
  const dotSoft = withAlpha(primary, 0.06);
  const glow = withAlpha(primary, 0.14);

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
  <defs>
    <radialGradient id="glow" cx="50%" cy="42%" r="52%">
      <stop offset="0%" stop-color="${glow}" />
      <stop offset="65%" stop-color="${withAlpha(primary, 0.04)}" />
      <stop offset="100%" stop-color="${withAlpha(primary, 0)}" />
    </radialGradient>
    <pattern id="dots" width="120" height="120" patternUnits="userSpaceOnUse">
      <circle cx="24" cy="24" r="2" fill="${dot}" />
      <circle cx="84" cy="84" r="2" fill="${dotSoft}" />
    </pattern>
  </defs>

  <rect width="${WIDTH}" height="${HEIGHT}" fill="${canvas}" />
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#dots)" />
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#glow)" />

  <text x="${WIDTH / 2}" y="510" text-anchor="middle"
    font-family="Segoe UI, system-ui, -apple-system, Arial, sans-serif"
    font-size="22" font-weight="600" letter-spacing="6"
    fill="${primary}">DISCOVER · CONNECT · CREATE · GROW</text>

  <text x="${WIDTH / 2}" y="562" text-anchor="middle"
    font-family="Segoe UI, system-ui, -apple-system, Arial, sans-serif"
    font-size="20" font-weight="400" letter-spacing="1"
    fill="${foregroundSecondary}">meelte.com · Bengaluru · Gaya · Ranchi</text>
</svg>`;
}

async function main() {
  const { canvas, primary, "foreground-secondary": foregroundSecondary } = await readTokens([
    "canvas",
    "primary",
    "foreground-secondary",
  ]);

  const background = await sharp(Buffer.from(buildBackgroundSvg({ canvas, primary, foregroundSecondary })))
    .png()
    .toBuffer();

  // Trim the transparent padding off the logo, then scale it to the card's optical height.
  const logo = await sharp(SOURCE_LOGO)
    .trim({ threshold: 10 })
    .resize({ height: 300, fit: "inside" })
    .toBuffer();

  const logoMeta = await sharp(logo).metadata();
  const left = Math.round((WIDTH - (logoMeta.width ?? 0)) / 2);
  const top = 96;

  const png = await sharp(background)
    .composite([{ input: logo, left, top }])
    .png({ compressionLevel: 9, palette: true, quality: 90, effort: 10 })
    .toBuffer();

  await writeFile(OUTPUT, png);

  const { size } = await stat(OUTPUT);
  const meta = await sharp(OUTPUT).metadata();

  console.log(`Wrote ${path.relative(ROOT, OUTPUT)} — ${meta.width}×${meta.height}, ${(size / 1024).toFixed(1)}KB`);

  if (size > MAX_BYTES) {
    throw new Error(`og-image.png is ${(size / 1024).toFixed(1)}KB — WhatsApp drops previews above 600KB.`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
