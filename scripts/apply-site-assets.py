#!/usr/bin/env python3
"""Apply shared site.css / site.js / skip-link / a11y patches to HTML files."""
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

SKIP = {'googled02bf8179c283f7a.html', 'media.html', 'discographie.html'}

def asset_prefix(path: Path) -> str:
    depth = len(path.relative_to(ROOT).parts) - 1
    return '../' * depth + 'assets/'

def patch_file(path: Path) -> list[str]:
    if path.name in SKIP:
        return []
    text = path.read_text(encoding='utf-8')
    orig = text
    changes = []
    prefix = asset_prefix(path)

    css_link = f'<link rel="stylesheet" href="{prefix}site.css?v=1">'
    if 'site.css' not in text and 'apple-touch-icon' in text:
        text = text.replace(
            '<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">',
            '<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">\n  ' + css_link,
            1,
        )
        changes.append('css')

    skip = '<a class="skip-link" href="#main">Zum Inhalt springen</a>'
    if 'skip-link' not in text:
        text = text.replace('<body>', '<body>\n' + skip, 1)
        if skip not in text:
            # fallback after opening body with attrs
            text = re.sub(r'(<body[^>]*>)', r'\1\n' + skip, text, count=1)
        changes.append('skip')

    if 'id="main"' not in text:
        text = re.sub(r'<main(?!\s+id=)', '<main id="main"', text, count=1)
        if '<main id="main"' in text:
            changes.append('main')

    if '<div class="center"></div>' in text:
        text = text.replace(
            '<div class="center"></div>',
            '<div class="center" id="footer-next-concert"></div>',
        )
        changes.append('footer')

    js_tag = f'<script src="{prefix}site.js?v=1" defer></script>'
    if 'site.js' not in text and '</body>' in text:
        text = text.replace('</body>', f'  {js_tag}\n</body>', 1)
        changes.append('js')

    if text != orig:
        path.write_text(text, encoding='utf-8')
    return changes

def main():
    for html in sorted(ROOT.rglob('*.html')):
        ch = patch_file(html)
        if ch:
            rel = html.relative_to(ROOT)
            print(f'{rel}: {", ".join(ch)}')

if __name__ == '__main__':
    main()
