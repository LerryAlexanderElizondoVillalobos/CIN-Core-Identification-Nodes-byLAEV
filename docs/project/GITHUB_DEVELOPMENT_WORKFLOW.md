# CIN GitHub Development Workflow

**Project:** CIN — Core Identification Nodes byLAEV  
**Status:** Initial development-process baseline  
**Target:** First successful local CIN Main Lobby

## 1. Governing rule

A component is not complete because its document, schema, source file, or interface exists. Every component advances through four evidence-backed gates:

1. **Specified** — reviewed contract defines purpose, scope, interfaces, data, states, errors, dependencies, and acceptance criteria.
2. **Implemented** — code performs the declared scope.
3. **Tested** — automated tests demonstrate expected behavior and relevant boundary and failure cases.
4. **Integrated and validated** — declared dependencies work together and acceptance evidence is recorded.

No dependent phase may be accepted while prerequisite contracts, schemas, verifiers, or tests are missing or failing.

## 2. First Successful CIN Main Lobby scope

The first delivery target is a local, portable lifecycle: verify the distribution package; extract it; audit the environment; create and register a Genesis Manifest; persist local records; authorize and create a Node Birth Record; perform the separately authorized personal-registration flow; associate evidence; initialize a versioned profile; assemble the Lobby header from persisted records; close and reopen CIN; and verify that the header is reconstructed from stored data.

This target does not require global consensus, complete decentralized networking, application ledgers, every future Lobby engine, or worldwide institutional infrastructure. Interfaces may be specified for later integration without implementing those systems now.

## 3. Repository baseline and technology policy

The current repository baseline contains architecture and specifications, not a complete runtime. Its roadmap records that the Environment Audit Engine, Genesis Manifest implementation, Node Birth Engine, personal-registration implementation, and consensus implementation are not present.

Do not select an application language or framework by assumption. Record the chosen runtime and build strategy during M0 before adding application-specific CI jobs. Python is used by the initial repository validation helper only; it does not select Python for the CIN application.

## 4. Work management

Use GitHub Milestones for phases, Issues for bounded work, Labels for classification, Pull Requests for reviewable integration, and GitHub Actions for repeatable checks.

| ID | Milestone | Exit evidence |
|---|---|---|
| M0 | Architecture Baseline | Reviewed lifecycle, terminology, dependency map, decisions and backlog |
| M1 | Portable Bootstrap | Portable startup and package verification demonstrated |
| M2 | Genesis Manifest | Versioned schema, deterministic serialization, digest and persisted first logical record |
| M3 | Local Private Storage | Atomic write, read, recovery and integrity tests |
| M4 | Trust Infrastructure | Trust anchor lifecycle, certificate profiles, signing and verification tests |
| M5 | Node Birth | Authorization, node identifier profile, birth record and independent verification |
| M6 | Personal Registration | Separate authorization, number allocation state and credential issuance/verification |
| M7 | Evidence Association | Evidence records, provenance and verification states |
| M8 | Attributes and History | Versioned profile and append-preserving history |
| M9 | Main Lobby Header | Profile assembly from persisted, verified source records |
| M10 | End-to-End Acceptance | Clean installation, complete lifecycle, restart recovery and acceptance evidence |

Milestone titles are planning boundaries, not claims that those systems are specified or implemented.

## 5. Required Issue content

Every implementation Issue must state: objective; milestone and component; priority; dependencies; governing specification; inputs and outputs; data structures; operations and interfaces; state transitions and errors; expected files; acceptance criteria; automated tests; documentation updates; integration consumers; current maturity; and evidence required to close.

Avoid broad Issues such as “build certificates” or “create Lobby.” Split them into testable behaviors.

## 6. Pull Request lifecycle

