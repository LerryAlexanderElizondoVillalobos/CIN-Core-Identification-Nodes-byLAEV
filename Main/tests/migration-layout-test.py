#!/usr/bin/env python3
"""Structural acceptance check for the Linux-first Main migration."""
from pathlib import Path
import json
import re

MAIN = Path(__file__).resolve().parents[1]
required = [
    "runtime/linux-portable/Cargo.toml",
    "runtime/linux-portable/src/main.rs",
    "interfaces/local-web/index.html",
    "core/domain/Cargo.toml",
    "core/domain/src/lib.rs",
    "core/module-manager/cin_module.py",
    "core/module-manager/test-module-manager.py",
    "engines/merkle-tree/Cargo.toml",
    "engines/merkle-tree/src/lib.rs",
    "engines/certificate/assets/local/CIN-GENESIS-ENVIRONMENT.cincert",
    "engines/certificate/assets/pages/CIN-GENESIS-ENVIRONMENT.cincert",
    "installation/linux/install.sh",
    "installation/linux/uninstall.sh",
    "installation/linux/package-portable.sh",
    "installation/android-termux/src/server.js",
    "services/cin-local-backend/src/server.js",
    "services/cin-local-backend/test/server.test.mjs",
    "migration/REPOSITORY-INVENTORY.md",
    "migration/FILE-MAPPING-PLAN.md",
    "migration/STATUS.md",
]
missing = [path for path in required if not (MAIN / path).is_file()]
if missing:
    raise SystemExit("Missing Main migration files: " + ", ".join(missing))

domain_cargo = (MAIN / "core/domain/Cargo.toml").read_text()
runtime_cargo = (MAIN / "runtime/linux-portable/Cargo.toml").read_text()
assert 'name = "cin-core"' in domain_cargo, "Domain crate name must remain cin-core"
assert 'name = "cin-linux-main"' in runtime_cargo, "Main Linux runtime package name mismatch"
for descriptor in (MAIN / "core/module-manager/modules").glob("*.json"):
    module = json.loads(descriptor.read_text())
    assert module["module_id"], f"Missing module id in {descriptor}"
    assert module.get("platform"), f"Missing module platform in {descriptor}"
print(f"Main migration layout validated: {len(required)} required paths and module descriptors.")
