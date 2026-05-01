import fs from "node:fs/promises";
import path from "node:path";
import { build } from "esbuild";

const workspaceRoot = process.cwd();

const targets = [
  "projekte.html",
  path.join("projekte", "solo.html"),
  path.join("projekte", "orchester.html"),
  path.join("projekte", "fussissimo.html"),
  path.join("projekte", "duovia.html"),
  path.join("projekte", "duoklakk.html"),
  path.join("projekte", "hof.html"),
];

function outJsPathForHtml(htmlRelPath) {
  const baseName = htmlRelPath.replaceAll(path.sep, "__").replace(/\.html$/i, "");
  return path.join("assets", `${baseName}.bundle.js`);
}

function rewriteReactDomCreateRootToImported(code) {
  return code.replaceAll("ReactDOM.createRoot", "createRoot");
}

function stripReactBabelIncludes(html) {
  return html
    .replaceAll(
      /<script\s+src="https:\/\/unpkg\.com\/react@18\.3\.1\/umd\/react\.development\.js"[\s\S]*?<\/script>\s*/g,
      ""
    )
    .replaceAll(
      /<script\s+src="https:\/\/unpkg\.com\/react-dom@18\.3\.1\/umd\/react-dom\.development\.js"[\s\S]*?<\/script>\s*/g,
      ""
    )
    .replaceAll(
      /<script\s+src="https:\/\/unpkg\.com\/@babel\/standalone@7\.29\.0\/babel\.min\.js"[\s\S]*?<\/script>\s*/g,
      ""
    );
}

function extractBabelBlock(html) {
  const openTagRe = /<script\s+type="text\/babel"[^>]*>/i;
  const openMatch = html.match(openTagRe);
  if (!openMatch) return null;
  const openIdx = html.indexOf(openMatch[0]);
  const start = openIdx + openMatch[0].length;
  const closeIdx = html.indexOf("</script>", start);
  if (closeIdx === -1) return null;
  const code = html.slice(start, closeIdx);
  const before = html.slice(0, openIdx);
  const after = html.slice(closeIdx + "</script>".length);
  return { code, before, after };
}

function ensureModuleScriptIncluded(html, jsRelPath) {
  // Insert right after <div id="root"></div> (exists on all projekte pages)
  const anchor = '<div id="root"></div>';
  const idx = html.indexOf(anchor);
  if (idx === -1) throw new Error("Missing #root anchor");
  const insertAt = idx + anchor.length;

  const include = `\n  <script type="module" src="${jsRelPath}"></script>\n`;
  if (html.includes(include.trim())) return html;
  return html.slice(0, insertAt) + include + html.slice(insertAt);
}

async function ensureDir(relDir) {
  await fs.mkdir(path.join(workspaceRoot, relDir), { recursive: true });
}

async function processFile(htmlRelPath) {
  const absHtmlPath = path.join(workspaceRoot, htmlRelPath);
  const html = await fs.readFile(absHtmlPath, "utf8");

  const extracted = extractBabelBlock(html);
  if (!extracted) {
    console.log(`[skip] No Babel block found in ${htmlRelPath}`);
    return;
  }

  const outJsRelPath = outJsPathForHtml(htmlRelPath);
  const absOutJsPath = path.join(workspaceRoot, outJsRelPath);

  await ensureDir("assets");

  // Prepare module entry: import React + createRoot, then paste original code.
  const patchedCode = rewriteReactDomCreateRootToImported(extracted.code);
  const entry = [
    `import * as React from "react";`,
    `import { createRoot } from "react-dom/client";`,
    patchedCode.trimStart(),
  ].join("\n");

  await build({
    stdin: {
      contents: entry,
      resolveDir: workspaceRoot,
      sourcefile: `${htmlRelPath}.tsx`,
      loader: "tsx",
    },
    bundle: true,
    minify: true,
    format: "esm",
    target: ["es2020"],
    outfile: absOutJsPath,
    // Keep console output quiet unless error
    logLevel: "silent",
  });

  // Rewrite HTML: remove React/Babel includes and replace Babel block with module include
  const stripped = stripReactBabelIncludes(extracted.before + extracted.after);
  const scriptSrc = htmlRelPath.startsWith(`projekte${path.sep}`) ? `../${outJsRelPath}` : outJsRelPath;
  const withBundle = ensureModuleScriptIncluded(stripped, scriptSrc);

  await fs.writeFile(absHtmlPath, withBundle, "utf8");
  console.log(`[ok] ${htmlRelPath} -> ${outJsRelPath}`);
}

for (const t of targets) {
  // eslint-disable-next-line no-await-in-loop
  await processFile(t);
}