1. Start from an approved Issue.
2. Create a focused branch from main.
3. Make the specification, schema, code, and test changes required by the Issue.
4. Open a Pull Request referencing the Issue.
5. GitHub Actions validates the repository and applicable contracts.
6. A reviewer checks design, implementation, tests, documentation, and maturity claims.
7. Merge only when required checks pass and review is complete.
8. Close the Issue and update milestone evidence only after acceptance criteria are demonstrated.

Do not develop directly on main. Material changes to schemas, certificate profiles, authorization, storage formats, identifiers, or lifecycle states require corresponding tests and, where appropriate, an architectural decision record.

## 7. GitHub Actions layout and activation

### Active in this baseline

- **Continuous Integration** (`ci.yml`): repository baseline checks, Markdown relative-reference checks, and workflow YAML parsing.
- **Specification Validation** (`specification-validation.yml`): validates documentation references and reports the current runtime boundary.

### Activate when relevant implementation exists

- **Integration Tests:** when actual component interfaces and executable tests exist.
- **End-to-End Tests:** when the portable application can execute the lifecycle; test clean setup, birth, registration, Lobby assembly, process shutdown, and restart recovery.
- **Release and Distribution:** after reproducible builds and package verification exist. Publication must be isolated from ordinary CI.

Do not add green placeholder jobs that imply nonexistent functionality has been tested. Every job must execute a real check against an existing deliverable.

## 8. Future CI jobs

As the runtime is selected and implemented, introduce formatting, static analysis, schema validation, unit tests, cryptographic test vectors, storage recovery, integration tests, build, and end-to-end acceptance. The job matrix must match declared supported operating systems and runtime versions.

GitHub-hosted runners cannot test a user's physical USB signer. Use protocol-level test doubles in CI and separately record physical compatibility tests on controlled hardware.

## 9. Release and signing boundary

Ordinary pull-request CI must not receive production signing authority. Development test keys may be generated for tests and must be clearly marked as non-production. Production package signing must be performed by a separately authorized signer or signing service. Private production keys must not be committed, embedded in the portable ZIP, or placed in ordinary CI artifacts.

A release workflow must build approved source, create an inventory and package manifest, calculate the exact archive digest, request the authorized signature, independently verify the signature and digest, and only then publish. ZIP package verification remains distinct from ESMT Merkle proofs over structured records.

## 10. State and record boundaries

Keep these concepts separate: Genesis Manifest; Node Identifier; Node Birth Authorization; Node Birth Record; Personal Issuance Authorization; CIN Personal Number; Personal Credential/Certificate; Evidence Records; Personal Attributes Profile; Attribute History; and Main Lobby presentation.

A locally generated number must not be represented as globally unique until a coordination or reservation mechanism establishes that property. Human-to-node association must be explicit and recorded. Evidence possession is not automatic proof of a person's uniqueness or of every asserted attribute.

The Lobby is a read/presentation layer. It must not become the original source of records or infer verification from the existence of a file. A Profile Assembly Service should resolve references and derive the header from persisted source records and their actual validation states.

## 11. First Main Lobby acceptance gate

Acceptance requires evidence of: package origin and archive integrity checks; Genesis Manifest schema validation, deterministic serialization, digest and persistence; local storage recovery after restart; birth authorization and Node Birth Record verification; separately authorized personal issuance and correct number-allocation status; credential serialization, storage, reload and cryptographic verification; evidence association with accurate verification states; versioned attributes and preserved history; Lobby header assembly from stored records; successful close/reopen reconstruction; and automated checks plus end-to-end acceptance passing.

A missing prerequisite, invalid document, unresolved reference, or failed verifier blocks the dependent gate. Errors must preserve prior valid records and permit safe resumption without duplicating founding records.

## 12. Current status

At introduction, the repository contains architecture and a proposed Package Manifest specification, but not a complete CIN runtime. Active Actions validate repository documentation and workflow syntax only. Runtime, cryptographic, storage, integration, and end-to-end jobs remain future work and must be activated only with real implementations and tests.

---
*This document governs the development process. It does not claim that the Main Lobby lifecycle has been implemented.*
