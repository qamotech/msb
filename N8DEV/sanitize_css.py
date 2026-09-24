#!/usr/bin/env python3
"""Add -webkit- prefixes to mask-image and backdrop-filter declarations.

These single-file HTML apps have no build step, so there is no autoprefixer to
lean on. Safari still needs -webkit-backdrop-filter (<18) and -webkit-mask-image
(<15.4), and re-minifying a page tends to strip the prefixes back out, so this
is safe to re-run over a whole tree whenever that happens.

Idempotent: the strip pass removes any existing prefixed declaration before the
rewrite pass re-adds it, so running twice yields byte-identical output.

Usage:
    python sanitize_css.py FILE [FILE ...]
    python sanitize_css.py --check FILE [FILE ...]   # report only, exit 1 if work pending
"""

import argparse
import re
import sys

# Strip any existing prefixed declaration (including accidental -webkit--webkit-),
# then re-emit the prefixed + bare pair. Order matters: strip before rewrite.
PROPERTIES = ("mask-image", "backdrop-filter")


def sanitize(content: str, indent: str = "      ") -> str:
    for prop in PROPERTIES:
        content = re.sub(rf"(-webkit-)+{prop}:.*?\n\s*", "", content)
        content = re.sub(
            rf"(?<!-){prop}:(.*?);",
            rf"-webkit-{prop}:\1;\n{indent}{prop}:\1;",
            content,
        )
    return content


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__,
                                 formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("files", nargs="+", help="HTML/CSS files to prefix in place")
    ap.add_argument("--check", action="store_true",
                    help="report what would change without writing")
    ap.add_argument("--indent", default="      ",
                    help="indent for the inserted bare declaration (default: 6 spaces)")
    args = ap.parse_args()

    pending = 0
    for path in args.files:
        try:
            with open(path, "r", encoding="utf-8") as f:
                original = f.read()
        except (OSError, UnicodeDecodeError) as e:
            print(f"skip  {path}: {e}", file=sys.stderr)
            continue

        updated = sanitize(original, args.indent)
        if updated == original:
            print(f"ok    {path}")
            continue

        pending += 1
        if args.check:
            print(f"NEEDS {path}")
            continue

        with open(path, "w", encoding="utf-8") as f:
            f.write(updated)
        delta = len(updated) - len(original)
        print(f"fixed {path} ({delta:+d} bytes)")

    if args.check and pending:
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
