/* Downloads the placeholder photography used by the homepage and stores
   correctly sized WebP variants in assets/img/.

   These are Unsplash photographs used under the Unsplash License as
   PLACEHOLDERS. They are to be replaced with AP Accountax's own photography
   before launch — see docs/brand.md.

   Self-hosting rather than hot-linking means the page has no third-party
   image dependency, no rate limiting, and no risk of a dead URL.

   Usage: node tools/fetch-images.mjs */

import { writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'assets', 'img');

const ASSETS = [
  {
    slug: 'hero-professional',
    id: 'photo-1664575602554-2087b04935a5',
    credit: 'Unsplash',
    variants: [[560, 700], [840, 1050], [1120, 1400]],
  },
  {
    slug: 'approach-paperwork',
    id: 'photo-1450101499163-c8848c66ca85',
    credit: 'Unsplash',
    variants: [[600, 400], [900, 600], [1200, 800]],
  },
  {
    slug: 'audiences-shop-owner',
    id: 'photo-1556742049-0cfed4f6a45d',
    credit: 'Unsplash',
    variants: [[600, 400], [900, 600], [1200, 800]],
  },
  {
    slug: 'area-london-thames',
    id: 'photo-1513635269975-59663e0ac1ad',
    credit: 'Unsplash',
    // A dense aerial cityscape compresses poorly; at q72 the 1440 variant was
    // 408 KB. Fine detail is not load-bearing here, so quality is reduced.
    quality: 52,
    variants: [[720, 450], [1080, 675], [1440, 900]],
  },
];

await mkdir(OUT, { recursive: true });

let totalBytes = 0;

for (const asset of ASSETS) {
  for (const [w, h] of asset.variants) {
    const url =
      `https://images.unsplash.com/${asset.id}` +
      `?fm=webp&fit=crop&crop=entropy&w=${w}&h=${h}&q=${asset.quality ?? 72}`;

    const name = `${asset.slug}-${w}.webp`;
    let ok = false;

    for (let attempt = 1; attempt <= 3 && !ok; attempt += 1) {
      try {
        const res = await fetch(url, { headers: { Accept: 'image/webp,image/*' } });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const buf = Buffer.from(await res.arrayBuffer());
        if (buf.length < 2000) throw new Error(`suspiciously small (${buf.length}B)`);
        await writeFile(path.join(OUT, name), buf);
        totalBytes += buf.length;
        console.log(`${name.padEnd(34)} ${(buf.length / 1024).toFixed(0).padStart(5)} KB`);
        ok = true;
      } catch (err) {
        if (attempt === 3) {
          console.error(`FAILED ${name}: ${err.message}`);
          process.exitCode = 1;
        } else {
          await new Promise((r) => setTimeout(r, 1200 * attempt));
        }
      }
    }
  }
}

console.log(`\nTotal: ${(totalBytes / 1024).toFixed(0)} KB across ${ASSETS.length} photographs.`);
