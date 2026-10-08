#!/usr/bin/env node
/**
 * Regenerate Harald_Oeler_Vita.pdf and Harald_Oeler_Vita_EN.pdf from vita/cv-de.html and vita/cv-en.html.
 * Usage: node scripts/generate-vita-pdf.mjs
 */
import { chromium } from 'playwright';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const jobs = [
  { html: 'vita/cv-de.html', pdf: 'Harald_Oeler_Vita.pdf' },
  { html: 'vita/cv-en.html', pdf: 'Harald_Oeler_Vita_EN.pdf' },
];

const browser = await chromium.launch();

for (const job of jobs) {
  const htmlPath = path.join(root, job.html);
  const pdfPath = path.join(root, job.pdf);
  const page = await browser.newPage();
  await page.goto(`file://${htmlPath}`, { waitUntil: 'networkidle' });
  await page.evaluate(async () => {
    if (document.fonts?.ready) await document.fonts.ready;
    const img = document.querySelector('.portrait img');
    if (img?.decode) await img.decode().catch(() => {});
  });
  await page.emulateMedia({ media: 'print' });
  await page.pdf({
    path: pdfPath,
    format: 'A4',
    printBackground: true,
    margin: { top: 0, right: 0, bottom: 0, left: 0 },
    preferCSSPageSize: true,
  });
  await page.close();
  console.log(`Wrote ${pdfPath}`);
}

await browser.close();
