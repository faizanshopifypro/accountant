/* Accessibility audit.
   Runs axe-core (WCAG 2.0/2.1/2.2 A + AA rulesets) against the page at a
   desktop and a mobile width, in the default state and with the mobile
   navigation open, then exercises the form's error state so validation
   messaging is audited too.

   Usage: npm run qa:a11y */

import { chromium } from 'playwright';
import { AxeBuilder } from '@axe-core/playwright';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer } from './serve.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PORT = 4398;
const TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'];

const server = createServer();
await new Promise((resolve) => server.listen(PORT, '127.0.0.1', resolve));

const browser = await chromium.launch();
let total = 0;

async function audit(label, width, height, prepare) {
  const context = await browser.newContext({ viewport: { width, height } });
  const page = await context.newPage();
  await page.goto(`http://127.0.0.1:${PORT}/`, { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  if (prepare) await prepare(page);

  const { violations } = await new AxeBuilder({ page }).withTags(TAGS).analyze();
  total += violations.length;

  console.log(`\n=== ${label} (${width}x${height}) — ${violations.length} violation(s)`);
  for (const v of violations) {
    console.log(`  [${v.impact}] ${v.id}: ${v.help}`);
    v.nodes.slice(0, 3).forEach((n) => console.log(`      ${n.target.join(' ')}`));
  }

  await context.close();
}

await audit('Desktop, default', 1440, 900);
await audit('Mobile, default', 390, 844);

await audit('Mobile, navigation open', 390, 844, async (page) => {
  await page.click('#nav-toggle');
  await page.waitForTimeout(400);
});

await audit('Desktop, form in error state', 1440, 900, async (page) => {
  await page.locator('#enquiry-form button[type="submit"]').scrollIntoViewIfNeeded();
  await page.click('#enquiry-form button[type="submit"]');
  await page.waitForTimeout(300);
});

await browser.close();
server.close();

if (total) {
  console.log(`\n${total} axe violation(s) total.`);
  process.exitCode = 1;
} else {
  console.log('\nNo axe violations in any audited state.');
}
