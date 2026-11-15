# ADR-0001 — Application Stack for the CIN Portable Desktop Runtime

- **Status:** Proposed — not accepted
- **Date:** 2026-11-15
- **Decision owner:** CIN architecture maintainers
- **Related:** M0 Issue #4; [Repository Technical Audit](../architecture/CIN_REPOSITORY_TECHNICAL_AUDIT.md)

## Context

The reviewed repository baseline is architecture and specification material, not an established desktop application. No application language or framework should be inferred from the existing documentation.

CIN's first local delivery requires a portable desktop shell, a Lobby UI, local persistence and restart recovery, a backend boundary for cryptographic and filesystem operations, offline operation for the local lifecycle, and a maintainable automated test strategy.

## Candidates

1. **Tauri 2 + Rust backend + web frontend** — preferred feasibility candidate.
2. **Electron + TypeScript/JavaScript** — fallback when bundled Chromium consistency or web ecosystem fit is more valuable than package footprint.
3. **Qt 6 + PySide6** — alternative if a native-widget-first Lobby is selected.

Detailed comparison and official references are in the linked technical audit.

## Proposed decision

Run a constrained Tauri 2 proof-of-feasibility first. Do not yet establish Tauri as the final application stack.

The prototype must launch, render a static Lobby, persist a harmless local test record, recover it after process restart, exercise one explicit UI-to-backend call, and build on the candidate CI runner. Record platform prerequisites, package output and build behavior.

## Consequences

- Rust and the frontend toolchain become prototype dependencies only.
- No production CIN engine or personal-registration component is authorized by this proposal.
- Electron and PySide6 remain documented alternatives until prototype evidence is reviewed.
- The final supported OS matrix remains open.
- Physical external-signer compatibility remains a separate hardware test.

## Acceptance conditions

Change this ADR to **Accepted** only after the repository inventory is complete, the prototype passes its defined tests, platform targets and build prerequisites are recorded, and an architecture review approves the evidence.

## Reconsideration

Reopen this ADR if the prototype shows unacceptable platform constraints, if external signer integration requires a different native boundary, or if the Lobby's UI requirements materially favor a native-widget toolkit.
