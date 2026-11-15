# CIN Project Status and Development Roadmap

**Project:** CIN — Core Identification Nodes  
**Status:** Research and architecture development

## 1. Purpose

This document gives external reviewers and contributors a transparent view of project maturity, documented work, planned specifications, and implementation direction. A roadmap item is not evidence that a component has been implemented, tested, deployed, or independently validated.

## 2. Repository baseline

The repository baseline includes the project overview, Package Origin Verification Architecture, CIN Package Manifest Specification v1, and project license.

The Package Manifest v1 proposes JSON, RFC 8785 JCS, SHA-256, Ed25519, and a detached signature envelope. Its implementation, publisher-key trust lifecycle, and interoperability testing remain pending.

At this baseline, the repository does not contain a complete CIN runtime, Environment Audit Engine, Genesis Manifest implementation, Node Birth Engine, human-registration implementation, or decentralized consensus implementation.

## 3. Workstream status

| Workstream | Status | Next evidence |
|---|---|---|
| Project overview | Documented | Review and traceability |
| Package origin verification | Architecture documented | Trust lifecycle, test vectors, implementation and tests |
| Package Manifest v1 | Proposed specification | Reproducible vectors and interoperability review |
| Node lifecycle | Proposed architecture | Detailed states and interfaces |
| Genesis preparation | Proposed architecture | Versioned data specification |
| Genesis Manifest | Not normatively specified | Schema, provenance, serialization, digest, storage |
| Node birth record | Conceptual direction | Identifier profile, record format, verification |
| Lobby and setup guide | Conceptual direction | Interaction and state specification |
| Human registration and association | Research direction | Evidence, consent, privacy, correction, recovery, governance |
| Certificates and external signing | Dependencies identified | Lifecycle and signer interface specifications |
| Ledgers, ESMT, consensus | Research and architecture workstreams | Separate protocols and conformance criteria |
| Runtime and application code | Not established in baseline | Approved plan and tested code |

## 4. Recommended sequence

### Phase 1 — Foundational alignment
Define lifecycle and terminology; record architectural decisions and unresolved questions; link principles, requirements, specifications, and tests.

### Phase 2 — Genesis and birth specifications
Define Genesis Manifest data and provenance; first-record storage guarantee; Node Birth Record and node identifier profile; state transitions, recovery, and Lobby behavior.

### Phase 3 — First local lifecycle implementation
After specifications are reviewed, implement environment audit, manifest construction and validation, private local registration, birth record creation and verification, Lobby state presentation, and unit/integration/reproducibility tests.

### Phase 4 — Supporting infrastructure
Specify and implement certificate, external signing, request and permission, ledger installation, and ESMT interfaces. Discovery of a capability must not be treated as proof it is configured or trusted.

### Phase 5 — Human registration and association
Define evidence, consent, representation, privacy, duplicate resolution, correction, appeals, recovery, credential issuance, and independent verification before implementation.

### Phase 6 — Network protocols and interoperability
Specify peer communication, evidence exchange, node admission, consensus, conflict resolution, governance, and cross-implementation interoperability. Publish reproducible tests and independent implementation evidence.

## 5. Definition of done

A component should not be marked complete merely because code exists. Completion criteria include, as applicable: documented purpose and scope; reviewed specification and contracts; defined inputs, outputs, states, and errors; normal, boundary, and failure tests; reproducible results; documented dependencies and integration; accurate user-facing status; published limitations; and stated versioning policy.

## 6. Maturity vocabulary

- **Conceptual:** purpose and design intent described.
- **Architecture proposed:** component boundaries and relationships described.
- **Specified:** normative or implementation-level contract published.
- **In development:** implementation work has begun.
- **Implemented:** code exists for the declared scope.
- **Tested:** relevant tests have passed.
- **Integrated:** connected to declared dependencies.
- **Validated:** acceptance and interoperability requirements evaluated with evidence.

A status applies only to the stated scope. Tested does not automatically mean production-ready or institutionally recognized.

## 7. Change management

Material changes to principles, data models, cryptographic profiles, identifiers, lifecycle states, or protocol behavior should be recorded as architectural decisions. Specifications require explicit versions. Breaking changes require a new version or documented migration path.

---
*End of document.*