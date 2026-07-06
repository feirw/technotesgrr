/**
 * Generates the PWA icon set (any + maskable + apple-touch-icon) from the brand
 * heart logo (run: bun scripts/generate-pwa-icons.mjs). Requires sharp in frontend/.
 */
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { mkdirSync } from 'node:fs';
import { createRequire } from 'node:module';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const FRONTEND = path.join(ROOT, 'frontend');
const require = createRequire(import.meta.url);
const sharp = require(path.join(FRONTEND, 'node_modules/sharp'));
const SRC = path.join(FRONTEND, 'public/images/logo.png');
const OUT = path.join(FRONTEND, 'public/icons');

const CORAL = { r: 0xff, g: 0x97, b: 0xb2, alpha: 1 }; // #ff97b2

async function squareOnTransparent(size, padFraction) {
  const inner = Math.round(size * (1 - padFraction * 2));
  const resized = await sharp(SRC)
    .resize(inner, inner, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .toBuffer();
  return sharp({
    create: { width: size, height: size, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } },
  })
    .composite([{ input: resized, gravity: 'center' }])
    .png()
    .toBuffer();
}

async function squareOnColor(size, bg, padFraction) {
  const inner = Math.round(size * (1 - padFraction * 2));
  const resized = await sharp(SRC)
    .resize(inner, inner, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .toBuffer();
  return sharp({
    create: { width: size, height: size, channels: 4, background: bg },
  })
    .composite([{ input: resized, gravity: 'center' }])
    .png()
    .toBuffer();
}

async function main() {
  mkdirSync(OUT, { recursive: true });

  for (const size of [72, 96, 128, 144, 152, 192, 384, 512]) {
    const buf = await squareOnTransparent(size, 0.06);
    await sharp(buf).toFile(path.join(OUT, `icon-${size}.png`));
  }

  for (const size of [192, 512]) {
    const buf = await squareOnColor(size, CORAL, 0.18);
    await sharp(buf).toFile(path.join(OUT, `maskable-icon-${size}.png`));
  }

  const appleBuf = await squareOnColor(180, { r: 255, g: 255, b: 255, alpha: 1 }, 0.1);
  await sharp(appleBuf).flatten({ background: '#ffffff' }).toFile(path.join(FRONTEND, 'public/apple-touch-icon.png'));

  const favBuf = await squareOnTransparent(512, 0.06);
  await sharp(favBuf).toFile(path.join(FRONTEND, 'public/favicon.png'));

  console.log('PWA icon set generated in public/icons/, apple-touch-icon.png and favicon.png refreshed.');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
