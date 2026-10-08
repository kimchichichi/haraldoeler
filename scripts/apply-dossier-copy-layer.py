#!/usr/bin/env python3
"""Make Duo KlAkk paragraphs copy as one line, while staying selectable.

Chromium paints one PDF text run per visual line, and PDFKit turns each run
into a newline. The painted text is left untouched. A second, invisible text
layer sits on those same lines. Its type size is just larger than the line
gap, so PDFKit joins a wrapped paragraph, and a drag still lands on the words.
"""
import json
import sys

from fontTools.ttLib import TTFont
from pypdf import PdfWriter
from pypdf.generic import DecodedStreamObject, DictionaryObject, NameObject

EMPTY_CMAP = b"""/CIDInit /ProcSet findresource begin
12 dict begin
begincmap
/CIDSystemInfo << /Registry (Adobe) /Ordering (UCS) /Supplement 0 >> def
/CMapName /Adobe-Identity-UCS def
/CMapType 2 def
1 begincodespacerange
<0000> <FFFF>
endcodespacerange
endcmap
CMapName currentdict /CMap defineresource pop
end
end
"""

HELVETICA = "/System/Library/Fonts/Helvetica.ttc"


def load_widths():
    font = TTFont(HELVETICA, fontNumber=0)
    cmap = font.getBestCmap()
    advances = {name: width for name, (width, _) in font["hmtx"].metrics.items()}
    upem = font["head"].unitsPerEm
    widths = {}
    for code, name in cmap.items():
        widths[code] = advances.get(name, upem * 0.5) * 1000 / upem
    return widths


WIDTHS = load_widths()


def pdf_literal(text: str) -> bytes:
    try:
        raw = text.encode("cp1252")
    except UnicodeEncodeError as exc:
        raise SystemExit(f"Copy text is not WinAnsi: {text!r} ({exc})") from exc
    out = bytearray(b"(")
    for byte in raw:
        if byte in (ord("\\"), ord("("), ord(")")):
            out += b"\\" + bytes([byte])
        else:
            out += bytes([byte])
    out += b")"
    return bytes(out)


def text_width(text: str, size: float) -> float:
    return sum(WIDTHS.get(ord(char), 500) for char in text) * size / 1000


def x_span(lines):
    return min(line["x"] for line in lines), max(line["x"] + line["w"] for line in lines)


def overlaps_x(left, right):
    a0, a1 = x_span(left)
    b0, b1 = x_span(right)
    return min(a1, b1) - max(a0, b0) > 8


def nearest_vertical_gap(lines, others):
    top = max(line["y"] for line in lines)
    bottom = min(line["y"] for line in lines)
    gaps = []
    for other in others:
        if other is lines or not overlaps_x(lines, other):
            continue
        other_top = max(line["y"] for line in other)
        other_bottom = min(line["y"] for line in other)
        if other_bottom >= top - 1:
            gaps.append(other_bottom - top)
        elif other_top <= bottom + 1:
            gaps.append(bottom - other_top)
    usable = [gap for gap in gaps if gap > 1]
    return min(usable) if usable else None


def choose_size(lines, neighbor_gap):
    height = max(line["h"] for line in lines) or 10
    if len(lines) == 1:
        size = max(8, min(height * 0.95, 28))
    else:
        gaps = [abs(lines[i]["y"] - lines[i + 1]["y"]) for i in range(len(lines) - 1)]
        size = max(gaps) + 0.6
    if neighbor_gap and size >= neighbor_gap - 0.3:
        tightened = max(6, neighbor_gap - 0.6)
        if len(lines) > 1 and tightened <= max(abs(lines[i]["y"] - lines[i + 1]["y"]) for i in range(len(lines) - 1)):
            print(f"warning: paragraph may stay line-broken ({lines[0]['text'][:48]!r})", file=sys.stderr)
        size = tightened
    return size


def block_stream(lines, size) -> bytes:
    ordered = sorted(lines, key=lambda line: -line["y"])
    body = b"q\nBT\n3 Tr\n"
    for line in ordered:
        natural = text_width(line["text"], size)
        scale = 100 if natural <= 1 else max(20, min(160, line["w"] / natural * 100))
        body += (
            f"/Fcopy {size:.2f} Tf\n{scale:.2f} Tz\n"
            f"1 0 0 1 {line['x']:.2f} {line['y']:.2f} Tm\n"
        ).encode()
        body += pdf_literal(line["text"]) + b" Tj\n"
    body += b"ET\nQ\n"
    return body


def page_stream(blocks) -> bytes:
    groups = [lines for lines in blocks if lines]
    stream = b""
    for lines in groups:
        size = choose_size(lines, nearest_vertical_gap(lines, groups))
        stream += block_stream(lines, size)
    return stream


def blank_tounicode(writer: PdfWriter) -> None:
    seen = set()
    for page in writer.pages:
        fonts = page["/Resources"].get("/Font")
        if fonts is None:
            continue
        for ref in fonts.values():
            font = ref.get_object()
            to_unicode = font.get("/ToUnicode")
            if to_unicode is None:
                continue
            stream = to_unicode.get_object()
            if id(stream) in seen:
                continue
            seen.add(id(stream))
            stream.set_data(EMPTY_CMAP)


def add_copy_font(page) -> None:
    fonts = page["/Resources"]["/Font"]
    fonts[NameObject("/Fcopy")] = DictionaryObject({
        NameObject("/Type"): NameObject("/Font"),
        NameObject("/Subtype"): NameObject("/Type1"),
        NameObject("/BaseFont"): NameObject("/Helvetica"),
        NameObject("/Encoding"): NameObject("/WinAnsiEncoding"),
    })


def prepend_copy_text(page, blocks) -> None:
    add_copy_font(page)
    contents = page.get_contents()
    if contents is None:
        raise SystemExit("PDF page has no content stream")
    stream = DecodedStreamObject()
    stream.set_data(page_stream(blocks) + contents.get_data())
    page.replace_contents(stream)


def main() -> None:
    if len(sys.argv) != 3:
        raise SystemExit(f"Usage: {sys.argv[0]} INPUT.pdf LINES.json")
    pdf_path, json_path = sys.argv[1], sys.argv[2]
    pages = json.loads(open(json_path, encoding="utf-8").read())
    writer = PdfWriter(clone_from=pdf_path)
    if len(pages) != len(writer.pages):
        raise SystemExit(f"Page count {len(writer.pages)} != copy blocks {len(pages)}")
    blank_tounicode(writer)
    for page, blocks in zip(writer.pages, pages):
        prepend_copy_text(page, blocks)
    with open(pdf_path, "wb") as handle:
        writer.write(handle)


if __name__ == "__main__":
    main()
