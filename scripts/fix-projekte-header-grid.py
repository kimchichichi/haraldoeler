#!/usr/bin/env python3
"""Keep projekte header grid at 2 cols (wordmark + nav); strip obsolete inline theme JS if present."""
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
PROJEKTE = ROOT / "projekte"

INLINE_THEME_RE = re.compile(
    r"\n  <script>\n\(function\(\)\{\n  function initTheme\(\)[\s\S]*?\}\)\(\);\n</script>",
    re.MULTILINE,
)


def fix_header_grid(text: str) -> str:
    def repl(m: re.Match) -> str:
        block = m.group(0)
        if "header-inner" not in block:
            return block
        return block.replace(
            "grid-template-columns: 1fr auto auto;",
            "grid-template-columns: 1fr auto;",
        )

    return re.sub(
        r"\.header-inner\s*\{[^}]+\}",
        repl,
        text,
    )


def strip_inline_theme(text: str) -> str:
    return INLINE_THEME_RE.sub("", text, count=1)


def patch(path: Path) -> list[str]:
    text = path.read_text(encoding="utf-8")
    orig = text
    changes = []
    new = fix_header_grid(text)
    if new != text:
        changes.append("grid")
        text = new
    new = strip_inline_theme(text)
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
