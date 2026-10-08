#!/usr/bin/env node
/**
 * Regenerate projekte/Duo-KlAkk-Dossier.pdf from duoklakk-dossier.html via Playwright.
 * Usage: node scripts/generate-duoklakk-dossier-pdf.mjs
 */
import { chromium } from 'playwright';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const htmlPath = path.join(root, 'projekte/duoklakk-dossier.html');
const pdfPath = path.join(root, 'projekte/Duo-KlAkk-Dossier.pdf');
const fileUrl = `file://${htmlPath}`;

const browser = await chromium.launch();
const page = await browser.newPage();

await page.goto(fileUrl, { waitUntil: 'networkidle' });
await page.waitForSelector('.page.cover .cover-image img');
await page.emulateMedia({ media: 'print' });
await page.evaluate(async () => {
  if (document.fonts?.ready) await document.fonts.ready;
  await Promise.all([...document.fonts].filter((font) => font.status !== 'loaded').map((font) => font.load().catch(() => {})));
  const img = document.querySelector('.page.cover .cover-image img');
  if (img?.decode) await img.decode().catch(() => {});
});
const copyLines = await page.evaluate(() => {
  const textOf = (el, skipCite) => {
    let text = '';
    for (const node of el.childNodes) {
      if (node.nodeType === Node.TEXT_NODE) {
        const chunk = node.textContent || '';
        if (text && /[\p{L}\p{N}]$/u.test(text) && /^[\p{L}\p{N}]/u.test(chunk.trimStart()) && !/[\s\n]$/.test(text)) {
          text += ' ';
        }
        text += chunk;
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        if (node.nodeName === 'BR') {
          text += '\n';
        } else if (node.nodeName === 'IMG' || node.nodeName === 'PICTURE' || node.nodeName === 'SOURCE' || node.nodeName === 'SVG') {
          continue;
        } else if (skipCite && node.nodeName === 'CITE') {
          continue;
        } else {
          const inner = textOf(node, skipCite);
          if (!inner) continue;
          if (text && /[\p{L}\p{N}]$/u.test(text) && /^[\p{L}\p{N}]/u.test(inner) && !/[\s\n]$/.test(text)) {
            text += ' ';
          }
          text += inner;
        }
      }
    }
    return text;
  };
  const clean = (value) => value
    .replace(/\u00a0/g, ' ')
    .replace(/[ \t\f\r]+/g, ' ')
    .replace(/ *\n */g, '\n')
    .trim();
  const selector = [
    '.eyebrow', 'h1', '.cover-tag', '.cover-line',
    '.page-kicker', 'h2', 'h3', '.lede', '.role', '.prog-num', '.prog-sub',
    'p', 'blockquote', 'cite',
    '.style-label', '.style-text',
    'dt', 'dd',
    '.yt-list .num', '.yt-list .work', '.yt-list .url-row',
    '.links .title', '.links .url',
    '.page-footer',
  ].join(',');
  return [...document.querySelectorAll('main.dossier > section.page')].map((section) => {
    const nodes = [...section.querySelectorAll(selector)];
    const lines = [];
    for (const el of nodes) {
      const parentBlock = nodes.find((other) => other !== el && other.contains(el));
      if (parentBlock && !(el.tagName === 'CITE' && parentBlock.tagName === 'BLOCKQUOTE')) continue;
      const cleaned = clean(textOf(el, el.tagName === 'BLOCKQUOTE'));
      for (const line of cleaned.split('\n')) {
        const item = line.trim();
        if (item) lines.push(item);
      }
    }
    return lines;
  });
});

await page.pdf({
  path: pdfPath,
  format: 'A4',
  printBackground: true,
  margin: { top: 0, right: 0, bottom: 0, left: 0 },
  preferCSSPageSize: true,
});

await browser.close();

const linesPath = path.join(os.tmpdir(), 'duoklakk-copy-lines.json');
fs.writeFileSync(linesPath, JSON.stringify(copyLines));
const apply = spawnSync('python3', [
  path.join(root, 'scripts/apply-dossier-copy-layer.py'),
  pdfPath,
  linesPath,
], { encoding: 'utf8' });
if (apply.status !== 0) {
  console.error(apply.stdout);
  console.error(apply.stderr);
  process.exit(apply.status || 1);
}
console.log(`Wrote ${pdfPath}`);
