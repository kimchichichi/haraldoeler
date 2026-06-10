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

function preamble() {
  return [
    `import * as React from "react";`,
    `import { createRoot } from "react-dom/client";`,
    `const ReactDOM = { createRoot };`,
    readSource("data.jsx"),
  ].join("\n");
}

function buildOverview() {
  const entry = writeEntry(
    "overview-entry.jsx",
    [
      preamble(),
      readSource("tweaks-panel.jsx"),
      readSource("app.jsx"),
    ].join("\n\n")
  );
  build({
    entryFile: entry,
    outfile: path.join(root, "assets/projekte.bundle.js"),
  });
  console.log("[ok] assets/projekte.bundle.js");
}

function buildDetail(id) {
  const entry = writeEntry(
    `detail-${id}-entry.jsx`,
    [
      preamble(),
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
  console.log(`[ok] assets/projekte__${id}.bundle.js`);
}

ensureEsbuild();
buildOverview();
for (const id of DETAIL_IDS) buildDetail(id);
console.log("Done — all projekte bundles rebuilt from source.");
