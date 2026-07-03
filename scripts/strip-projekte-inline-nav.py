#!/usr/bin/env python3
"""Remove duplicate / corrupted inline nav CSS from projekte/*.html (nav lives in site.css)."""
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
PROJEKTE = ROOT / "projekte"


def brace_block_end(text: str, open_idx: int) -> int:
    depth = 0
    i = open_idx
    while i < len(text):
        if text[i] == "{":
            depth += 1
        elif text[i] == "}":
            depth -= 1
            if depth == 0:
                return i + 1
        i += 1
    return len(text)


def remove_at_media_blocks(text: str, predicate) -> str:
    pattern = re.compile(r"@media\s*\([^)]+\)\s*\{")
    while True:
        m = pattern.search(text)
        if not m:
            break
        start = m.start()
        end = brace_block_end(text, m.end() - 1)
        block = text[start:end]
        if predicate(block):
            text = text[:start] + text[end:]
            continue
        break
    # remove all matching blocks (not just first)
    out = []
    pos = 0
    for m in pattern.finditer(text):
        start = m.start()
        end = brace_block_end(text, m.end() - 1)
        block = text[start:end]
        out.append(text[pos:start])
        if not predicate(block):
            out.append(block)
        pos = end
    out.append(text[pos:])
    return "".join(out)


def strip_nav_css(text: str) -> str:
    text = re.sub(r"(?<![a-z])ody\.dark", "body.dark", text)

    # Merge artifact: orphan rule block without selector
    text = re.sub(
        r"\n \{\n\s*nav\.primary\.open[^}]+\}\n\s*nav\.primary\.open a[^}]+\}\n\}\n",
        "\n",
        text,
    )

    # Theme toggle + nav-toggle base blocks (duplicated in site.css)
    text = re.sub(
        r"/\* ── Theme toggle[\s\S]*?/\* ── Dark mode content ──+ \*/\n",
        "/* ── Dark mode content ─────────────────────────────── */\n",
        text,
        count=1,
    )
    text = re.sub(
        r"/\* ── Mobile nav toggle[\s\S]*?(?=/\* Dark-mode contrast|@media \(max-width: 720px\) and \(max-height)",
        "",
        text,
        count=1,
    )

    # Entire @media 720px blocks that define mobile drawer nav
    def is_nav_media(block: str) -> bool:
        return "nav-drawer-in" in block or (
            "nav.primary.open" in block and "display: flex !important" in block
        )

    text = remove_at_media_blocks(text, is_nav_media)

    # Compact nav height tweak (site.css handles nav)
    text = re.sub(
        r"@media \(max-width: 720px\) and \(max-height: 560px\) \{\s*"
        r"nav\.primary\.open[^}]+\}\s*nav\.primary\.open a[^}]+\}\s*\}\s*",
        "",
        text,
    )

    # Layout-only 720px blocks: drop nav hide (site.css uses 1024px)
    def strip_nav_hide(block: str) -> str:
        if "@media" not in block:
            return block
        return re.sub(r"\s*nav\.primary\s*\{\s*display:\s*none;\s*\}", "", block)

    pattern = re.compile(r"@media\s*\([^)]+\)\s*\{")
    parts = []
    pos = 0
    for m in pattern.finditer(text):
        start = m.start()
        end = brace_block_end(text, m.end() - 1)
        parts.append(text[pos:start])
        block = text[start:end]
        parts.append(strip_nav_hide(block))
        pos = end
    parts.append(text[pos:])
    text = "".join(parts)

    # Collapse excessive blank lines in style blocks
    text = re.sub(r"\n{3,}", "\n\n", text)
    return text


def bump_site_css_version(text: str) -> str:
    return text.replace("site.css?v=1", "site.css?v=2").replace("site.js?v=1", "site.js?v=2")


def patch_file(path: Path) -> bool:
    text = path.read_text(encoding="utf-8")
    if "site.css" not in text:
        return False
    new = bump_site_css_version(strip_nav_css(text))
    if new != text:
        path.write_text(new, encoding="utf-8")
        return True
    return False


def main():
    for html in sorted(PROJEKTE.glob("*.html")):
        if patch_file(html):
            print(html.relative_to(ROOT))


if __name__ == "__main__":
    main()
