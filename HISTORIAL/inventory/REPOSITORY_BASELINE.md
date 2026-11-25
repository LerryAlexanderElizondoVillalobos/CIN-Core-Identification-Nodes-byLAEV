# CIN Repository Baseline for Main Migration

**Repository:** `LerryAlexanderElizondoVillalobos/CIN-Core-Identification-Nodes-byLAEV`  
**Baseline branch:** `main`  
**Migration branch:** `architecture/main-reorganization`  
**Inventory status:** Initial path-level inventory; source-level audit remains pending.

## Existing architectural references inspected

- `docs/architecture/CIN_ARCHITECTURE_BASELINE_V1.md`
- `docs/architecture/CIN_MASTER_ARCHITECTURE_V1.md`
- `docs/architecture/CIN_IMPLEMENTATION_DIRECTORY_MAP.md`
- `docs/architecture/NODE_LIFECYCLE_ARCHITECTURE.md`
- `docs/project/PROJECT_STATUS_AND_ROADMAP.md`
- `docs/project/GITHUB_DEVELOPMENT_WORKFLOW.md`
- `docs/project/CIN_NODE_BIRTH_CERTIFICATE_DEVELOPMENT_PLAN_V1.md`
- `README.md`

## Existing implementation and asset paths identified

- `prototype/cin-core/`
- `prototype/linux-runtime/`
- `Core Identification Node Github/`
- `.github/workflows/`
- `scripts/`
- `specifications/` and existing schema/example assets, where present.

Exact file-by-file inventory, dependency graph and source commit references must be added before any physical move or deletion.

## Baseline architecture facts

1. The product baseline is portable ZIP extraction and local execution, not a conventional system installer.
2. Package verification and node birth are separate.
3. The Genesis Manifest is intended to be the first logical CIN record in private local storage.
4. Node Birth Authorization and Node Birth Record are separate from the Genesis Manifest.
5. Personal registration and credential issuance are separate from node birth.
6. Evidence provenance and verification state must be explicit.
7. The Main Lobby is a read/presentation layer reconstructed from persisted records.
8. Existing status documentation distinguishes architecture, prototype, implementation, testing and integration maturity.

## Migration constraint

Do not move or delete existing source files during the initial Main skeleton phase. Preserve current CI and prototype execution. Archive and port in separate, reviewable changes with source/destination records and test evidence.
