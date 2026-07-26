#!/usr/bin/env python3
"""Mark inline nav/theme handlers so site.js does not double-bind."""
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

NAV_END = "  backdrop.addEventListener('click',close);\n  document.addEventListener('keydown',function(e){if(e.key==='Escape')close();});\n  window.__HO_NAV_CUSTOM=true;\n})();"

def patch(path: Path):
    text = path.read_text(encoding='utf-8')
    if 'site.js' not in text or '__HO_NAV_CUSTOM' in text:
        return False
    old = "  backdrop.addEventListener('click',close);\n  document.addEventListener('keydown',function(e){if(e.key==='Escape')close();});\n})();"
    if old not in text:
        return False
    text = text.replace(old, NAV_END, 1)
    path.write_text(text, encoding='utf-8')
    return True

def main():
    for html in ROOT.rglob('*.html'):
        if patch(html):
            print(html.relative_to(ROOT))

if __name__ == '__main__':
    main()
