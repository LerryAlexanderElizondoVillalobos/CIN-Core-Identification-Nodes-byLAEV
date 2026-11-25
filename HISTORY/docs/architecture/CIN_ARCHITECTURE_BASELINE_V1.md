# CIN Architecture Baseline v1

**Project:** CIN — Core Identification Nodes byLAEV  
**Status:** Proposed architecture baseline — review required  
**Planning phase:** M0 — Architecture Baseline  
**Target:** First Successful CIN Main Lobby  
**Date:** 2026-11-15

## 1. Purpose and authority

This document consolidates the scope, terminology, component boundaries, dependencies and unresolved decisions for the first functional CIN delivery. It is based on the repository's Foundational Principles, Project Status and Development Roadmap, Node Lifecycle Architecture, Genesis Preparation Architecture, Package Origin Verification Architecture, Package Manifest Specification v1 and M0 development Issues.

This baseline does not claim that proposed components are implemented. The project remains at an architecture/specification stage until code and tests provide evidence.

## 2. Governing product and execution model

CIN is distributed as a ZIP archive. The required user sequence is:

**Download ZIP → verify origin and integrity → extract to a directory → run CIN locally from that extracted directory.**

A conventional installer, system-wide installation or app-store deployment is not a requirement and must not replace the portable-folder model. The extracted directory is the application package boundary. User-generated records must persist in a separately defined local data area and be recoverable after the process closes and restarts.

Package verification, archive extraction, local execution, Genesis preparation and node birth are distinct events. A verified or extracted package is not a born node.

The precise launcher, application runtime, UI framework, data directory policy and supported operating systems remain undecided pending the reproducible repository inventory and runtime feasibility evidence in Issue #4.

## 3. First-release objective and boundary

The first release is accepted only when a person can:

1. Obtain the CIN ZIP and verify its package origin and exact archive integrity.
2. Extract it and launch CIN locally from the extracted folder.
3. Run and review the environment audit.
4. Prepare, validate and register the Genesis Manifest as the first logical CIN record in private local storage.
5. Enter the prenatal/pre-birth state and complete the separately authorized node-birth operation.
6. Generate and verify a distinct Node Identifier and Node Birth Record.
7. Complete the separately authorized personal-registration and credential-issuance flow.
8. Associate evidence while preserving each evidence item's actual verification state.
9. Create a versioned personal attributes profile and append-preserving history.
10. Assemble the Main Lobby header from persisted authoritative records.
11. Close CIN completely, relaunch it and reconstruct the header from stored records with integrity and reference checks.

### Explicit exclusions from this release

- Global network consensus and complete decentralized peer communication.
- Worldwide institutional coordination or globally guaranteed uniqueness without an implemented coordination/reservation mechanism.
- Application-specific Ledgers and all future Lobby engines.
- Full request/permission infrastructure beyond the authorization interfaces required by the defined local operations.
- Institutional or legal recognition claims.
- Automatic determination that a person is unique or that any single wallet, document, photograph or device proves a person's attributes.

Interfaces for later systems may be documented without implementing those systems.

## 4. Terminology and record boundaries

| Term | Meaning | Must not be conflated with |
|---|---|---|
| Package Manifest | Signed description of a release ZIP | Genesis Manifest or node record |
| Package verification result | Evidence about archive digest, manifest, signature and publisher trust | Permission to create a node |
| Extraction | Unpacking verified ZIP into a directory | Installation or node birth |
| Portable runtime | Application executable from the extracted directory | A system-wide installed service |
| Environment Audit | Provenance-aware observations and declarations before birth | Personal registration |
| Genesis Manifest | Versioned description of pre-birth conditions; first logical local CIN record | Node Birth Record |
| Genesis registration | Durable first logical record commit | Formal node birth |
| Node Identifier | Technical identifier under a specified profile | Personal registration number |
| Node Birth Authorization | Permission for a defined birth operation | Birth Record or issuer signature |
| Node Birth Record | Formal technical birth event referencing Genesis | Genesis Manifest |
| Personal Issuance Authorization | Permission for personal credential issuance | Credential itself |
| CIN Personal Number | Personal registry number with allocation status | Proof of uniqueness or humanity |
| Personal Credential/Certificate | Issued document with issuer and verification data | Automatic proof of every attribute |
| Evidence Record | Reference and status for an evidence item | Verified evidence merely because attached |
| Personal Attributes Profile | Current versioned projection of attributes | Immutable founding record |
| Attribute History | Append-preserving record of changes | Overwritten current profile |
| Profile Assembly Service | Resolves and validates source records to build a read model | Authoritative source record |
| Main Lobby | User-facing presentation of actual state | Record authority or lifecycle engine |

