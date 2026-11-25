# CIN Development History

## Superseded development cycle

The previous Main reorganization, prototype migrations, Linux runtime copies, prior directory plan, CI additions and associated implementation decisions are considered superseded for the new development cycle.

They remain preserved in Git history and in the development branch:

- Branch: `architecture/main-reorganization`
- Draft PR: [#46 — Establish Main and migrate the existing Rust core foundation](https://github.com/LerryAlexanderElizondoVillalobos/CIN-Core-Identification-Nodes-byLAEV/pull/46)
- Follow-up issue: [#47 — Audit and migrate the portable Linux runtime](https://github.com/LerryAlexanderElizondoVillalobos/CIN-Core-Identification-Nodes-byLAEV/issues/47)

The branch and PR are retained as historical records, not as the active implementation direction. Nothing from that cycle should be merged into the new Main by default.

## New development cycle

The new active implementation begins in `Main/` on branch `architecture/cin-main-fresh-foundation`.

The new architecture, directory structure, product boundaries, workflows and implementation order must be defined from the project owner's new strategy. Historical code may be consulted selectively, but reuse is optional and must never dictate the new design.

## Preservation rule

Do not delete the historical branch, its commits, old pull requests, prototypes or previous documentation as part of starting the new Main. They are retained for traceability and selective reference.
