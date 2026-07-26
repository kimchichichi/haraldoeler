#!/usr/bin/env node
/**
 * Sync project-scoped concert lists between data/termine.json and data.jsx.
 *
 * Source of truth: data/termine.json (byProject.*).
 * Updates only the `termine: [...]` arrays inside DETAILS in data.jsx.
 * Does NOT rewrite termine.html (public full calendar stays hand-edited).
 *
 * Usage:
 *   node scripts/sync-termine.mjs           # JSON → data.jsx
 *   node scripts/sync-termine.mjs --check   # exit 1 if data.jsx drifts from JSON
 *   node scripts/sync-termine.mjs --extract # data.jsx → JSON (bootstrap / refresh)
 *
 * After applying to data.jsx, rebuild React bundles if needed:
 *   npm run rebuild:projekte
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const jsonPath = path.join(root, "data", "termine.json");
const dataJsxPath = path.join(root, "data.jsx");
const PROJECTS = ["solo", "orchester", "fussissimo", "duovia", "duoklakk", "hof"];

function readJson() {
  return JSON.parse(fs.readFileSync(jsonPath, "utf8"));
}

function jsString(s) {
  return JSON.stringify(s ?? "");
}

function formatTermineArray(items) {
  if (!items || !items.length) return "[]";
  const lines = items.map((item) => {
    const parts = [];
    for (const key of ["date", "time", "title", "venue", "city", "note", "link"]) {
      if (item[key] !== undefined && item[key] !== null) {
        parts.push(`${key}: ${jsString(item[key])}`);
      }
    }
    return `      { ${parts.join(", ")} }`;
  });
  return `[\n${lines.join(",\n")},\n    ]`;
}

function extractTermineFromDataJsx(text) {
  const byProject = {};
  for (const key of PROJECTS) {
    const keyRe = new RegExp(`\\n  ${key}:\\s*\\{`);
    const m = keyRe.exec(text);
    if (!m) {
      byProject[key] = [];
      continue;
    }
    let depth = 1;
    let i = m.index + m[0].length;
    while (i < text.length && depth) {
      const c = text[i++];
      if (c === "{") depth++;
      else if (c === "}") depth--;
    }
    const block = text.slice(m.index + m[0].length, i - 1);
    const tm = /termine:\s*\[/.exec(block);
    if (!tm) {
      byProject[key] = [];
      continue;
    }
    const a0 = tm.index + tm[0].length - 1;
    let d = 0;
    let j = a0;
    for (; j < block.length; j++) {
      if (block[j] === "[") d++;
      else if (block[j] === "]") {
        d--;
        if (d === 0) break;
      }
    }
    const arrSrc = block.slice(a0, j + 1);
    const items = [];
    for (const obj of arrSrc.matchAll(/\{([^{}]+)\}/g)) {
      const fields = {};
      for (const fm of obj[1].matchAll(/(\w+):\s*"((?:\\.|[^"\\])*)"/g)) {
        fields[fm[1]] = fm[2].replace(/\\"/g, '"').replace(/\\n/g, "\n");
      }
      if (Object.keys(fields).length) items.push(fields);
    }
    byProject[key] = items;
  }
  return byProject;
}

function replaceTermineInDataJsx(text, byProject) {
  let out = text;
  for (const key of PROJECTS) {
    const items = byProject[key] || [];
    const keyRe = new RegExp(`(\\n  ${key}:\\s*\\{)`);
    const m = keyRe.exec(out);
    if (!m) continue;

    let depth = 1;
    let i = m.index + m[0].length;
    const blockStart = i;
    while (i < out.length && depth) {
      const c = out[i++];
      if (c === "{") depth++;
      else if (c === "}") depth--;
    }
    const blockEnd = i - 1;
    const block = out.slice(blockStart, blockEnd);
    const tm = /termine:\s*\[/.exec(block);
    if (!tm) {
      // Insert before closing of object only if array exists elsewhere — skip empty projects
      if (!items.length) continue;
      console.warn(`[warn] ${key}: no termine array to replace; skipping`);
      continue;
    }
    const a0 = tm.index + tm[0].length - 1;
    let d = 0;
    let j = a0;
    for (; j < block.length; j++) {
      if (block[j] === "[") d++;
      else if (block[j] === "]") {
        d--;
        if (d === 0) break;
      }
    }
    const newArr = formatTermineArray(items);
    const newBlock =
      block.slice(0, tm.index) + `termine: ${newArr}` + block.slice(j + 1);
    out = out.slice(0, blockStart) + newBlock + out.slice(blockEnd);
  }
  return out;
}

function deepEqual(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}

function main() {
  const args = new Set(process.argv.slice(2));
  const extract = args.has("--extract");
  const check = args.has("--check");

  if (extract) {
    const text = fs.readFileSync(dataJsxPath, "utf8");
    const byProject = extractTermineFromDataJsx(text);
    const payload = {
      _meta: {
        description:
          "Canonical project-scoped concert lists used by data.jsx (React projekte pages). Edit this file, then run: node scripts/sync-termine.mjs  (optionally: npm run rebuild:projekte). termine.html remains the public full calendar and is not auto-generated from this file.",
        updated: new Date().toISOString().slice(0, 10),
        rebuild: "npm run rebuild:projekte",
      },
      byProject,
    };
    fs.mkdirSync(path.dirname(jsonPath), { recursive: true });
    fs.writeFileSync(jsonPath, JSON.stringify(payload, null, 2) + "\n", "utf8");
    console.log(`[ok] extracted → ${path.relative(root, jsonPath)}`);
    for (const k of PROJECTS) console.log(`  ${k}: ${(byProject[k] || []).length}`);
    return;
  }

  if (!fs.existsSync(jsonPath)) {
    console.error(`Missing ${jsonPath}. Run with --extract first.`);
    process.exit(1);
  }

  const data = readJson();
  const byProject = data.byProject || {};
  const text = fs.readFileSync(dataJsxPath, "utf8");
  const current = extractTermineFromDataJsx(text);

  if (check) {
    let drift = false;
    for (const k of PROJECTS) {
      if (!deepEqual(current[k] || [], byProject[k] || [])) {
        console.error(`[drift] ${k}`);
        drift = true;
      }
    }
    if (drift) {
      console.error("data.jsx termine arrays differ from data/termine.json");
      process.exit(1);
    }
    console.log("[ok] data.jsx matches data/termine.json");
    return;
  }

  const next = replaceTermineInDataJsx(text, byProject);
  if (next === text) {
    console.log("[ok] data.jsx already in sync");
  } else {
    fs.writeFileSync(dataJsxPath, next, "utf8");
    console.log(`[ok] updated ${path.relative(root, dataJsxPath)} from data/termine.json`);
  }
  console.log("Remember: npm run rebuild:projekte  (only if React bundles should pick up changes)");
}

main();