### Three independent cryptographic/policy questions

1. **Integrity:** does content match its digest or authenticated reference?
2. **Signature and issuer trust:** is the signature valid, and is the signing key trusted for the relevant purpose?
3. **Operation authorization:** was this specific operation permitted, within scope, by the applicable authority?

A valid signature does not itself prove issuer trust or operation authorization. These outcomes must remain separately represented.

## 5. Component responsibility baseline

| Component | Responsibility and inputs | Outputs / persistent artefacts | Depends on | Current maturity |
|---|---|---|---|---|
| Package Origin Verifier | ZIP bytes, manifest, detached signature, independently provisioned trust material | Structured verification result | Package Manifest v1, trust policy | Architecture and proposed specification; implementation pending |
| Portable Launcher / Runtime | Verified extracted package, runtime prerequisites, local configuration | Running local CIN process and runtime diagnostics | Issue #4 runtime decision, package layout | Requirement established; implementation pending |
| Environment Auditor | OS-permitted environment sources and operator-approved declarations | Provenance-aware audit result | Runtime, collection policy | Proposed architecture |
| Genesis Manifest Builder | Audit result, operator declarations, versioned schema | Candidate Genesis Manifest, validation report, canonical bytes and digest | Audit model, common document contract | Proposed architecture |
| Private Local Storage Registrar | Valid Genesis Manifest and storage contract | First logical committed record and registration result | Storage contract, document model | Proposed architecture |
| Trust / Certificate Services | Trust anchors, issuer profiles, certificate requests and signer interface | Trust decisions, certificates and verification results | Common document model, external signer | Interfaces/architecture pending |
| Authorization Service | Request, operation, subject, scope, policy and authority response | Authorization decision and durable authorization record where required | Trust model, operation contracts | Required interfaces; full engine excluded |
| Node Birth Engine | Registered Genesis reference, Node Identifier profile, valid birth authorization | Node Identifier and Node Birth Record | Storage, trust, authorization, common document model | Proposed architecture |
| Personal Registration Service | Explicit person-node association, personal issuance authorization, number-allocation status | CIN Personal Number and personal registration record | Birth, trust, authorization, common document model | Proposed architecture |
| Credential Issuer / Verifier | Registration record, issuer profile, signer result | Serialized credential and independent verification result | Trust, signer, common document model | Proposed architecture |
| Evidence Association Service | Evidence references, provenance, consent and verifier outcomes | Evidence records and separate verification statuses | Storage, document model, external evidence adapters | Proposed architecture |
| Attributes and History Service | Authorized attribute assertions and evidence references | Versioned current profile and append-preserving history | Storage, evidence, common document model | Proposed architecture |
| Profile Assembly Service | Persisted records, references and verifier results | Rebuildable Lobby read model/header | Storage, all required record verifiers | Proposed architecture |
| Main Lobby | Profile read model and actual lifecycle/verification state | UI presentation and navigation | Runtime, Profile Assembly Service | Conceptual UI; implementation pending |

## 6. Governing dependency sequence

The detailed graph is maintained in [CIN Component Dependency Map](CIN_COMPONENT_DEPENDENCY_MAP.md). The main dependency chain is:

Package ZIP and origin verification → extraction and portable local runtime → environment audit → Genesis Manifest construction and validation → private storage first-record commit → birth authorization → Node Birth Record → personal issuance authorization → personal registration and credential verification → evidence association → attributes/history → Profile Assembly Service → Main Lobby → full process restart and reconstruction test.

Trust, document serialization, signature verification and authorization are cross-cutting prerequisites. Local storage is required before the Genesis Manifest can be durably registered. The Lobby is downstream of authoritative records and must not manufacture or infer them.

