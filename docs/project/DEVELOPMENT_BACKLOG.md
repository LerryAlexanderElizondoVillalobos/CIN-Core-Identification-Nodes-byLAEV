# CIN Development Backlog

**Governing workflow:** [GitHub Development Workflow](GITHUB_DEVELOPMENT_WORKFLOW.md)  
**Target:** First Successful CIN Main Lobby  
**Current planning phase:** M0 — Architecture Baseline  
**Status:** M0 is active; Issues #2 and #3 are closed, while #4, #5, #6 and #17 remain open. PRs #18 (Linux runtime prototype) and #19 (ADR-0005) are merged.

## M0 — Architecture Baseline

M0 is the active prerequisite phase. The status below reflects GitHub Issues and merged Pull Requests as of 2026-11-15.

| Issue | Work item | Current status | Remaining gate |
|---|---|---|---|
| [#2 Architecture baseline and decision register](https://github.com/LerryAlexanderElizondoVillalobos/CIN-Core-Identification-Nodes-byLAEV/issues/2) | Consolidate scope, terms, component boundaries and open decisions | **Closed — completed** | None for the architecture-baseline deliverable |
| [#3 Node lifecycle and state transition contract](https://github.com/LerryAlexanderElizondoVillalobos/CIN-Core-Identification-Nodes-byLAEV/issues/3) | Define authoritative states, transitions, idempotency and recovery | **Closed — specified and documentation-validated** | Runtime implementation and executable tests belong to later implementation Issues |
| [#4 Runtime and portable build audit](https://github.com/LerryAlexanderElizondoVillalobos/CIN-Core-Identification-Nodes-byLAEV/issues/4) | Inventory repository and select an evidence-based application stack | **Open — prototype integrated** | Real Linux desktop launch/close/reopen test, relocation/update behavior, signer simulator, cost/license audit and ADR-0004 |
| [#17 Linux portable runtime proof](https://github.com/LerryAlexanderElizondoVillalobos/CIN-Core-Identification-Nodes-byLAEV/issues/17) | Prove extracted ZIP launch and local persistence | **Open — CI proof passed; desktop acceptance pending** | Verify checksum, extract and launch on supported Linux desktop; GUI write, full close/reopen/read and relocation test |
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
- Linux x86_64 Tauri v2 feasibility prototype, extracted-folder ZIP packaging, SHA-256 checksum and headless cross-process persistence probe (PR #18; prototype only, not a final framework decision).
- ADR-0005 Zero-Cost Node Operation registered as Proposed (PR #19); operational acceptance evidence remains pending.

## Phase exit rule

M0 may close only after Issues #4, #5 and #6 meet their remaining evidence gates. A document being present is not sufficient evidence of runtime, cryptographic or storage implementation.

## Next execution order

1. Complete Issue #17's controlled Linux desktop acceptance: verify ZIP checksum, extract, launch GUI, write a probe, fully close, relaunch, read it back and repeat after moving the package directory. Tauri remains a prototype candidate, not an approved production stack.
2. Complete Issue #5's independent cryptographic interoperability vectors, wrong-key/tamper/purpose tests, signer simulator compatibility and production trust-policy decisions.
3. Implement the storage prototype for Issue #6: select the backend, exercise the data-root mode, atomic write/commit, restart recovery, interrupted writes, corrupted/missing references, duplicate operations and projection rebuild.
4. Complete the Zero-Cost dependency/license audit. Clarify the project's proprietary end-user execution and redistribution permissions before publishing a distributable node package.
5. Record ADR-0004 only after runtime comparison and owner review; retain ADR-0005 as Proposed until its operational acceptance evidence is met.
6. Review Issues #4, #5 and #6 together and close M0 only when all acceptance gates have evidence.
7. Open bounded M1 implementation Issues after M0 contracts and feasibility are accepted.

## Repository administration follow-up

Create GitHub Milestones M0–M10 and the agreed classification labels, then associate the existing M0 Issues with M0. Milestone and label creation remain an administrative task; the current repository state does not imply they have been configured.

---
*End of backlog.*
