# CIN HISTORIAL — Previous Development Archive

**Purpose:** preserve previous CIN implementations, prototypes, interfaces, directory layouts and superseded documentation as reference material for the active `Main/` product.

## Governing rule

Nothing in this directory is the active production implementation. New product development belongs in `Main/`.

Historical material is preserved so that useful work can be inspected, tested, adapted and selectively incorporated into Main. Archiving does not mean that the material is invalid or useless; it means that it is no longer the authoritative location for current development.

Git commit history remains the authoritative provenance record. This directory provides an accessible project-level archive and migration map.

## Planned archive structure

```text
HISTORIAL/
├── README.md
├── inventory/
│   ├── REPOSITORY_BASELINE.md
│   └── LEGACY_COMPONENT_INVENTORY.md
├── prototypes/
│   ├── cin-core/
│   ├── linux-runtime/
│   └── genesis-lobby/
├── previous-structures/
│   └── directory-maps/
├── previous-interfaces/
├── superseded-documentation/
└── migration-register/
    └── MAIN_MIGRATION_REGISTER.md
```

## Initial known source locations

| Existing source | Historical treatment | Candidate Main destination |
|---|---|---|
| `prototype/cin-core/` | Preserve as Rust prototype snapshot after dependency inventory | Domain services, storage, crypto, verification or other modules only after code review |
| `prototype/linux-runtime/` | Preserve as Linux/Tauri feasibility snapshot until all build references are migrated | `Main/bootstrap/`, `Main/application/`, `Main/system/linux/`, `Main/lobby/` |
| `Core Identification Node Github/` | Preserve current web-facing Genesis Lobby assets and documentation | `Main/lobby/` and `Main/bootstrap/` only where compatible |
| Existing CI workflows and scripts | Keep active until replacement checks are proven; archive only superseded versions | `.github/workflows/` and `scripts/ci/` |
| Existing schemas, examples and test vectors | Retain as authoritative when still current; superseded versions are archived with version references | `specifications/` and `Main/documents/` |
| Existing architecture and lifecycle documentation | Keep current specifications available during migration; archive only after a reviewed successor exists | `Documentation/` and `docs/` |

## Safe archive procedure

1. Record the baseline commit and inventory exact paths.
2. Identify all imports, build scripts, workflows, tests, links and package references to each source path.
3. Copy the legacy material into the appropriate HISTORIAL subdirectory; do not delete the original in the same change.
4. Record source path, archive path, source commit, purpose, maturity, dependencies, tests and migration decision.
5. Port a bounded functional slice into Main.
6. Update every consumer and CI path.
7. Run tests from the new location and demonstrate parity or document intentional behavior changes.
8. Remove the old active path only in a later reviewed change after parity is established.

## Reuse classification

Each archived component must receive one disposition:

- **REUSE:** compatible and tested for direct use.
- **ADAPT:** useful logic requires refactoring or contract changes.
- **REFERENCE:** useful for design or behavior, but not directly reusable.
- **SUPERSEDED:** replaced by a newer specification or implementation.
- **RETIRED:** no longer needed; retained for provenance.

Do not describe a component as reusable based only on its filename or documentation. Inspect source code and run relevant tests.

## Migration register

The migration register is maintained at `HISTORIAL/migration-register/MAIN_MIGRATION_REGISTER.md`. Every movement or reuse decision must be recorded there.

---
*HISTORIAL is a preservation and learning area. Main remains the only active product implementation root.*
