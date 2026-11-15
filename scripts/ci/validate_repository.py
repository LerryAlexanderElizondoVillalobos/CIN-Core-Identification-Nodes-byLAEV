#!/usr/bin/env python3
"""Repository-level documentation checks; not runtime or crypto validation."""
from pathlib import Path
from urllib.parse import unquote
import re
import sys

ROOT = Path(__file__).resolve().parents[2]
FOLDERS = [ROOT / "docs", ROOT / "specifications"]
FILES = sorted(p for folder in FOLDERS if folder.exists() for p in folder.rglob("*.md"))
LINK = re.compile(r"(?<!!)\[[^\]]+\]\(([^)]+)\)")
errors = []

for required in [ROOT / "README.md", ROOT / "CONTRIBUTING.md", ROOT / "docs/project/PROJECT_STATUS_AND_ROADMAP.md"]:
    if not required.is_file():
        errors.append(f"Missing required document: {required.relative_to(ROOT)}")

for path in FILES:
    content = path.read_text(encoding="utf-8")
    if not content.strip():
        errors.append(f"Empty Markdown document: {path.relative_to(ROOT)}")
    for raw in LINK.findall(content):
        target = raw.strip().split()[0].strip("<>")
        if not target or target.startswith(("https://", "http://", "mailto:", "#")):
            continue
        local = unquote(target.split("#", 1)[0])
        if local and not (path.parent / local).resolve().exists():
            errors.append(f"Broken relative link in {path.relative_to(ROOT)}: {target}")

if errors:
    print("\n".join("ERROR: " + item for item in errors), file=sys.stderr)
    raise SystemExit(1)

print(f"Validated {len(FILES)} Markdown documents and their relative links.")
print("This check does not establish implementation or cryptographic validity.")
