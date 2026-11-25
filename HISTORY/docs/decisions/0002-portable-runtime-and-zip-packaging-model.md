# ADR-0002 — Portable Runtime and ZIP Packaging Model for CIN

- **Status:** Proposed — the portable ZIP model is a governing project requirement; implementation technology remains undecided
- **Date:** 2026-11-15
- **Related:** M0 Issue #4; [Repository Technical Audit](../architecture/CIN_REPOSITORY_TECHNICAL_AUDIT.md); [ADR-0001: Genesis Manifest and Node Birth Separation](0001-genesis-manifest-and-node-birth-separation.md)

## Context

CIN is distributed as a ZIP package. The user verifies the package, extracts it into a directory and launches CIN locally from that extracted directory. CIN is not intended to require a conventional installation process.

The extracted directory is the operational package boundary. The application must support local operation and persistent recovery of user-generated records. Local workflows that do not require external authorities or services should not depend on permanent Internet connectivity.

## Governing requirement

Preserve the **download ZIP → verify → extract → run locally** delivery model.

Do not introduce a mandatory installer, system-wide installation, app-store deployment or installation wizard as a replacement for this model.

## Technology decision remains open

The ZIP delivery model does not predetermine the implementation language or framework. Any runtime candidate may be evaluated only as an implementation option. It must demonstrate that it can be packaged consistently with the extracted-folder execution model and the project's local persistence requirements.

No framework is approved by this ADR.

## Required feasibility evidence

Before selecting the runtime:
1. Complete the tracked-file, language, dependency and build inventory.
2. Identify and preserve any existing usable implementation.
3. Define the package directory layout and local launch entry point.
4. Demonstrate extraction followed by launch without a conventional installation.
5. Demonstrate local record write, close, relaunch and recovery.
6. Document platform prerequisites, runtime inclusion strategy and reproducible ZIP package build.
7. Review the result and record a separate accepted technology decision if needed.

## Consequences

- Package design and CI must produce a portable ZIP as the primary distribution artifact.
- Package verification is a prerequisite to extraction and execution in the defined user journey.
- Application binaries, runtime dependencies and static assets must be organized for local execution.
- User records and private data must have an explicit persistence location and recovery contract.
- Production private keys must not be embedded in the package.
- External signers remain separate components accessed through defined interfaces.

## Reconsideration

The portable ZIP model may be changed only through an explicit architecture decision by the project owner. A framework preference or packaging convenience is not sufficient grounds to silently replace it.
