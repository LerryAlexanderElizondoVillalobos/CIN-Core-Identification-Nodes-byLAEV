# CIN Development Backlog

**Governing workflow:** [GitHub Development Workflow](GITHUB_DEVELOPMENT_WORKFLOW.md)  
**Master implementation plan:** [CIN Master Implementation Workplan](CIN_MASTER_IMPLEMENTATION_WORKPLAN.md)  
**Target:** First Successful CIN Main Lobby  
**Status:** M0 active; implementation now follows P0–P12 dependency gates.

## M0 — Architecture Baseline
Existing Issues #2 and #3 are closed as architecture/specification work. Issues #4, #5, #6 and #17 remain open for runtime desktop acceptance, crypto interoperability and storage recovery. PRs #18 (Linux runtime prototype) and #19 (ADR-0005) are merged.

## Implementation phases
| Phase | Work | Gate |
|---|---|---|
| P0 | Runtime/data-root decisions, dependency/license audit, desktop portable acceptance | ADR and reproducible desktop evidence |
| P1 | Core foundation, errors, lifecycle, document interfaces | unit and contract tests |
| P2 | Local storage, atomic commit, recovery | interruption/restart tests |
| P3 | Crypto, trust, signer interface, verification | independent vectors and negative tests |
| P4 | Package verification and portable bootstrap | tamper/untrusted package rejection |
| P5 | Environment audit and Genesis Manifest | first logical record persisted/recovered |
| P6 | Authorization and issuer registry | scope/expiry/unavailable tests |
| P7 | Node birth | authorized record, identifier, idempotency |
| P8 | Personal registration and credential | separate authorization, allocator, independent verification |
| P9 | Evidence association | provenance and evidence status tests |
| P10 | Attributes, history, profile assembly | append history and reference validation |
| P11 | Main Lobby | header reconstructed from records |
| P12 | Full E2E and release | ZIP-to-Lobby and close/reopen acceptance |

## Immediate implementation evidence
- Added plan, directory ownership map, workflow catalog and implementation test strategy.
- Added the initial Rust domain crate at prototype/cin-core with typed errors and a guarded lifecycle transition model plus unit tests.
- Added a path-scoped CI workflow for formatting, Clippy, compilation and tests of cin-core.
- These additions are foundation scaffolding and lifecycle tests only; they do not implement storage, cryptography, Genesis, birth, registration or Lobby.

## Phase exit rule
Do not close a milestone merely because documents or directories exist. Each module passes Specified → Implemented → Tested → Integrated/Accepted with evidence in its Issue/PR. See the master workplan for ownership, test matrix, dependencies and acceptance criteria.
