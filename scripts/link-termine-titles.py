#!/usr/bin/env python3
"""Convert termine 'mehr infos' links into clickable concert titles."""
from __future__ import annotations

import re
from pathlib import Path

PATH = Path(__file__).resolve().parents[1] / "termine.html"

INFO_RE = re.compile(
    r'<a\s+class="c-info-link"\s+([^>]*)>(?:(?!</a>).)*</a>\s*',
    re.DOTALL,
)
TITLE_RE = re.compile(r'<div\s+class="c-title">([\s\S]*?)</div>', re.DOTALL)
ATTR_HREF = re.compile(r'\bhref="([^"]*)"')
ATTR_DOWNLOAD = re.compile(r'\bdownload(?:="([^"]*)")?')

OLD_CSS = """.c-title {
  font-family: var(--serif);
  font-weight: 400;
  font-size: 26px;
  line-height: 1.1;
  letter-spacing: -0.005em;
  margin-bottom: 6px;
}
.c-title small {
  display: block;
  font-family: var(--serif);
  font-style: italic;
  font-weight: 300;
  font-size: 16px;
  color: color-mix(in srgb, var(--ink) 65%, transparent);
  margin-top: 4px;
  line-height: 1.4;
  overflow-wrap: anywhere;
  hyphens: auto;
}"""

NEW_CSS = """.c-title {
  display: block;
  font-family: var(--serif);
  font-weight: 400;
  font-size: 26px;
  line-height: 1.1;
  letter-spacing: -0.005em;
  margin-bottom: 6px;
  color: inherit;
  text-decoration: none;
  transition: color .25s ease;
}
a.c-title:hover {
  color: var(--accent);
}
a.c-title:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 4px;
}
.c-title small {
  display: block;
  font-family: var(--serif);
  font-style: italic;
  font-weight: 300;
  font-size: 16px;
  color: color-mix(in srgb, var(--ink) 65%, transparent);
  margin-top: 4px;
  line-height: 1.4;
  overflow-wrap: anywhere;
  hyphens: auto;
  transition: color .25s ease;
}
a.c-title:hover small {
  color: color-mix(in srgb, var(--accent) 70%, var(--ink));
}"""


def transform_item(body: str) -> tuple[str, bool]:
    info = INFO_RE.search(body)
    title = TITLE_RE.search(body)
    if not info or not title:
        return body, False

    attrs = info.group(1)
    href_m = ATTR_HREF.search(attrs)
    if not href_m:
        return body, False
    href = href_m.group(1)
    download_m = ATTR_DOWNLOAD.search(attrs)
    is_internal = href.startswith("/") or "haraldoeler.com" in href
    parts = [f'href="{href}"']
    if download_m:
        if download_m.group(1) is not None:
            parts.append(f'download="{download_m.group(1)}"')
        else:
            parts.append("download")
    elif not is_internal:
        parts.append('target="_blank"')
        parts.append('rel="noopener"')

    new_title = f'<a class="c-title" {" ".join(parts)}>{title.group(1)}</a>'
    body = TITLE_RE.sub(new_title, body, count=1)
    body = INFO_RE.sub("", body, count=1)
    return body, True


def main() -> None:
    html = PATH.read_text(encoding="utf-8")
    parts = re.split(r'(<li\b[^>]*\bclass="concert-item"[^>]*>)', html)
    out = [parts[0]]
    changed = 0
    for i in range(1, len(parts), 2):
        open_tag = parts[i]
        rest = parts[i + 1]
        end = rest.find("</li>")
        if end == -1:
            out.append(open_tag + rest)
            continue
        body, after = rest[:end], rest[end:]
        new_body, did = transform_item(body)
        if did:
            changed += 1
        out.append(open_tag + new_body + after)
    html = "".join(out)

    if OLD_CSS in html:
        html = html.replace(OLD_CSS, NEW_CSS, 1)
        print("css updated")
    elif "a.c-title:hover" in html:
        print("css already present")
    else:
        print("WARN: css pattern not found")

    dark_anchor = "body.dark .c-title small { color: color-mix(in srgb, var(--paper) 65%, transparent); }"
    if "body.dark a.c-title:hover" not in html and dark_anchor in html:
        html = html.replace(
            dark_anchor,
            dark_anchor
            + "\nbody.dark a.c-title:hover { color: color-mix(in srgb, var(--paper) 92%, transparent); }"
            + "\nbody.dark a.c-title:hover small { color: color-mix(in srgb, var(--paper) 72%, transparent); }",
            1,
        )
        print("dark hover added")

    PATH.write_text(html, encoding="utf-8")
    remaining = len(INFO_RE.findall(html))
    linked = len(re.findall(r'<a class="c-title"', html))
    print(f"changed: {changed}; linked titles: {linked}; c-info-link left: {remaining}")


if __name__ == "__main__":
    main()
