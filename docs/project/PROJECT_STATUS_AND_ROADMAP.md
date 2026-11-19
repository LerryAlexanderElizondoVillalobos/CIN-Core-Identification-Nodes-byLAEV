# CIN Project Status and Development Roadmap

**Project:** CIN — Core Identification Nodes  
**Status:** Architecture/specification plus Linux x86_64 runtime feasibility prototype; first functional CIN node and Main Lobby not yet implemented  
**Current planning phase:** M0 — Architecture Baseline  
**Last status review:** 2026-11-15

## 1. Purpose

This document gives external reviewers and contributors a transparent view of project maturity, documented work, planned specifications, and implementation direction. A roadmap item is not evidence that a component has been implemented, tested, deployed, or independently validated.

## 2. Current repository baseline

The repository now contains **46 tracked files** in the current main-branch snapshot:
- 27 Markdown documents;
- 5 YAML workflow/template files;
- 2 Python CI validation scripts;
- 5 JSON files (schemas, examples and runtime configuration);
- 1 pinned CI requirements file;
- 1 HTML interface, 1 TOML manifest, 2 Rust source files, 1 PNG icon and 1 shell packaging script.

The repository now contains a Linux x86_64 Tauri v2 feasibility prototype with local HTML, Rust command boundary, ZIP packaging script and CI build/persistence checks. This prototype is not the Genesis Lobby or Main Lobby. The repository still does **not** contain a production storage engine, production cryptographic engine, external signer implementation, Genesis/Node Birth/Personal Registration flows or Main Lobby runtime.

The [CIN Repository Technical Audit](../architecture/CIN_REPOSITORY_TECHNICAL_AUDIT.md) records a reproducible 25-file inventory snapshot from before the common-document and storage specification PRs. The current count above reflects the later merged M0 additions.

The Package Manifest v1 proposes JSON, RFC 8785 JCS, SHA-256, Ed25519 and a detached signature envelope. These remain proposed interoperability directions; package-verifier implementation, publisher-key trust lifecycle and cryptographic interoperability tests remain pending.

## 3. M0 workstream status

