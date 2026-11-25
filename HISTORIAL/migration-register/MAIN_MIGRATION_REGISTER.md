# Main Migration Register

**Status:** Initial inventory — review and source-level inspection pending.

| ID | Current source | Intended archive location | Candidate Main owner | Initial disposition | Required evidence before removal |
|---|---|---|---|---|---|
| H-001 | `prototype/cin-core/` | `HISTORIAL/prototypes/cin-core/` | `Main/core/` | Historical snapshot and Main copy present; CI acceptance pending | Main/core CI, source/consumer audit, behavior parity; only then retire old path |
| H-002 | `prototype/linux-runtime/` | `HISTORIAL/prototypes/linux-runtime/` | `Main/bootstrap/linux-runtime/` (preserved prototype copy); later `Main/application/` and `Main/lobby/` integration | Historical snapshot and Main copy present; integration pending | Main runtime build, launch, close/reopen, package tests and application-service integration |
| H-003 | `Core Identification Node Github/` | `HISTORIAL/prototypes/genesis-lobby/` | `Main/lobby/` and `Main/bootstrap/` | REFERENCE / ADAPT pending asset and workflow review | Asset inventory, route/link audit, behavior comparison |
| H-004 | Existing CI workflows | `HISTORIAL/superseded-documentation/` only when replaced | `.github/workflows/` | KEEP ACTIVE | Replacement workflow passes same and expanded checks |
| H-005 | Existing scripts | Archive only after replacement | `scripts/ci/` or `scripts/package/` | KEEP ACTIVE | Call-site inventory and equivalent test results |
| H-006 | Existing schemas, examples and test vectors | Archive only superseded versions | `specifications/`, `Main/documents/` | KEEP / VERSION | Schema compatibility and consumer migration |
| H-007 | Existing architecture and lifecycle specifications | Superseded copies only | `Documentation/` and `docs/` | KEEP AS SOURCE OF TRUTH UNTIL SUCCESSOR REVIEW | ADR, successor review and link validation |

## Migration activity recorded on `architecture/main-reorganization`

- H-001: the source crate has a historical snapshot at `HISTORIAL/prototypes/cin-core/` and a copy at `Main/core/`. The Main copy includes core exports, typed errors, lifecycle model, DataRoot, document envelope/validation, JSON Schema validator, storage repository/transactional store, recovery inspection, Genesis audit/manifest and both CLI runners. Original source remains at `prototype/cin-core/`. This is a ported copy, not yet CI-accepted.
- Added `.github/workflows/main-core.yml` to run format, Clippy, check and unit tests against Main/core on PRs/pushes to main.
- H-002: the Linux runtime has both a historical snapshot at `HISTORIAL/prototypes/linux-runtime/` and a preserved prototype copy at `Main/bootstrap/linux-runtime/`; the original source remains at `prototype/linux-runtime/`. The Main copy is not yet integrated with Main/core.\n- H-003: the GitHub Pages Lobby remains at `Core Identification Node Github/`; its archival snapshot and UI integration are still pending.

## Required fields for each future entry

- Source path and source commit.
- Archive path and archive commit.
- Candidate Main destination.
- Functional purpose and ownership.
- Dependencies and all known consumers.
- Existing tests and observed maturity.
- Reuse disposition: REUSE, ADAPT, REFERENCE, SUPERSEDED or RETIRED.
- Porting change and behavior differences.
- Test evidence and review/PR reference.
- Date and responsible decision.

## Initial findings

The repository already documents a portable ZIP execution model, package verification, Environment Audit, Genesis Manifest, separate Node Birth Record, separate personal registration and credential issuance, evidence provenance, profile/history and Main Lobby reconstruction. These contracts are migration inputs and must not be replaced by a simplified three-certificate flow without an explicit ADR.

The current prototype paths are not moved by this register. They remain in place until their build and CI dependencies are migrated and parity is demonstrated.
