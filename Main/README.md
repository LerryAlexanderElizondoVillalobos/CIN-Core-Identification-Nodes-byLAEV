# CIN Main — Linux-first installation and runtime

**Linux is CIN's primary installation and runtime target. Lindesk Android is the intended mobile installation/control entry point.**

Main is the authoritative runtime and installation structure for Linux. It contains the migrated portable Rust runtime, local web interface, CIN domain-core crate, local backend service, Android/Termux integration source and declarative module registry. Original root-level copies remain transitional until all dependencies, tests, and publication workflows are migrated.

## Install
```bash
bash Main/installation/linux/install.sh
```
The installer copies Main into `~/.local/share/cin`, builds the Rust local runtime and domain tools when Cargo is available, installs `cin-main`, `cin-main-cli` and `cin-module` launchers, and optionally configures a systemd user service. It does not require root.

## Main tree
- `runtime/linux-portable`: primary Rust Linux local runtime and lifecycle.
- `interfaces/local-web`: embedded local web UI.
- `core/domain`: document model, lifecycle, schema validation, Genesis audit/manifest, storage/recovery and command-line tools.
- `core/runtime`: secondary Python control CLI.
- `core/module-manager`: JSON module registry and CLI for declarative enablement.
- `core/configuration`: local runtime configuration.
- `installation/linux`: installer, uninstaller, portable package builder.
- `installation/android-termux`: migrated Android/Termux integration and setup.
- `installation/lindesk` and `installation/bridge`: integration contract boundary; concrete Lindesk transport is not assumed.
- `services/cin-local-backend`: migrated local pairing/state backend.
- `engines`, `applications`, `storage`, `system/linux`: functional boundaries and subsystem ownership.

## Build and test
```bash
bash Main/tests/smoke-test.sh
bash Main/build.sh
```

## Legacy source paths
Original Rust prototypes, Android backend, local backend, and Pages source remain temporarily in their prior locations. See [migration status](migration/STATUS.md) and [file mapping](migration/FILE-MAPPING-PLAN.md).
