#!/usr/bin/env python3
"""Save CDP Page.captureScreenshot JSON (or raw base64) to PNG + WebP."""
import base64
import json
import subprocess
import sys
from pathlib import Path

if len(sys.argv) < 3:
    print("Usage: save-review-shot.py <cdp-json-or-b64-file> <out-base-no-ext>")
    sys.exit(1)

src = Path(sys.argv[1])
out_base = Path(sys.argv[2])
raw = src.read_text(encoding="utf-8").strip()
if raw.startswith("{"):
    payload = json.loads(raw)
    b64 = payload.get("data") or payload.get("result", {}).get("data")
else:
    b64 = raw

if not b64:
    print("No screenshot data found", file=sys.stderr)
    sys.exit(1)

png_path = out_base.with_suffix(".png")
webp_path = out_base.with_suffix(".webp")
png_path.parent.mkdir(parents=True, exist_ok=True)
png_path.write_bytes(base64.b64decode(b64))
subprocess.run(["cwebp", "-q", "85", str(png_path), "-o", str(webp_path)], check=True)
print(png_path, webp_path, f"{png_path.stat().st_size}b png", f"{webp_path.stat().st_size}b webp")
