# Migration file mapping plan

Inventory snapshot: `main` contained 233 tracked tree entries at audit time. Full path snapshot and root classifications are in [REPOSITORY-INVENTORY.md](REPOSITORY-INVENTORY.md).

## Source migrated into Main
| Existing source | Main destination | Migration status |
|---|---|---|
| `prototype/linux-runtime/Cargo.toml` | `Main/runtime/linux-portable/Cargo.toml` | Copied, package renamed to `cin-linux-main` |
| `prototype/linux-runtime/src/main.rs` | `Main/runtime/linux-portable/src/main.rs` | Copied; embedded UI path updated |
| `prototype/linux-runtime/src/browser.rs` | `Main/runtime/linux-portable/src/browser.rs` | Copied unchanged |
| `prototype/linux-runtime/src/runtime_lifecycle.rs` | `Main/runtime/linux-portable/src/runtime_lifecycle.rs` | Copied unchanged |
| `prototype/dist/index.html` | `Main/interfaces/local-web/index.html` | Copied; embedded in runtime |
| `prototype/cin-core/Cargo.toml` | `Main/core/domain/Cargo.toml` | Migrated; crate name `cin-core` preserved |
| `prototype/cin-core/src/**` (20 tracked entries) | `Main/core/domain/src/**` | Source copied; all module paths preserved |
| `termux-cin/**` | `Main/installation/android-termux/**` | Source migrated; setup and main README added |
| `services/cin-local-backend/**` | `Main/services/cin-local-backend/**` | Source and test migrated |

## Main ownership
- `Main/runtime/linux-portable`: primary Linux runtime, lifecycle and local HTTP server.
- `Main/interfaces/local-web`: embedded UI.
- `Main/core/domain`: Rust domain library, Genesis/certificate runners, storage/recovery.
- `Main/core/runtime`: secondary Python control/status CLI.
- `Main/installation/linux`: installer, uninstaller, portable packaging.
- `Main/installation/android-termux`: Android-side local backend, OAuth, scoped GitHub connector, permission engine, signing interface, workspace integration.
- `Main/services/cin-local-backend`: local pairing and persistent-state service.
- `Main/engines`: planned independent engine installation and lifecycle contracts.
- `Main/applications`: application ownership boundary.
- `Main/storage`: persistent storage layout.
- `Main/system/linux`: Linux host integration.

## Transitional paths retained
| Source path | Disposition | Reason |
|---|---|---|
| `.github/` | KEEP | workflow, Pages publishing and CI; Linux workflows updated to test Main |
| `Core Identification Node Github/` | KEEP | Pages publish source remains tied to current publishing workflows |
| `certificates/` | KEEP | certificate assets pending certificate-engine integration |
| `docs/` | KEEP | architecture and project docs pending ownership consolidation |
| `e2e/` | KEEP | test harness retained; runtime binary path updated to Main |
| `examples/` | KEEP | example payloads |
| `prototype/linux-runtime`, `prototype/dist` | TRANSITION/ARCHIVE | original runtime mirror kept until Main CI acceptance |
| `prototype/cin-core` | TRANSITION/ARCHIVE | original domain mirror kept until Main CI acceptance |
| `research/` | KEEP | research content |
| `schemas/`, `specifications/` | KEEP | canonical schemas/specs |
| `scripts/` | KEEP/TRANSITION | existing validators and legacy packager retained |
| `services/cin-local-backend` | TRANSITION | source copied into Main; original kept until references/tests are reconciled |
| `termux-cin/` | TRANSITION | source copied into Main; original kept for Android compatibility |
| `tests/` | KEEP | legacy tests remain during test consolidation |
| Root docs and CI config | KEEP | repository-level governance, roadmap and project overview |

## Removal policy
No legacy duplicate is removed in this migration branch until Main builds/tests, CI validates migrated packages, and every workflow/path reference has been checked. Copies are intentionally preserved rather than risking destructive moves.
