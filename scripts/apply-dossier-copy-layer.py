#!/usr/bin/env python3
"""Give Duo KlAkk PDF paragraphs a continuous copy layer.

Chromium writes one PDF text run per visual line. PDFKit (Preview) then
inserts a newline at each of those runs, so a copied paragraph breaks on
every line. This replaces the extractable text with one invisible string
per paragraph. The painted page is unchanged.
"""
import json
import sys

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


def copy_stream(lines: list[str]) -> bytes:
    # Tiny type so a whole paragraph fits inside the page. PDFKit drops glyphs
    # past the media box, which would cut the copied sentence short.
    body = b"q\nBT\n/Fcopy 0.2 Tf\n12 TL\n3 Tr\n36 820 Td\n"
    for index, line in enumerate(lines):
        if index:
            body += b"T*\n"
        body += pdf_literal(line) + b" Tj\n"
    body += b"ET\nQ\n"
    return body


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


def prepend_copy_text(page, lines: list[str]) -> None:
    add_copy_font(page)
    contents = page.get_contents()
    if contents is None:
        raise SystemExit("PDF page has no content stream")
    stream = DecodedStreamObject()
    stream.set_data(copy_stream(lines) + contents.get_data())
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
    for page, lines in zip(writer.pages, pages):
        prepend_copy_text(page, lines)
    with open(pdf_path, "wb") as handle:
        writer.write(handle)


if __name__ == "__main__":
    main()