| Workstream | Status | Current evidence / next gate |
|---|---|---|
| Architecture baseline (#2) | Closed — specified and documentation-validated | Baseline, dependency map and decision register merged |
| Node lifecycle (#3) | Closed — specified and documentation-validated | PRENATAL, Genesis Lobby, birth, personal registration and Main Lobby transitions specified; runtime tests remain future work |
| Runtime and portable build (#4) | In progress — prototype merged | PR #18 integrated; latest PR CI passed build, Rust tests, headless cross-process persistence, ZIP layout and checksum. Actual Linux desktop launch/close/reopen and final ADR-0004 remain pending |
| Linux portable runtime proof (#17) | In progress — desktop acceptance pending | Prototype merged; controlled GUI launch, write, full close/reopen/read and package relocation still require a real supported Linux desktop |
| Common document and verification contracts (#5) | In progress | Common envelope, verifier-result model, JSON Schemas, examples and structural CI validation integrated; cryptographic interoperability vectors pending |
| Private local storage (#6) | In progress | Storage contract and logical layout integrated; actual storage backend and interruption/restart tests pending |
| Package origin verification | Proposed specification | Implement ZIP digest/signature verifier, publisher trust lifecycle and independent test vectors |
| Genesis preparation | Proposed architecture/specification | Implement environment audit, provenance, manifest builder and validation |
| Genesis Manifest | Specified at architecture level | Type-specific schema, canonical serialization, registration and first-record tests |
| Node birth | Specified at lifecycle level | Identifier profile, authorization verifier, record builder and persistence |
| Personal registration | Specified at lifecycle level | Automatic number generation, allocation status and credential issuance implementation |
| Evidence association | Architectural direction | Evidence adapters, provenance and verification implementation |
| Attributes/history/profile | Architectural direction | Versioned records, append-preserving history and profile assembly |
| Main Lobby | Acceptance target | Read model, UI runtime and full restart reconstruction not implemented |
| Networks Engine and CIN addressing | Architecture documented in [CIN-NET-001 v1.2](../architecture/CIN_NETWORKS_NATIVE_ADDRESSING_AND_DOMAIN_REGISTRY_v1.2.md); implementation pending | Phase 2 package; local resolver, network certificates, P2P interfaces and proposed .cin registry require contracts, implementation and tests |
| Ledgers, ESMT and specialized registration | Future workstreams | Phase 3 engines; separate specifications and implementation phases |

## 4. First-release objective

The first release remains **First Successful CIN Main Lobby**.

The person must be able to:
1. Download the original CIN ZIP.
2. Verify its origin and integrity.
3. Extract it into a directory.
4. Launch CIN locally from that extracted directory.
5. Run and review the environment audit.
6. Generate and register the Genesis Manifest as the first logical local CIN record.
7. Enter the PRENATAL state in the Genesis Lobby.
8. Request and complete separately authorized node birth.
9. Generate the Node Identifier and Node Birth Record.
10. Complete separately authorized personal registration and automatic CIN Personal Number generation.
11. Issue and verify the personal credential.
12. Associate evidence with explicit verification states.
13. Initialize versioned personal attributes and history.
14. Open the Main Lobby from persisted authoritative records.
15. Close and relaunch CIN and reconstruct the header from local storage.

This does not require completing global consensus, decentralized networking, future application Ledgers or institutional coordination.

## 5. Recommended sequence

### M0 — Architecture and feasibility gates
The Linux x86_64 feasibility prototype is integrated, but actual desktop acceptance remains open. Complete the GUI extracted-ZIP and close/reopen test, common document interoperability vectors and storage recovery proof. Audit dependency licenses and the proprietary end-user execution/redistribution permission against Zero-Cost Node Operation. Keep unresolved authority, global uniqueness and data-root decisions explicit.

### M1 — Portable Bootstrap
Implement ZIP verification integration, extraction-to-folder launch, local runtime startup and the first Genesis Lobby surface. Preserve the extracted-folder model; do not substitute a conventional installer.

### M2 — Environment Audit and Genesis
Implement provenance-aware audit, Genesis Manifest construction, schema validation, canonical serialization, digest and first logical record registration.

### M3 — Private Local Storage
Implement the selected local storage backend, atomic commit contract, indexes, references, restart recovery, backup and projection rebuild.

### M4 — Trust and Certificates
Implement trust profiles, issuer verification, certificate serialization, signer adapters and revocation/status checks. Keep production private keys outside the portable package.

### M5 — Node Birth
Implement scoped birth authorization, Node Identifier generation, Node Birth Record creation, commit and independent verification.

### M6 — Personal Registration
Implement explicit person-node association, separate issuance authorization, automatic CIN Personal Number generation, allocation status and personal credential issuance.

### M7 — Evidence Association
Implement evidence records, provenance, source-specific verifiers and explicit pending/verified/rejected/unavailable states.

### M8 — Personal Attributes and History
Implement authorized attribute assertions, versioned profile records and append-preserving attribute history.

### M9 — Main Lobby Header
Implement Profile Assembly Service and render the header from validated persisted records.

### M10 — End-to-End Validation
Run clean ZIP extraction, full lifecycle, close/restart reconstruction, integrity verification and supported-platform acceptance tests.

## 6. Definition of done

A component should not be marked complete merely because code exists. Completion criteria include, as applicable: documented purpose and scope; reviewed specification and contracts; defined inputs, outputs, states and errors; normal, boundary and failure tests; reproducible results; documented dependencies and integration; accurate user-facing status; published limitations; and stated versioning policy.

The project uses four evidence gates for each component: **Specified → Implemented → Tested → Integrated and validated**. Documentation CI success validates documentation and schemas only; it does not imply runtime or cryptographic implementation.

## 7. Maturity vocabulary

- **Conceptual:** purpose and design intent described.
- **Architecture proposed:** component boundaries and relationships described.
- **Specified:** normative or implementation-level contract published.
- **In development:** implementation work has begun.
- **Implemented:** code exists for the declared scope.
- **Tested:** relevant tests have passed.
- **Integrated:** connected to declared dependencies.
- **Validated:** acceptance and interoperability requirements evaluated with evidence.

A status applies only to the stated scope. Tested does not automatically mean production-ready or institutionally recognized.

## 8. Current architectural decision status

- PR #18 merged the Linux x86_64 Tauri v2 feasibility prototype. This does not approve Tauri as the final framework.
- PR #19 merged ADR-0005 — Zero-Cost Node Operation. ADR-0005 remains **Proposed** until the documented operational and dependency/license acceptance evidence is complete.
- ADR-0004 remains reserved pending runtime evidence and project-owner review.

## 9. Change management

Material changes to principles, data models, cryptographic profiles, identifiers, lifecycle states or protocol behavior should be recorded as architectural decisions. Specifications require explicit versions. Breaking changes require a new version or documented migration path.

---
*End of document.*
