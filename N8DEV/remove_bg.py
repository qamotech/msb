#!/usr/bin/env python3
"""Knock a dark background out of an image by mapping luminance to alpha.

Built for asset art drawn on black: each pixel keeps its colour and gets an
alpha proportional to its brightest channel, so near-black pixels become
transparent and bright pixels stay opaque. Works well on glows and soft edges,
which a hard chroma-key would clip.

Usage:
    python remove_bg.py INPUT [-o OUTPUT] [--threshold N]

    python remove_bg.py turtle_bot_assistant.jpg
    python remove_bg.py sprite.jpg -o sprite.png --threshold 60
"""

import argparse
import sys
from pathlib import Path

try:
    from PIL import Image
except ImportError:
    sys.exit("Pillow is required: pip install Pillow")


def remove_background(input_path, output_path, threshold: float = 40.0):
    """Map max(r,g,b) to alpha; pixels at or above `threshold` are fully opaque."""
    if threshold <= 0:
        raise ValueError("threshold must be greater than 0")

    img = Image.open(input_path).convert("RGBA")
    scale = 255.0 / threshold
    # get_flattened_data() replaces getdata() in Pillow 14; fall back for older installs.
    pixels = getattr(img, "get_flattened_data", img.getdata)()
    img.putdata([
        (r, g, b, min(255, int(max(r, g, b) * scale)))
        for r, g, b, _ in pixels
    ])
    img.save(output_path, "PNG")
    return output_path


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__,
                                 formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("input", help="source image (any format Pillow reads)")
    ap.add_argument("-o", "--output",
                    help="destination PNG (default: input with .png extension)")
    ap.add_argument("--threshold", type=float, default=40.0,
                    help="luminance that becomes fully opaque; lower = more "
                         "aggressive knockout (default: 40)")
    args = ap.parse_args()

    src = Path(args.input)
    if not src.is_file():
        sys.exit(f"no such file: {src}")

    dst = Path(args.output) if args.output else src.with_suffix(".png")
    if dst.resolve() == src.resolve():
        sys.exit("refusing to overwrite the source image; pass -o")

    try:
        remove_background(src, dst, args.threshold)
    except (OSError, ValueError) as e:
        sys.exit(f"failed: {e}")

    print(f"wrote {dst}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
