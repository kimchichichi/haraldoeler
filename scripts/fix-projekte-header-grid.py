#!/usr/bin/env python3
"""Fix projekte header grid (3 cols for wordmark + nav + theme) and drop duplicate nav/theme inline JS."""
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
PROJEKTE = ROOT / "projekte"

INLINE_NAV_RE = re.compile(
    r"\n  <script>\n\(function\(\)\{\n  function initTheme\(\)[\s\S]*?\}\)\(\);\n</script>",
    re.MULTILINE,
)


def fix_header_grid(text: str) -> str:
    def repl(m: re.Match) -> str:
        block = m.group(0)
        if "header-inner" not in block:
            return block
        return block.replace(
            "grid-template-columns: 1fr auto;",
            "grid-template-columns: 1fr auto auto;",
        )

    return re.sub(
        r"\.header-inner\s*\{[^}]+\}",
        repl,
        text,
    )


def strip_inline_nav(text: str) -> str:
    return INLINE_NAV_RE.sub("", text, count=1)


def patch(path: Path) -> list[str]:
    text = path.read_text(encoding="utf-8")
    orig = text
    changes = []
    new = fix_header_grid(text)
    if new != text:
        changes.append("grid")
        text = new
    new = strip_inline_nav(text)
    if new != text:
        changes.append("js")
        text = new
    if text != orig:
        path.write_text(text, encoding="utf-8")
    return changes


def main():
    for html in sorted(PROJEKTE.glob("*.html")):
        ch = patch(html)
        if ch:
            print(f"{html.relative_to(ROOT)}: {', '.join(ch)}")


if __name__ == "__main__":
    main()
