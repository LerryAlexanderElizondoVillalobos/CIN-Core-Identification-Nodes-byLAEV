# Migration file mapping plan

This plan tracks the existing repository tree (233 entries at the audit snapshot) into the Linux-first Main architecture.

## Moved/copy-migrated with functional source
| Existing source | Main destination | Status |
|---|---|---|
| `prototype/linux-runtime/Cargo.toml` | `Main/runtime/linux-portable/Cargo.toml` | Migrated; crate renamed to `cin-linux-main` |
| `prototype/linux-runtime/src/main.rs` | `Main/runtime/linux-portable/src/main.rs` | Migrated; embedded UI path updated |
| `prototype/linux-runtime/src/browser.rs` | `Main/runtime/linux-portable/src/browser.rs` | Migrated |
| `prototype/linux-runtime/src/runtime_lifecycle.rs` | `Main/runtime/linux-portable/src/runtime_lifecycle.rs` | Migrated |
| `prototype/dist/index.html` | `Main/interfaces/local-web/index.html` | Migrated |
| `prototype/cin-core/**` | `Main/core/domain/**` | Migrated; package name kept `cin-core` |

## Main destinations
- `Main/installation/linux`: install/uninstall/package and Linux acceptance.
- `Main/installation/lindesk`: Android client integration documentation/adapter boundary.
- `Main/installation/bridge`: request protocol and transport-neutral envelope.
- `Main/runtime/linux-portable`: primary local Linux runtime.
- `Main/interfaces/local-web`: embedded UI.
- `Main/core/domain`: CIN domain crate.
- `Main/core/runtime`: secondary Python control/status CLI.
- `Main/core/configuration`: configuration.
- `Main/core/module-manager`: module registration and lifecycle boundary.
- `Main/engines`: independent domain capabilities.
- `Main/applications`: application boundary.
- `Main/storage`: persistent data organization.
- `Main/system/linux`: Linux integration.

## Retain (temporary, referenced by legacy workflows)
| Existing root path | Disposition | Reason |
|---|---|---|
| `.github/` | KEEP | CI and Pages publication workflows; paths updated where runtime tests migrated |
| `Core Identification Node Github/` | KEEP | Published Pages source and publication workflow path |
| `certificates/` | KEEP | Genesis certificate source until engine/application integration is completed |
| `docs/` | KEEP | Canonical architecture, project, audit and technical documentation |
| `e2e/` | KEEP | E2E suite; binary target now Main |
| `examples/` | KEEP | Manifest/document examples |
| `prototype/` | ARCHIVE/TRANSITION | Original Rust sources kept while compatibility validation runs |
| `research/` | KEEP | Research/dialogues |
| `schemas/` and `specifications/` | KEEP | Canonical contracts and schema sources |
| `scripts/` | KEEP/TRANSITION | CI and existing package scripts retained while Main-owned scripts become authoritative |
| `services/` | TRANSITION | Local backend and OAuth worker not yet migrated |
| `termux-cin/` | TRANSITION | Android/Termux service not yet migrated into Main |
| `tests/` | KEEP | Existing test coverage while paths are migrated |

## Remaining file-level mapping
Every remaining file receives a later mapping entry including destination, dependency, test evidence, and disposition. No files are removed simply to make the tree look clean. Legacy copies are removed only after Main builds/tests and path references are verified.
