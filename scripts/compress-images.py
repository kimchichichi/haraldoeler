#!/usr/bin/env python3
"""
이미지 압축 스크립트
- PNG → WebP 변환 (quality 82)
- 대용량 WebP 재압축 (5MB 초과 시 quality 75, 최대 2400px)
"""
import os
import sys
from pathlib import Path
from PIL import Image

BASE = Path(__file__).parent.parent
MAX_DIM = 2400
WEBP_QUALITY = 82
LARGE_THRESHOLD_MB = 5
LARGE_QUALITY = 75

def compress_webp(path: Path):
    size_mb = path.stat().st_size / 1_000_000
    if size_mb < LARGE_THRESHOLD_MB:
        return
    img = Image.open(path)
    w, h = img.size
    if w > MAX_DIM or h > MAX_DIM:
        img.thumbnail((MAX_DIM, MAX_DIM), Image.LANCZOS)
    before = path.stat().st_size
    img.save(path, "WEBP", quality=LARGE_QUALITY, method=6)
    after = path.stat().st_size
    print(f"  webp  {path.relative_to(BASE)}  {before//1000}KB → {after//1000}KB")

def convert_png(path: Path):
    out = path.with_suffix(".webp")
    img = Image.open(path)
    w, h = img.size
    if w > MAX_DIM or h > MAX_DIM:
        img.thumbnail((MAX_DIM, MAX_DIM), Image.LANCZOS)
    before = path.stat().st_size
    img.save(out, "WEBP", quality=WEBP_QUALITY, method=6)
    after = out.stat().st_size
    print(f"  png→webp  {path.relative_to(BASE)}  {before//1000}KB → {after//1000}KB")
    return out

converted_pngs = []

print("=== WebP 대용량 재압축 ===")
for webp in sorted(BASE.rglob("*.webp")):
    if "node_modules" in webp.parts:
        continue
    compress_webp(webp)

print("\n=== PNG → WebP 변환 ===")
for png in sorted(BASE.rglob("*.png")):
    if "node_modules" in png.parts:
        continue
    if png.name in ("apple-touch-icon.png", "apple-touch-icon-precomposed.png"):
        continue
    out = convert_png(png)
    converted_pngs.append((png, out))

print(f"\n변환된 PNG 수: {len(converted_pngs)}")
print("\n다음 단계: HTML 파일에서 .png 참조를 .webp 로 교체하세요")
for png, webp in converted_pngs:
    print(f"  {png.name} → {webp.name}")
