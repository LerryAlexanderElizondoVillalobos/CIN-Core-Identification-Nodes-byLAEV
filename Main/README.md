# CIN Main — Linux-first installation and runtime

**Linux is CIN's primary installation and runtime target. Lindesk Android is the intended mobile installation/control entry point.**

Main is the authoritative runtime and installation structure for Linux. It now contains the migrated portable Rust runtime, local web interface, and CIN domain-core crate. Existing root-level components remain transitional sources until their dependents and workflows are migrated.

## Installation
```bash
bash Main/installation/linux/install.sh
```
The installer copies Main into `~/.local/share/cin`, builds the Rust local runtime and domain tools when Cargo is available, installs user launchers, and optionally configures systemd user service. It does not require root.

## Main tree
- `runtime/linux-portable`: Rust local web runtime and process lifecycle.
- `interfaces/local-web`: local runtime UI.
- `core/domain`: document model, lifecycle, schema validation, Genesis manifest and transactional local storage.
- `core/runtime`: Python control CLI (secondary control/status utility).
- `core/configuration`: local configuration.
- `installation/linux`: install, uninstall, portable packaging.
- `installation/lindesk` and `installation/bridge`: integration specification boundary; no unsupported Lindesk transport assumed.
- `engines`: planned independent capability boundaries.
- `applications`: application boundary.
- `storage`: persistent data layout.
- `migration`: inventory and move/retain/rewrite plan.

## Build and test
```bash
bash Main/tests/smoke-test.sh
(cd Main/runtime/linux-portable && cargo test && cargo build --release)
(cd Main/core/domain && cargo test && cargo build --release)
```

## Existing paths
The prior Rust prototypes, Android/Termux backend, local backend, published GitHub Pages application and specs remain in their source locations for compatibility during the staged transition. See [migration status](migration/STATUS.md) and [file mapping](migration/FILE-MAPPING-PLAN.md).