## 7. Maturity and acceptance gates

Every component advances through four evidence-backed gates:

1. **Specified:** reviewed contract defines scope, interfaces, data, states, errors, dependencies and acceptance criteria.
2. **Implemented:** code performs the declared scope.
3. **Tested:** automated tests demonstrate expected behavior, including relevant boundary and failure cases.
4. **Integrated and validated:** declared dependencies operate together and acceptance evidence is recorded.

A document, schema, code file, generated JSON object or green unrelated workflow is not sufficient proof of component completion. No dependent phase is accepted while required prerequisite contracts, schemas, verifiers or tests are missing or failing.

## 8. Unresolved decisions register

| Decision | Current position | Required evidence / gate | Affected components |
|---|---|---|---|
| Application runtime, language and UI framework | Open; portable ZIP folder model is fixed | Complete inventory; compare no more than three viable stacks; prove extraction, local launch and restart persistence | Launcher, UI, all engines, CI |
| Local data directory and portability when folder is moved/replaced | Open | Define relative vs user-profile storage, backup, recovery and package update behavior | Runtime, storage, profile |
| Supported operating systems | Open | Evidence from stack/build feasibility and project priority | Runtime, package, CI |
| Package publisher trust provisioning and lifecycle | Package Manifest v1 profile proposed; trust lifecycle pending | Define independently provisioned root/key trust, rotation, expiry and revocation | Package verifier, release |
| CIN root trust anchor and issuer governance | Open | Define authority origin, custody, delegation, purpose and status lifecycle | Certificates, authorizations, birth, personal issuance |
| Common document canonicalization and signature profile | Open | Interoperability rationale, versioning and positive/negative vectors | All records and certificates |
| Authorization issuance and offline operation | Operation-specific authorization required; issuer/service unresolved | Define authority, scope, expiry, offline status and retry behavior | Birth, personal issuance, signer |
| Global uniqueness of CIN Personal Number | Local generation cannot prove global uniqueness | Define reservation/coordination mechanism and honest local/pending/global states | Personal registration |
| Person-node association and evidence semantics | Must be explicit; evidence does not automatically prove uniqueness or attributes | Define consent, evidence source, verification status, correction and disputes | Personal registration, evidence, profile |
| Storage integrity, atomic commit and recovery | Required; engine and format undecided | Write/read/restart, interrupted write, corruption and reference tests | Genesis, birth, registration, profile |
| External signer interface and physical hardware compatibility | Private production keys excluded from ZIP; signer external | Define interface and simulator contract; physical device tests on controlled host | Certificates, authorizations, release |

An unresolved decision remains open until its evidence and owner decision are recorded. This baseline does not silently approve a framework, certificate format, root authority or global registry.

## 9. Interfaces that may be defined now but implemented later

The first release may define stable interfaces for peer networking, consensus, application Ledgers, ESMT integration, external signer plugins, institutional APIs and global uniqueness coordination. Their future presence must not block a working local Main Lobby unless a specific interface is a prerequisite to one of the acceptance operations.

## 10. Source traceability

- [Project Status and Development Roadmap](../project/PROJECT_STATUS_AND_ROADMAP.md)
- [GitHub Development Workflow](../project/GITHUB_DEVELOPMENT_WORKFLOW.md)
- [Node Lifecycle Architecture](NODE_LIFECYCLE_ARCHITECTURE.md)
- [Genesis Preparation Architecture](GENESIS_PREPARATION_ARCHITECTURE.md)
- [Package Origin Verification Architecture](PACKAGE_ORIGIN_VERIFICATION.md)
- [Package Manifest Specification v1](../../specifications/PACKAGE_MANIFEST_SPECIFICATION_V1.md)
- [ADR-0001: Genesis Manifest and Node Birth Separation](../decisions/0001-genesis-manifest-and-node-birth-separation.md)
- [M0 Development Backlog](../project/DEVELOPMENT_BACKLOG.md)

## 11. Acceptance status

This is a consolidated **proposed** architecture baseline for Issue #2. It is ready for technical review, but Issue #2 must remain open until the dependency map and decision register are reviewed, repository references pass validation, and the project owner accepts the baseline. Its existence does not close Issues #3–#6.

---
*End of document.*
