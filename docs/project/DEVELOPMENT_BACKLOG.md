# CIN Development Backlog

**Governing workflow:** [GitHub Development Workflow](GITHUB_DEVELOPMENT_WORKFLOW.md)  
**Target:** First Successful CIN Main Lobby  
**Current planning phase:** M0 — Architecture Baseline  
**Status:** M0 is active; Issues #2 and #3 are closed, while #4, #5 and #6 remain open.

## M0 — Architecture Baseline

M0 is the active prerequisite phase. The status below reflects GitHub Issues and merged Pull Requests as of 2026-11-15.

| Issue | Work item | Current status | Remaining gate |
|---|---|---|---|
| [#2 Architecture baseline and decision register](https://github.com/LerryAlexanderElizondoVillalobos/CIN-Core-Identification-Nodes-byLAEV/issues/2) | Consolidate scope, terms, component boundaries and open decisions | **Closed — completed** | None for the architecture-baseline deliverable |
| [#3 Node lifecycle and state transition contract](https://github.com/LerryAlexanderElizondoVillalobos/CIN-Core-Identification-Nodes-byLAEV/issues/3) | Define authoritative states, transitions, idempotency and recovery | **Closed — specified and documentation-validated** | Runtime implementation and executable tests belong to later implementation Issues |
| [#4 Runtime and portable build audit](https://github.com/LerryAlexanderElizondoVillalobos/CIN-Core-Identification-Nodes-byLAEV/issues/4) | Inventory repository and select an evidence-based application stack | **Open — partially complete** | Runtime prototype, extracted-folder launch, offline operation, persistence/restart proof and ADR-0004 |
| [#5 Common document, schema, signature and authorization contracts](https://github.com/LerryAlexanderElizondoVillalobos/CIN-Core-Identification-Nodes-byLAEV/issues/5) | Establish shared document and verifier semantics | **Open — structures and schemas integrated** | Independent cryptographic interoperability vectors, signer compatibility and production trust policy |
| [#6 Local private storage and recovery contract](https://github.com/LerryAlexanderElizondoVillalobos/CIN-Core-Identification-Nodes-byLAEV/issues/6) | Specify persistence, atomicity, references and restart recovery | **Open — specification integrated** | Storage prototype, data-root decision, write/read/restart and interrupted-write recovery tests |

## M0 deliverables already integrated

- Architecture baseline, component dependency map and ADR numbering register.
- Explicit portable ZIP execution model: download → verify → extract → run locally.
- Lifecycle specification with PRENATAL, Genesis Lobby and Main Lobby states.
- Common document envelope and independent verification-result model.
- JSON Schema schemas, examples and automated structural positive/negative validation.
- Private local storage specification and logical record storage layout.
- Repository technical audit with a reproducible tracked-file inventory and provisional runtime comparison.
- GitHub Actions for repository/documentation validation, YAML syntax and JSON Schema validation.

## Phase exit rule

M0 may close only after Issues #4, #5 and #6 meet their remaining evidence gates. A document being present is not sufficient evidence of runtime, cryptographic or storage implementation.

## Next execution order

1. Complete the minimal portable-runtime proof required by Issue #4. Tauri is the first candidate to prototype, not an approved stack.
2. Complete independent cryptographic test vectors and external signer compatibility for Issue #5.
3. Build the storage prototype and verify write/read/restart/recovery for Issue #6. The data-root decision must be tested with package relocation and update behavior.
4. Review all three remaining Issues together and close M0 only when their acceptance evidence is complete.
5. Open bounded M1 implementation Issues after M0 contracts and runtime feasibility are accepted.

## Repository administration follow-up

Create GitHub Milestones M0–M10 and the agreed classification labels, then associate the existing M0 Issues with M0. Milestone and label creation remain an administrative task; the current repository state does not imply they have been configured.

---
*End of backlog.*
