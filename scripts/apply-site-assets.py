#!/usr/bin/env python3
"""Apply shared site.css / site.js / skip-link / a11y / canonical patches to HTML files.

Low-risk chrome consistency for existing pages (nav/footer helpers, shared assets).
Does NOT strip per-page inline CSS — that remains page-owned until a fuller migration.

Usage:
  python3 scripts/apply-site-assets.py           # apply missing patches
  python3 scripts/apply-site-assets.py --check   # report only
"""
from __future__ import annotations

import argparse
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

SKIP = {
    "googled02bf8179c283f7a.html",
    "media.html",
    "discographie.html",
}

# Preferred www canonicals for core pages (path → href). Extensionless where live URLs use them.
CORE_CANONICALS = {
    "index.html": "https://www.haraldoeler.com/",
    "news.html": "https://www.haraldoeler.com/news",
    "termine.html": "https://www.haraldoeler.com/termine",
    "bio.html": "https://www.haraldoeler.com/bio.html",
    "projekte.html": "https://www.haraldoeler.com/projekte",
    "medien.html": "https://www.haraldoeler.com/medien",
    "kontakt.html": "https://www.haraldoeler.com/kontakt",
    "unterricht.html": "https://www.haraldoeler.com/unterricht.html",
    "impressum.html": "https://www.haraldoeler.com/impressum",
    "datenschutz.html": "https://www.haraldoeler.com/privacy",
}


def asset_prefix(path: Path) -> str:
    depth = len(path.relative_to(ROOT).parts) - 1
    return "../" * depth + "assets/"


def ensure_css(text: str, prefix: str) -> tuple[str, bool]:
    if "site.css" in text:
        return text, False
    css_link = f'<link rel="stylesheet" href="{prefix}site.css?v=9">'
    needle = '<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">'
    if needle in text:
        return text.replace(needle, needle + "\n  " + css_link, 1), True
    if "</head>" in text:
        return text.replace("</head>", f"  {css_link}\n</head>", 1), True
    return text, False


def ensure_skip(text: str) -> tuple[str, bool]:
    if "skip-link" in text:
        return text, False
    skip = '<a class="skip-link" href="#main">Zum Inhalt springen</a>'
    if "<body>" in text:
        return text.replace("<body>", "<body>\n" + skip, 1), True
    text2, n = re.subn(r"(<body[^>]*>)", r"\1\n" + skip, text, count=1)
    return text2, n > 0


def ensure_main_id(text: str) -> tuple[str, bool]:
    if 'id="main"' in text:
        return text, False
    text2, n = re.subn(r"<main(?!\s+id=)", '<main id="main"', text, count=1)
    return text2, n > 0


def ensure_footer_id(text: str) -> tuple[str, bool]:
    if 'id="footer-next-concert"' in text:
        return text, False
    if '<div class="center"></div>' in text:
        return (
            text.replace(
                '<div class="center"></div>',
                '<div class="center" id="footer-next-concert"></div>',
                1,
            ),
            True,
        )
    return text, False


def ensure_js(text: str, prefix: str) -> tuple[str, bool]:
    if "site.js" in text:
        return text, False
    if "</body>" not in text:
        return text, False
    js_tag = f'<script src="{prefix}site.js?v=9" defer></script>'
    return text.replace("</body>", f"  {js_tag}\n</body>", 1), True


def ensure_www_canonical(text: str, path: Path) -> tuple[str, bool]:
    changed = False
    # Fix apex → www only on canonical + og:url (core SEO surfaces)
    text2, n1 = re.subn(
        r'(<link\s+rel="canonical"\s+href=")https://haraldoeler\.com',
        r"\1https://www.haraldoeler.com",
        text,
    )
    text2, n2 = re.subn(
        r'(<meta\s+property="og:url"\s+content=")https://haraldoeler\.com',
        r"\1https://www.haraldoeler.com",
        text2,
    )
    if n1 or n2:
        text = text2
        changed = True

    wanted = CORE_CANONICALS.get(path.name) if path.parent == ROOT else None
    if wanted and 'rel="canonical"' not in text:
        tag = f'  <link rel="canonical" href="{wanted}" />\n'
        if 'property="og:url"' in text:
            text, n = re.subn(
                r'(<meta\s+property="og:url"[^>]*>\s*\n)',
                r"\1" + tag,
                text,
                count=1,
            )
            changed = changed or n > 0
        elif "</title>" in text:
            text, n = re.subn(r"(</title>\s*\n)", r"\1" + tag, text, count=1)
            changed = changed or n > 0
    return text, changed


def patch_file(path: Path, check_only: bool) -> list[str]:
    if path.name in SKIP:
        return []
    text = path.read_text(encoding="utf-8")
    orig = text
    changes: list[str] = []
    prefix = asset_prefix(path)

    text, c = ensure_css(text, prefix)
    if c:
        changes.append("css")
    text, c = ensure_skip(text)
    if c:
        changes.append("skip")
    text, c = ensure_main_id(text)
    if c:
        changes.append("main")
    text, c = ensure_footer_id(text)
    if c:
        changes.append("footer")
    text, c = ensure_js(text, prefix)
    if c:
        changes.append("js")
    text, c = ensure_www_canonical(text, path)
    if c:
        changes.append("canonical")

    if text != orig and not check_only:
        path.write_text(text, encoding="utf-8")
    return changes


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--check", action="store_true", help="Report needed patches only")
    args = ap.parse_args()

    any_needed = False
    for html in sorted(ROOT.rglob("*.html")):
        if "node_modules" in html.parts or "scripts/.cache" in str(html):
            continue
        ch = patch_file(html, check_only=args.check)
        if ch:
            any_needed = True
            rel = html.relative_to(ROOT)
            mode = "needs" if args.check else "patched"
            print(f"{rel}: {mode} {', '.join(ch)}")

    if args.check and any_needed:
        return 1
    if not any_needed:
        print("ok: all HTML pages have shared chrome hooks")
    return 0


if __name__ == "__main__":
    sys.exit(main())
