#!/usr/bin/env node
/**
 * Regenerate projekte/Duo-KlAkk-Dossier.pdf from duoklakk-dossier.html via Playwright.
 * Usage: node scripts/generate-duoklakk-dossier-pdf.mjs
 */
import { chromium } from 'playwright';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const htmlPath = path.join(root, 'projekte/duoklakk-dossier.html');
const pdfPath = path.join(root, 'projekte/Duo-KlAkk-Dossier.pdf');
const fileUrl = `file://${htmlPath}`;

const browser = await chromium.launch();
const page = await browser.newPage();

await page.goto(fileUrl, { waitUntil: 'networkidle' });
await page.waitForSelector('.page.cover .cover-image img');
await page.evaluate(async () => {
  const img = document.querySelector('.page.cover .cover-image img');
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

await browser.close();
console.log(`Wrote ${pdfPath}`);
