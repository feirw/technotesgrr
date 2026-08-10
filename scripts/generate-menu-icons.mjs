/**
 * Resize menu/category pixel icons to 96×96 WebP (~2–8 KB vs 40–190 KB PNG).
 * Run: bun scripts/generate-menu-icons.mjs
 */
import { readdirSync, existsSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const sharp = require('../frontend/node_modules/sharp');

const __dirname = dirname(fileURLToPath(import.meta.url));
const ICON_DIR = join(__dirname, '..', 'frontend', 'public', 'images', 'home page');
const SIZE = 96;

const files = readdirSync(ICON_DIR).filter((f) => /^\d+\.png$/i.test(f));

let created = 0;
let skipped = 0;

for (const file of files) {
  const input = join(ICON_DIR, file);
  const base = file.replace(/\.png$/i, '');
  const output = join(ICON_DIR, `${base}-96.webp`);

  if (existsSync(output)) {
    skipped += 1;
    continue;
  }

  await sharp(input)
    .resize(SIZE, SIZE, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .webp({ quality: 82, effort: 4 })
    .toFile(output);

  created += 1;
  console.log(`✓ ${file} → ${base}-96.webp`);
}

console.log(`Done: ${created} created, ${skipped} already existed (${files.length} PNG icons).`);
