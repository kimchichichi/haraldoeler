import fs from "node:fs";
import path from "node:path";

const root = process.cwd();

function listHtmlFiles(dir) {
  const out = [];
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) out.push(...listHtmlFiles(p));
    else if (ent.isFile() && ent.name.toLowerCase().endsWith(".html")) out.push(p);
  }
  return out;
}

function extractAttrs(html) {
  const attrs = [];
  const re = /\b(?:href|src)=["']([^"']+)["']/gi;
  let m;
  while ((m = re.exec(html))) attrs.push(m[1]);
  return attrs;
}

function isExternal(u) {
  return /^(https?:)?\/\//i.test(u) || /^mailto:/i.test(u) || /^tel:/i.test(u);
}

function isIgnorable(u) {
  return u === "#" || u.startsWith("#") || u.startsWith("data:");
}

function normalizeTarget(fromFile, u) {
  if (u.startsWith("/")) return path.join(root, u.slice(1));
  return path.join(path.dirname(fromFile), u);
}

const files = listHtmlFiles(root);

const missing = [];
const empties = [];
const hashLinks = [];

for (const file of files) {
  const html = fs.readFileSync(file, "utf8");

  // quick markup smells
  if (html.includes('href=""') || html.includes("href=''") || html.includes('src=""') || html.includes("src=''")) {
    empties.push(path.relative(root, file));
  }
  if (html.includes('href="#"') || html.includes("href='#'")) {
    hashLinks.push(path.relative(root, file));
  }

  for (const u of extractAttrs(html)) {
    if (!u || u.trim() === "") continue;
    if (isExternal(u) || isIgnorable(u)) continue;
    // ignore templated JS URLs
    if (u.includes("${")) continue;

    const target = normalizeTarget(file, u.split("?")[0].split("#")[0]);
    if (!fs.existsSync(target)) {
      missing.push({
        from: path.relative(root, file),
        target: u,
        resolved: path.relative(root, target),
      });
    }
  }
}

function uniq(arr) {
  return [...new Set(arr)].sort();
}

if (empties.length) {
  console.log("\n[Empty href/src]");
  for (const f of uniq(empties)) console.log(" -", f);
}

if (hashLinks.length) {
  console.log("\n[href=\"#\"] placeholders]");
  for (const f of uniq(hashLinks)) console.log(" -", f);
}

if (missing.length) {
  console.log("\n[Missing internal targets]");
  for (const m of missing) console.log(` - ${m.from} -> ${m.target} (missing: ${m.resolved})`);
}

if (!empties.length && !hashLinks.length && !missing.length) {
  console.log("OK: no empty href/src, no # placeholders, no missing internal targets.");
} else {
  process.exitCode = 1;
}

