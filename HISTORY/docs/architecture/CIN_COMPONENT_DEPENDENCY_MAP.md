# CIN Component Dependency Map

**Planning phase:** M0 — Architecture Baseline  
**Status:** Proposed dependency model — review required  
**Related:** [Architecture Baseline v1](CIN_ARCHITECTURE_BASELINE_V1.md)

## 1. End-to-end dependency flow

CIN ZIP + release metadata
→ Package Origin Verifier
→ verified origin, signature, trust and archive digest
→ extract portable folder
→ Portable Launcher / Local Runtime
→ Environment Auditor
→ Genesis Manifest Builder
→ schema, canonical serialization and digest validation
→ Private Local Storage Registrar
→ first logical record committed and verified
→ Birth Authorization
→ Node Birth Engine
→ Node Identifier + Node Birth Record
→ Personal Issuance Authorization
→ Personal Registration
→ CIN Personal Number + Registration Record
→ Credential Issuer / Verifier
→ Personal Credential
→ Evidence Association
→ Attributes + append-preserving History
→ Profile Assembly Service
→ Main Lobby Header
→ close process / relaunch
→ Profile Assembly Service reconstructs the header.

A failed package-origin or archive-integrity check blocks extraction and execution. A verified archive does not authorize node birth.

## 2. Dependency table

| Work item | Requires | Produces | Acceptance evidence |
|---|---|---|---|
| Package verification | ZIP, Package Manifest v1, detached signature, independently provisioned trust key | Separate digest, signature, key-trust and metadata outcomes | Valid package passes; altered ZIP, invalid signature and untrusted key fail distinctly |
| Extraction and runtime | Verified archive, package layout, selected runtime and launch contract | Running local process from extracted folder | Clean extraction and local launch without conventional installation |
| Environment audit | Runtime and collection/provenance rules | Structured observations/declarations with collection status | Permission-denied/unavailable/not-collected states preserved |
| Genesis Manifest | Audit model, common document contract, schema, canonicalization | Candidate manifest and validation report | Schema, deterministic serialization and digest vectors pass |
| First logical storage record | Storage root/layout, atomic commit and recovery contract | Durable Genesis Manifest registration | No earlier logical application record; close/reopen and verify |
| Birth authorization | Trust and authorization contract, registered Genesis reference | Scoped authorization result/record | Invalid, untrusted, expired, out-of-scope and unavailable states distinguished |
| Node birth | Genesis registration, authorization, identifier profile, document/signature contract, storage | Node Identifier and Node Birth Record | Duplicate/retry, signature, reference and restart tests pass |
| Personal issuance | Born node, explicit person-node association, issuer trust, scoped authorization | Issuance authorization result | No implicit person association; unauthorized issuance blocked |
| Personal registration | Issuance authorization, number allocation state, common document contract | Personal registration record and CIN Personal Number | Local/pending/global allocation state honest; duplicate reservation tests |
| Credential issuance | Registration record, issuer profile, signer and verifier | Serialized credential and verification report | Save, close, reload, signature, issuer and authorization checks |
| Evidence association | Evidence references, source/provenance, consent, adapters/verifier contracts | Evidence records with separate status | Invalid/unavailable/unverified evidence not presented as verified |
| Attributes and history | Authorized assertions and evidence references | Versioned profile and append-only history | Update does not overwrite prior event or create another birth |
| Profile assembly | Persisted authoritative records and verifier outputs | Rebuildable header/read model | Missing/corrupt/untrusted references yield explicit incomplete state |
| Main Lobby | Profile read model and lifecycle state | Accurate local interface | Header matches records; no UI-invented authority |
| Restart acceptance | All prior local records and rebuild logic | Reconstructed Lobby state | Full process exit/relaunch recovers the same verified state |

## 3. Cross-cutting dependencies

### Trust and cryptographic verification

Trust is consumed by package verification, document issuers, authorization authorities and credential verification. Package publisher trust is a separate trust purpose from CIN document issuer trust. A single generic “signature valid” boolean is insufficient.

### Common document and verification result model

Each document profile must define its stable ID, type, version, canonical bytes, digest, issuer/key references, subject/references, timestamps, status and schema. Verification reports must distinguish schema validity, digest/integrity, signature, issuer trust, authorization scope, expiry/revocation and unresolved references.

### Authorization

Authorization is operation-specific. Node birth authorization and personal issuance authorization are separate decisions and must not be inferred from document signature validity. Offline operation must expose unavailable/pending authority states rather than fabricate approval.

### Storage

Storage is foundational, not merely a UI preference. Genesis registration, birth, personal registration, credentials, evidence, attributes/history and profile assembly all depend on durable records, stable references, atomic commits and restart recovery.

### External signer

The signer is an interface boundary. CI can test a deterministic development signer or simulator. Physical USB hardware compatibility requires a separately recorded test on a controlled machine with the actual device connected. Production private keys must not be placed in the ZIP or ordinary CI secrets/artifacts.

## 4. Dependency ordering and parallel work

- Issue #2 establishes the shared architecture and terminology first.
- Issues #3 and #4 may proceed in parallel after the baseline is accepted: #3 formalizes lifecycle; #4 inventories the repository and proves the portable runtime direction.
- Issue #5 depends on #2 and #3 because document and verifier contracts must match lifecycle events.
- Issue #6 depends on #2 and #3 because storage must persist the correct records and transitions.
- Implementation milestones M1 onward must not be treated as accepted until the relevant M0 contracts are reviewed and validated.

## 5. Known unresolved edges

1. Whether user data lives inside the extracted directory, in a user-selected external location, or in an OS user-data directory with an explicit portable mode.
2. How package updates preserve user records and avoid replacing the data root.
3. Which trust authority issues offline birth/personal-issuance authorizations and how pending authorization is resumed.
4. How locally generated personal numbers become globally reserved, if/when coordination is available.
5. Which document serialization/signature profile is selected after interoperability review.

These are open decisions, not assumptions embedded in the graph.

---
*End of document.*
