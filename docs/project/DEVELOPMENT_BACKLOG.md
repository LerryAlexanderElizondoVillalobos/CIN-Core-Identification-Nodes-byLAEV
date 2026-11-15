# CIN Development Backlog

**Governing workflow:** [GitHub Development Workflow](GITHUB_DEVELOPMENT_WORKFLOW.md)  
**Target:** First Successful CIN Main Lobby  
**Current planning phase:** M0 — Architecture Baseline  
**Status:** Initial backlog opened; milestones and labels remain to be configured in repository settings.

## M0 — Architecture Baseline

M0 is the active prerequisite phase. The issues below are open and intentionally remain unassigned to a GitHub Milestone until repository milestone management is configured.

| Issue | Work item | Dependency |
|---|---|---|
| [#2 Architecture baseline and decision register](https://github.com/LerryAlexanderElizondoVillalobos/CIN-Core-Identification-Nodes-byLAEV/issues/2) | Consolidate scope, terms, component boundaries and open decisions | PR #1 |
| [#3 Node lifecycle and state transition contract](https://github.com/LerryAlexanderElizondoVillalobos/CIN-Core-Identification-Nodes-byLAEV/issues/3) | Define authoritative states, transitions, idempotency and recovery | #2 |
| [#4 Runtime and portable build audit](https://github.com/LerryAlexanderElizondoVillalobos/CIN-Core-Identification-Nodes-byLAEV/issues/4) | Inventory repository and select an evidence-based application stack | #2 |
| [#5 Common document, schema, signature and authorization contracts](https://github.com/LerryAlexanderElizondoVillalobos/CIN-Core-Identification-Nodes-byLAEV/issues/5) | Establish shared document and verifier semantics | #2, #3 |
| [#6 Local private storage and recovery contract](https://github.com/LerryAlexanderElizondoVillalobos/CIN-Core-Identification-Nodes-byLAEV/issues/6) | Specify persistence, atomicity, references and restart recovery | #2, #3 |

## Phase exit rule

M0 may close only after its architecture baseline, lifecycle contract, runtime audit, common document/verifier contract, and storage contract have been reviewed and validated. A document being present is not sufficient evidence of acceptance.

## Next phase gates

M1–M10 remain the roadmap sequence defined in the governing workflow. Their implementation Issues should be opened only after M0 clarifies the interfaces and dependencies sufficiently to make each task bounded and testable. No milestone completion is implied by this backlog index.

## Repository administration follow-up

Create GitHub Milestones M0–M10 and the agreed classification labels, then associate the existing M0 Issues with M0. The currently available GitHub integration in this session can create Issues and Pull Requests but does not expose milestone-creation or label-creation operations; no substitute or false completion is recorded here.
