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
  const scale = 72 / 96;
  const pageH = 841.92;

  const linesOf = (el, pageRect, skipCite) => {
    const chars = [];
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    let node = walker.nextNode();
    while (node) {
      if (!(skipCite && node.parentElement && node.parentElement.closest('cite'))) {
        const text = (node.textContent || '').replace(/\u00a0/g, ' ');
        for (let i = 0; i < text.length; i += 1) {
          const range = document.createRange();
          range.setStart(node, i);
          range.setEnd(node, i + 1);
          const rect = range.getClientRects()[0];
          if (!rect || (rect.width === 0 && text[i] !== ' ')) continue;
          chars.push({
            ch: text[i],
            x: (rect.left - pageRect.left) * scale,
            top: (rect.top - pageRect.top) * scale,
            h: rect.height * scale,
            w: rect.width * scale,
          });
        }
      }
      node = walker.nextNode();
    }
    const groups = [];
    for (const item of chars) {
      let group = groups.find((entry) => Math.abs(entry.top - item.top) < 1.5);
      if (!group) {
        group = { top: item.top, chars: [] };
        groups.push(group);
      }
      group.chars.push(item);
    }
    return groups.map((group) => {
      const sorted = group.chars.sort((a, b) => a.x - b.x);
      const text = sorted.map((item) => item.ch).join('').replace(/[ \t]+/g, ' ').trim();
      if (!text) return null;
      const x = Math.min(...sorted.map((item) => item.x));
      const right = Math.max(...sorted.map((item) => item.x + item.w));
      const top = Math.min(...sorted.map((item) => item.top));
      const bottom = Math.max(...sorted.map((item) => item.top + item.h));
      return {
        text,
        x: Math.round(x * 100) / 100,
        y: Math.round((pageH - (top + (bottom - top) * 0.8)) * 100) / 100,
        w: Math.round((right - x) * 100) / 100,
        h: Math.round((bottom - top) * 100) / 100,
      };
    }).filter(Boolean);
  };

  return [...document.querySelectorAll('main.dossier > section.page')].map((section) => {
    const pageRect = section.getBoundingClientRect();
    const nodes = [...section.querySelectorAll(selector)];
    const blocks = [];
    for (const el of nodes) {
      const parentBlock = nodes.find((other) => other !== el && other.contains(el));
      if (parentBlock && !(el.tagName === 'CITE' && parentBlock.tagName === 'BLOCKQUOTE')) continue;
      const lines = linesOf(el, pageRect, el.tagName === 'BLOCKQUOTE');
      if (lines.length) blocks.push(lines);
    }
    return blocks;
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
