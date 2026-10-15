/**
 * Rebuild all projekte bundles from source (data.jsx, app.jsx, tweaks-panel.jsx).
 * Run: node scripts/rebuild-projekte.mjs
 *
 * Do NOT hand-edit assets/*.bundle.js — changes belong in the .jsx source files.
 */
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const esbuildBin = path.join(root, "tools/package/bin/esbuild");
const cacheDir = path.join(root, "scripts", ".cache");

const DETAIL_IDS = ["solo", "orchester", "fussissimo", "duovia", "duoklakk", "hof"];

function readSource(relPath) {
  return fs.readFileSync(path.join(root, relPath), "utf8").replace(/^window\.\w+ = .+;?\s*$/gm, "");
}

function ensureEsbuild() {
  if (fs.existsSync(esbuildBin)) return;
  throw new Error(
    "esbuild binary missing. Run:\n" +
      "  mkdir -p tools && curl -fsSL https://registry.npmjs.org/@esbuild/darwin-arm64/-/darwin-arm64-0.25.9.tgz | tar -xz -C tools"
  );
}

function writeEntry(name, body) {
  fs.mkdirSync(cacheDir, { recursive: true });
  const file = path.join(cacheDir, name);
  fs.writeFileSync(file, body, "utf8");
  return file;
}

function build({ entryFile, outfile }) {
  fs.mkdirSync(path.dirname(outfile), { recursive: true });
  execFileSync(
    esbuildBin,
    [
      entryFile,
      "--bundle",
      "--minify",
      "--format=esm",
      "--target=es2020",
      "--jsx=automatic",
      `--outfile=${outfile}`,
    ],
    { stdio: "inherit" }
  );
}

function preamble(dataSource = "data.jsx") {
  return [
    `import * as React from "react";`,
    `import { createRoot } from "react-dom/client";`,
    `const ReactDOM = { createRoot };`,
    dataSource === "data.jsx" ? readSource("data.jsx") : dataSource,
  ].join("\n");
}

/** Overview only needs PROJECTS + chrome components — drop heavy DETAILS. */
function overviewData() {
  let src = readSource("data.jsx");
  const start = src.indexOf("const DETAILS =");
  const end = src.indexOf("\nfunction Header");
  if (start >= 0 && end > start) {
    src = src.slice(0, start) + "const DETAILS = {};\n" + src.slice(end + 1);
  }
  return src;
}

/** Detail pages only ship one project entry — cuts unused JS (~other DETAILS). */
function detailData(id) {
  let src = readSource("data.jsx");
  const start = src.indexOf("const DETAILS =");
  const end = src.indexOf("\nfunction Header");
  if (start < 0 || end <= start) return src;

  const block = src.slice(start, end);
  const keyAt = block.indexOf(`\n  ${id}:`);
  if (keyAt < 0) {
    console.warn(`[warn] DETAILS.${id} not found — bundling full data`);
    return src;
  }

  let i = block.indexOf("{", keyAt);
  if (i < 0) return src;
  let depth = 0;
  let endObj = -1;
  for (; i < block.length; i++) {
    const ch = block[i];
    if (ch === "{") depth++;
    else if (ch === "}") {
      depth--;
      if (depth === 0) {
        endObj = i;
        break;
      }
    }
  }
  if (endObj < 0) return src;

  const entry = block.slice(keyAt, endObj + 1).replace(/^\s*,?\s*/, "").replace(/,?\s*$/, "");
  const slim = `const DETAILS = {\n  ${entry}\n};\n`;
  return src.slice(0, start) + slim + src.slice(end + 1);
}

function buildOverview() {
  const entry = writeEntry(
    "overview-entry.jsx",
    [preamble(overviewData()), readSource("app-overview.jsx")].join("\n\n")
  );
  build({
    entryFile: entry,
    outfile: path.join(root, "assets/projekte.bundle.js"),
  });
  console.log("[ok] assets/projekte.bundle.js (slim overview)");
}

function buildDetail(id) {
  const entry = writeEntry(
    `detail-${id}-entry.jsx`,
    [
      preamble(detailData(id)),
      readSource("scripts/projekt-detail.jsx"),
      "",
      `createRoot(document.getElementById("root")).render(`,
      `  React.createElement(ProjektDetail, {`,
      `    id: ${JSON.stringify(id)},`,
      `    onBack: () => { window.location.href = "/projekte"; },`,
      `  })`,
      `);`,
    ].join("\n")
  );
  const outfile = path.join(root, "assets", `projekte__${id}.bundle.js`);
  build({ entryFile: entry, outfile });
  const kb = Math.round(fs.statSync(outfile).size / 1024);
  console.log(`[ok] assets/projekte__${id}.bundle.js (${kb} KiB, DETAILS.${id} only)`);
}

ensureEsbuild();
buildOverview();
for (const id of DETAIL_IDS) buildDetail(id);
console.log("Done — all projekte bundles rebuilt from source.");
