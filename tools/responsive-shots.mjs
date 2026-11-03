/* Responsive QA pass.
   For every breakpoint in the project standard this script:
     - loads the page and waits for fonts and images,
     - fails on horizontal overflow and names the offending elements,
     - reports any image that did not load,
     - captures one screenshot per section for visual review.

   Usage: npm run qa:shots */

import { chromium } from 'playwright';
import { mkdir, rm } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer } from './serve.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'qa-artifacts');
const PORT = 4399;

/* The project breakpoint standard. Changing these means changing
   docs/brand.md and the CSS media queries together. */
const BREAKPOINTS = [
  { name: '1440-large-desktop', width: 1440, height: 900 },
  { name: '1280-desktop', width: 1280, height: 860 },
  { name: '1024-laptop', width: 1024, height: 768 },
  { name: '768-tablet', width: 768, height: 1024 },
  { name: '390-mobile', width: 390, height: 844 },
  { name: '320-small-mobile', width: 320, height: 568 },
];

const SECTIONS = [
  ['hero', '.hero'],
  ['approach', '#approach'],
  ['services', '#services'],
  ['values', '#why'],
  ['audiences', '#who'],
  ['process', '#process'],
  ['area', '#area'],
  ['contact', '#contact'],
  ['footer', '.footer'],
];

const server = createServer();
await new Promise((resolve) => server.listen(PORT, '127.0.0.1', resolve));

await rm(OUT, { recursive: true, force: true });
await mkdir(OUT, { recursive: true });

const browser = await chromium.launch();
const problems = [];

for (const bp of BREAKPOINTS) {
  const context = await browser.newContext({
    viewport: { width: bp.width, height: bp.height },
    deviceScaleFactor: 1,
  });
  const page = await context.newPage();

  const consoleErrors = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });
  page.on('pageerror', (err) => consoleErrors.push(`pageerror: ${err.message}`));

  await page.goto(`http://127.0.0.1:${PORT}/`, { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);

  // Force eager decode so QA is not flaky on lazy-load timing.
  await page.evaluate(() => {
    for (const img of document.images) {
      img.loading = 'eager';
      img.setAttribute('fetchpriority', 'high');
      // Re-assigning src restarts decode after the loading attribute change.
      const src = img.getAttribute('src');
      if (src) img.src = src;
    }
  });

  await page.evaluate(async () => {
    const step = Math.max(window.innerHeight - 40, 200);
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 120));
    }
    window.scrollTo(0, 0);
  });

  let imagesSettled = true;
  try {
    await page.waitForFunction(
      () => Array.from(document.images).every((img) => img.complete && img.naturalWidth > 0),
      null,
      { timeout: 45000 }
    );
  } catch {
    imagesSettled = false;
  }

  /* ---- horizontal overflow ---- */
  const overflow = await page.evaluate(() => {
    const doc = document.documentElement;
    const limit = doc.clientWidth;
    const culprits = [];
    for (const el of document.querySelectorAll('body *')) {
      const r = el.getBoundingClientRect();
      if (r.width === 0 && r.height === 0) continue;
      if (r.right > limit + 1 || r.left < -1) {
        const style = getComputedStyle(el);
        if (style.position === 'fixed' && style.visibility === 'hidden') continue;
        culprits.push({
          tag: el.tagName.toLowerCase(),
          cls: el.className?.toString().slice(0, 60) || '',
          left: Math.round(r.left),
          right: Math.round(r.right),
        });
      }
    }
    return {
      scrollWidth: doc.scrollWidth,
      clientWidth: limit,
      overflows: doc.scrollWidth > limit + 1,
      culprits: culprits.slice(0, 8),
    };
  });

  /* ---- images that failed to load ---- */
  const brokenImages = await page.evaluate(() =>
    Array.from(document.images)
      .filter((img) => !img.complete || img.naturalWidth === 0)
      .map((img) => img.currentSrc || img.src)
  );

  /* ---- minimum touch target on interactive controls ---- */
  const smallTargets = await page.evaluate(() => {
    const out = [];
    for (const el of document.querySelectorAll('a[href], button, input, select, textarea')) {
      const r = el.getBoundingClientRect();
      if (r.width === 0 && r.height === 0) continue;
      if (el.closest('[aria-hidden="true"]')) continue;
      if (r.height < 24) {
        out.push({ tag: el.tagName.toLowerCase(), text: (el.textContent || '').trim().slice(0, 32), h: Math.round(r.height) });
      }
    }
    return out;
  });

  const dir = path.join(OUT, bp.name);
  await mkdir(dir, { recursive: true });

  for (const [label, selector] of SECTIONS) {
    const el = page.locator(selector).first();
    if (!(await el.count())) continue;
    await el.scrollIntoViewIfNeeded();
    await page.waitForTimeout(220);
    await el
      .screenshot({ path: path.join(dir, `${label}.jpg`), type: 'jpeg', quality: 72 })
      .catch((e) => problems.push(`${bp.name} ${label}: screenshot failed — ${e.message}`));
  }

  /* Header in its scrolled (solid) state. */
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight * 0.4));
  await page.waitForTimeout(400);
  await page
    .locator('#site-header')
    .screenshot({ path: path.join(dir, 'header-scrolled.jpg'), type: 'jpeg', quality: 80 })
    .catch(() => {});

  /* Mobile menu, where it exists. */
  if (bp.width < 1024) {
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.click('#nav-toggle');
    await page.waitForTimeout(420);
    await page.screenshot({ path: path.join(dir, 'nav-open.jpg'), type: 'jpeg', quality: 80 });
    await page.keyboard.press('Escape');
    await page.waitForTimeout(260);
  }

  const status = [];
  if (overflow.overflows) {
    status.push(`HORIZONTAL OVERFLOW ${overflow.scrollWidth}>${overflow.clientWidth}`);
    problems.push(`${bp.name}: overflow ${overflow.scrollWidth}>${overflow.clientWidth} ${JSON.stringify(overflow.culprits)}`);
  }
  if (brokenImages.length) {
    status.push(`${brokenImages.length} BROKEN IMAGE(S)`);
    problems.push(
      `${bp.name}: ${imagesSettled ? 'broken' : 'still-loading after 30s'} images ${JSON.stringify(brokenImages)}`
    );
  }
  if (smallTargets.length) {
    status.push(`${smallTargets.length} small target(s)`);
    problems.push(`${bp.name}: small targets ${JSON.stringify(smallTargets)}`);
  }
  if (consoleErrors.length) {
    status.push(`${consoleErrors.length} CONSOLE ERROR(S)`);
    problems.push(`${bp.name}: console ${JSON.stringify(consoleErrors.slice(0, 5))}`);
  }

  console.log(
    `${String(bp.width).padStart(5)}px  doc=${overflow.scrollWidth}/${overflow.clientWidth}  ` +
      `imgs=${await page.evaluate(() => document.images.length)}  ` +
      (status.length ? `-- ${status.join(', ')}` : 'clean')
  );

  await context.close();
}

await browser.close();
server.close();

console.log(`\nArtifacts: ${OUT}`);
if (problems.length) {
  console.log(`\n${problems.length} problem(s):`);
  problems.forEach((p) => console.log(`  - ${p}`));
  process.exitCode = 1;
} else {
  console.log('\nNo overflow, broken images, undersized targets or console errors at any breakpoint.');
}
