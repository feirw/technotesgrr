/**
 * Generates 1200×630 OG PNGs from seoConfig (run: bun scripts/generate-og-images.mjs).
 * Requires: bun add -d sharp (in frontend/)
 */
import { mkdirSync, existsSync, readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const sharp = require('../frontend/node_modules/sharp');
import { ALL_OG_PAGES } from '../frontend/src/seo/seoConfig.ts';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const PUBLIC = join(ROOT, 'frontend', 'public');
const OUT_DIR = join(PUBLIC, 'og', 'pages');
const DEFAULT_OUT = join(PUBLIC, 'og', 'default.png');

const LOGO_CANDIDATES = [
  join(PUBLIC, 'images', 'logo.png'),
  join(PUBLIC, 'favicon.png'),
];

function escapeXml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function wrapLines(text, maxChars = 28) {
  const words = text.split(/\s+/);
  const lines = [];
  let line = '';
  for (const word of words) {
    const next = line ? `${line} ${word}` : word;
    if (next.length > maxChars && line) {
      lines.push(line);
      line = word;
    } else {
      line = next;
    }
  }
  if (line) lines.push(line);
  return lines.slice(0, 3);
}

function buildSvg(headline, subtitle = 'Πληροφορική για τις Πανελλήνιες', logoDataUri) {
  const lines = wrapLines(headline);
  const lineEls = lines
    .map(
      (line, i) =>
        `<text x="600" y="${300 + i * 58}" text-anchor="middle" fill="#ffffff" font-family="Segoe UI, Arial, sans-serif" font-size="46" font-weight="800">${escapeXml(line)}</text>`,
    )
    .join('\n');

  const logoBlock = logoDataUri
    ? `<image href="${logoDataUri}" x="520" y="72" width="160" height="160" preserveAspectRatio="xMidYMid meet"/>`
    : `<text x="600" y="150" text-anchor="middle" fill="#ffffff" font-family="Segoe UI, Arial, sans-serif" font-size="72" font-weight="900">Technotes</text>`;

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#ff97b2"/>
      <stop offset="55%" stop-color="#f07f97"/>
      <stop offset="100%" stop-color="#e06d88"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <rect x="48" y="48" width="1104" height="534" rx="32" fill="none" stroke="rgba(255,255,255,0.35)" stroke-width="4"/>
  ${logoBlock}
  ${lineEls}
  <text x="600" y="520" text-anchor="middle" fill="rgba(255,255,255,0.92)" font-family="Segoe UI, Arial, sans-serif" font-size="30" font-weight="600">${escapeXml(subtitle)}</text>
  <text x="600" y="565" text-anchor="middle" fill="rgba(255,255,255,0.75)" font-family="Segoe UI, Arial, sans-serif" font-size="24" font-weight="500">technotes.gr</text>
</svg>`;
}

function loadLogoDataUri() {
  for (const path of LOGO_CANDIDATES) {
    if (!existsSync(path)) continue;
    const buf = readFileSync(path);
    const ext = path.endsWith('.png') ? 'png' : 'jpeg';
    return `data:image/${ext};base64,${buf.toString('base64')}`;
  }
  return null;
}

async function renderPng(svg, outPath) {
  mkdirSync(dirname(outPath), { recursive: true });
  await sharp(Buffer.from(svg)).png({ quality: 90 }).toFile(outPath);
}

const logoDataUri = loadLogoDataUri();

mkdirSync(OUT_DIR, { recursive: true });
mkdirSync(dirname(DEFAULT_OUT), { recursive: true });

const home = ALL_OG_PAGES.find((p) => p.slug === 'home') ?? ALL_OG_PAGES[0];
await renderPng(
  buildSvg('Technotes', 'Πληροφορική για τις Πανελλήνιες', logoDataUri),
  DEFAULT_OUT,
);

for (const page of ALL_OG_PAGES) {
  if (page.noindex) continue;
  const headline = page.ogTitle ?? page.title.replace(/\s*\|\s*Technotes.*$/i, '').trim();
  const svg = buildSvg(headline, 'Πληροφορική για τις Πανελλήνιες', logoDataUri);
  const outPath = join(OUT_DIR, `${page.slug}.png`);
  await renderPng(svg, outPath);
  console.log('OG:', outPath);
}

console.log('Done — default +', ALL_OG_PAGES.filter((p) => !p.noindex).length, 'page images');
