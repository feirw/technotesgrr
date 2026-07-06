/**
 * Generates source images for @capacitor/assets (run: bun scripts/generate-capacitor-assets.mjs).
 * Outputs to frontend/assets/ — the raw 1024px+ sources that
 * `cd frontend && npx capacitor-assets generate` resizes into every
 * Android/iOS icon & splash size.
 */
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { mkdirSync } from 'node:fs';
import { createRequire } from 'node:module';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const FRONTEND = path.join(ROOT, 'frontend');
const OUT = path.join(FRONTEND, 'assets');
const SRC = path.join(FRONTEND, 'public/images/logo.png');

const require = createRequire(import.meta.url);
const sharp = require(path.join(FRONTEND, 'node_modules/sharp'));

const CORAL = { r: 0xff, g: 0x97, b: 0xb2, alpha: 1 }; // #ff97b2
const WASH = { r: 0xff, g: 0xf5, b: 0xf8, alpha: 1 }; // #fff5f8

async function logoOnTransparent(size, padFraction) {
  const inner = Math.round(size * (1 - padFraction * 2));
  const resized = await sharp(SRC)
    .resize(inner, inner, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .toBuffer();
  return sharp({ create: { width: size, height: size, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } })
    .composite([{ input: resized, gravity: 'center' }])
    .png()
    .toBuffer();
}

async function logoOnColor(size, bg, padFraction) {
  const inner = Math.round(size * (1 - padFraction * 2));
  const resized = await sharp(SRC)
    .resize(inner, inner, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .toBuffer();
  return sharp({ create: { width: size, height: size, channels: 4, background: bg } })
    .composite([{ input: resized, gravity: 'center' }])
    .png()
    .toBuffer();
}

async function main() {
  mkdirSync(OUT, { recursive: true });

  // Legacy square icon (used for iOS AppIcon, which has no transparency)
  const iconOnly = await logoOnColor(1024, WASH, 0.14);
  await sharp(iconOnly).flatten({ background: '#fff5f8' }).toFile(path.join(OUT, 'icon-only.png'));

  // Adaptive icon foreground (Android) — logo confined to the safe zone
  const iconFg = await logoOnTransparent(1024, 0.22);
  await sharp(iconFg).toFile(path.join(OUT, 'icon-foreground.png'));

  // Adaptive icon background (Android) — solid brand color
  await sharp({ create: { width: 1024, height: 1024, channels: 4, background: CORAL } })
    .png()
    .toFile(path.join(OUT, 'icon-background.png'));

  // Splash screen — logo centered on the soft-pink wash background, generous padding
  const splash = await logoOnColor(2732, WASH, 0.36);
  await sharp(splash).toFile(path.join(OUT, 'splash.png'));
  await sharp(splash).toFile(path.join(OUT, 'splash-dark.png'));

  console.log('Capacitor asset sources generated in frontend/assets/.');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
