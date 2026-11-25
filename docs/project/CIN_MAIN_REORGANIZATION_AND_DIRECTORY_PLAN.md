# CIN Main Reorganization and Directory Creation Plan

**Project:** CIN — Core Identification Nodes byLAEV  
**Target product:** CIN Linux Lobby / First Successful CIN Main Lobby  
**Target branch:** `architecture/main-reorganization`  
**Status:** Proposed implementation plan — directory creation and migration must follow the gates below.

## 1. Governing decision

The active product implementation will be developed under one root: `Main/`.

Previous implementations, prototypes and superseded structures will be preserved under `HISTORIAL/` as recoverable reference material. Existing material must not be deleted or moved blindly. The repository's current Git history remains the immutable source of provenance.

The new `Main/` is the current architecture. `HISTORIAL/` is a reference archive, not an alternate runtime and not a place for new production features.

## 2. Product and lifecycle baseline

The first product is the portable CIN Linux Lobby. The first release must demonstrate the currently documented local lifecycle:

1. Verify package origin and archive integrity.
2. Extract and launch CIN from its portable directory.
3. Run and review the environment audit.
4. Build, validate and register the Genesis Manifest as the first logical CIN record in private local storage.
5. Enter the PRENATAL / pre-birth lifecycle state.
6. Perform separately authorized node birth.
7. Generate and verify the Node Identifier and distinct Node Birth Record.
8. Perform separately authorized personal registration and CIN Personal Number allocation/issuance.
9. Issue and verify the relevant personal credential.
10. Associate evidence with explicit provenance and verification states.
11. Create versioned attributes and append-preserving history.
12. Assemble the Main Lobby from persisted authoritative records.
13. Close and relaunch the application and reconstruct the Lobby from storage.

Global consensus, complete decentralized networking, application-specific Ledgers, worldwide uniqueness coordination and future engines are not prerequisites for this first local product.

## 3. Important reconciliation with previous proposals

The earlier three-document / three-certificate concept is retained as historical design input, but it must not override the repository's more detailed lifecycle contracts without an explicit architectural decision.

The current repository distinguishes:
- Environment Audit and Genesis Manifest;
- Node Birth Authorization and Node Birth Record;
- Personal Registration Authorization, CIN Personal Number allocation and personal credential;
- Evidence records and profile/history.

The proposed term **Marriage Certificate** is not yet established as a normative module or document type in the current architecture baseline. Do not create a `marriage/` implementation directory or collapse personal registration into node birth. First map the intended person–node association and credential semantics to the existing Personal Registration contracts through an ADR and versioned schemas.

Package verification, extraction, Genesis preparation, node birth, human/person registration and network admission remain separate events.

## 4. Target repository structure

```text
CIN/
├── Main/
│   ├── README.md
│   ├── bootstrap/
│   │   ├── package/
│   │   ├── extraction/
│   │   └── launcher/
│   ├── application/
│   │   ├── composition/
│   │   ├── commands/
│   │   └── queries/
│   ├── lobby/
│   │   ├── interface/
│   │   ├── read-model/
│   │   ├── assembly/
│   │   └── lifecycle/
│   ├── core/
│   │   ├── types/
│   │   ├── identifiers/
│   │   ├── errors/
│   │   └── invariants/
│   ├── documents/
│   │   ├── envelope/
│   │   ├── schemas/
│   │   ├── registry/
│   │   └── references/
│   ├── environment/
│   │   ├── audit/
│   │   ├── provenance/
│   │   └── manifest/
│   ├── genesis/
│   │   ├── builder/
│   │   ├── validation/
│   │   └── registration/
│   ├── birth/
│   │   ├── authorization/
│   │   ├── identifiers/
│   │   ├── record/
│   │   └── verification/
│   ├── personal-registration/
│   │   ├── association/
│   │   ├── authorization/
│   │   ├── number-allocation/
│   │   ├── credentials/
│   │   └── verification/
│   ├── certificates/
│   │   ├── profiles/
│   │   ├── issuance/
│   │   └── verification/
│   ├── cryptography/
│   │   ├── canonicalization/
│   │   ├── digest/
│   │   ├── signatures/
│   │   └── interfaces/
│   ├── trust/
│   │   ├── anchors/
│   │   ├── issuers/
│   │   └── policies/
│   ├── signing/
│   │   ├── requests/
│   │   ├── interfaces/
│   │   └── adapters/
│   ├── authorization/
│   │   ├── requests/
│   │   ├── decisions/
│   │   └── scopes/
│   ├── storage/
│   │   ├── local/
│   │   ├── transactions/
│   │   ├── indexes/
│   │   └── recovery/
│   ├── evidence/
│   │   ├── records/
│   │   ├── provenance/
│   │   └── verification/
│   ├── profile/
│   │   ├── attributes/
│   │   ├── history/
│   │   └── assembly/
│   ├── verification/
│   │   ├── structural/
│   │   ├── cryptographic/
│   │   ├── trust/
│   │   ├── authorization/
│   │   └── reports/
│   ├── engine-manager/
│   │   ├── manifests/
│   │   ├── registry/
│   │   ├── installer/
│   │   ├── dependencies/
│   │   └── lifecycle/
│   ├── engines/
│   │   └── README.md
│   ├── communication/
│   │   ├── local-api/
│   │   └── lindesk/
│   └── system/
│       └── linux/
│           ├── environment/
│           ├── filesystem/
│           └── integration/
│
├── HISTORIAL/
│   ├── README.md
│   ├── inventory/
│   ├── prototypes/
│   ├── previous-structures/
│   ├── previous-interfaces/
│   ├── superseded-documentation/
│   └── migration-register/
│
├── Documentation/
│   ├── Architecture/
│   ├── Protocols/
│   ├── Specifications/
│   ├── Workflows/
│   ├── Decisions/
│   └── Operations/
│
├── specifications/
│   ├── schemas/
│   ├── examples/
│   └── test-vectors/
│
├── tests/
│   ├── unit/
│   ├── contracts/
│   ├── integration/
│   ├── genesis/
│   ├── e2e/
│   └── acceptance/
│
├── Distribution/
│   └── linux/
├── scripts/
│   ├── ci/
│   └── package/
└── .github/
    └── workflows/
```

Directories are logical ownership boundaries. Create a directory when its first useful file or implementation slice is ready; do not populate the tree with empty folders and imply that engines already exist.

## 5. Main module ownership and dependency rules

| Module | Owns | Must not own |
|---|---|---|
| bootstrap | Package verification, extraction and launch | Node birth |
| application | Composition and use-case orchestration | Authoritative domain records |
| lobby | User interface and read model | Original records or verification decisions |
| core | Shared types, identifiers, errors and invariants | UI/runtime details |
| documents | Common envelope, schemas, references and registry | Authorization policy |
| environment | Observations, declarations and provenance | Personal attribute inference |
| genesis | Genesis Manifest creation, validation and first registration | Node Birth Record |
| birth | Node identifier and birth event/record | Personal number |
| personal-registration | Person–node association, allocation and credential issuance | Node birth |
| certificates | Certificate profiles and lifecycle | Private-key custody |
| cryptography | Canonicalization, digests and cryptographic operations | Issuer authorization |
| trust | Trust anchors, issuers and key status | Signing private keys |
| signing | Signer interface and adapters | Operation policy |
| authorization | Scoped operation requests and decisions | Transport or key custody |
| storage | Durable records, transactions, indexes and recovery | Trust decisions |
| evidence | Evidence references, provenance and verification status | Automatic factual approval |
| profile | Versioned attributes, history and projections | Replacing source records |
| verification | Independent structural, cryptographic, trust, authorization and reference checks | Silent approval of missing checks |
| engine-manager | Engine manifests, registry, installation and lifecycle | Engine-specific domain rules |
| engines | Dedicated installable engines when introduced | Foundational Genesis ownership |
| communication | Local API and Lindesk bridge contracts | Domain authorization |
| system/linux | Linux-specific adapters | Cross-platform domain logic |

Dependency direction:
- Runtime/UI → application services → domain modules.
- Domain modules depend on explicit interfaces for storage, documents, cryptography, trust, signing and authorization.
- Genesis owns the Genesis Manifest; birth owns the Node Birth Record; personal-registration owns the person–node association and credential flow.
- Lobby assembles a read model from persisted source records; it is never the source of truth.
- ESMT may later commit structured record batches and proofs, but does not replace signatures, issuer trust or authorization.

## 6. Historical preservation and migration policy

The following existing material is migration input and must be inventoried before any move:
- `prototype/cin-core/` Rust prototype and its current build/test references;
- `prototype/linux-runtime/` Linux/Tauri feasibility prototype;
- `Core Identification Node Github/` existing web-facing Genesis Lobby assets and documentation;
- current root scripts, CI workflows, schemas, fixtures and runtime configuration;
- existing architecture, lifecycle, storage, package-verification and development workflow documents.

Migration sequence:
1. Capture a repository inventory and baseline commit SHA.
2. Record every source path, purpose, maturity, tests, consumers and candidate target module.
3. Copy or snapshot legacy implementation material into `HISTORIAL/` without deleting the original.
4. Identify reusable code, obsolete code, duplicated responsibilities and unresolved contracts.
5. Port only a bounded functional slice into `Main/`.
6. Update build scripts, imports, CI and documentation references.
7. Run the same tests against the new location and compare behavior.
8. Remove the old active path only after parity, CI and review are demonstrated.
9. Record source path, destination path, decision, commit/PR, test evidence and disposition in `HISTORIAL/migration-register/`.

Do not archive the only working copy of a prototype before all consumers and CI references have been migrated. Do not rewrite or erase Git history.

## 7. Implementation workflow

Every module and feature follows the same gates:

1. **Inventory:** identify existing implementation and prior decisions.
2. **Specify:** define purpose, ownership, inputs, outputs, schemas, states, errors, dependencies and acceptance criteria.
3. **Plan:** open a bounded GitHub Issue and identify its milestone.
4. **Branch:** create a focused feature branch from the approved baseline.
5. **Implement:** port or build the smallest complete functional slice under `Main/`.
6. **Test:** add unit, contract, integration or acceptance tests appropriate to the slice.
7. **Verify:** validate persisted records, references, cryptographic results and user-visible states where applicable.
8. **Document:** update module README, specifications, workflow and maturity status.
9. **Review:** open a Pull Request with evidence and migration notes.
10. **Integrate:** merge only after required checks and review pass.

Evidence gates are **Specified → Implemented → Tested → Integrated and validated**. Documentation checks alone do not prove runtime behavior.

## 8. Directory creation and migration phases\n\n**Execution alignment:** the repository's existing `CIN_MASTER_IMPLEMENTATION_WORKPLAN.md` P0–P12 gates remain the detailed dependency authority. This reorganization does not bypass P0 runtime/data-root decisions, P2 storage acceptance or P3 cryptography/trust requirements. The copied Genesis code is a preserved first vertical slice with its documented prototype limits; it is not production Genesis certification.

### R0 — Baseline and archive map
Deliverables: inventory, baseline commit reference, migration register and HISTORIAL policy.
Exit: every current implementation path has an owner and disposition.

### R1 — Main skeleton and contracts
Create Main root, README, core, application, bootstrap, documents, storage interfaces, verification interfaces and lobby shell.
Exit: module ownership and dependency direction are reviewed; no placeholder engine is claimed as functional.

### R2 — Portable Lobby and environment Genesis
Implement package/bootstrap path, Linux runtime adapter, environment audit, Genesis Manifest builder/validator and first-record registration.
Exit: portable launch and deterministic first logical record are demonstrated.

### R3 — Node birth
Implement birth authorization, identifier profile, Node Birth Record, persistence and independent verification.
Exit: birth is distinct from Genesis and can be verified from stored records.

### R4 — Personal registration and credentials
Implement separately authorized person–node association, number-allocation status, credential issuance and verification.
Exit: no global uniqueness or external authority claim is made without the corresponding coordination/trust mechanism.

### R5 — Evidence, profile and Main Lobby
Implement evidence provenance/status, versioned attributes, append-preserving history, profile assembly and restart reconstruction.
Exit: Lobby header is rebuilt from persisted authoritative records after full process restart.

### R6 — Engine Manager
Implement package manifests, registry, dependency inspection, installation and lifecycle.
Exit: a real test engine can be installed, configured, activated and removed through the manager.

### R7 — Distribution and Lindesk
Produce reproducible portable Linux distribution and then the authorized local/remote Lindesk integration.
Exit: clean-environment acceptance and Android administration are demonstrated separately.

## 9. First implementation order inside Main

1. `Main/core/` — shared domain types, errors and invariants.
2. `Main/documents/` — common envelope and schema validation interfaces.
3. `Main/storage/` — durable record and transaction contract.
4. `Main/bootstrap/` — portable package and launch path.
5. `Main/environment/` — audit and provenance.
6. `Main/genesis/` — Genesis Manifest and first logical record.
7. `Main/cryptography/` and `Main/verification/` — deterministic digest and independent verification.
8. `Main/birth/` — separately authorized node birth.
9. `Main/personal-registration/` and `Main/certificates/`.
10. `Main/evidence/`, `Main/profile/` and `Main/lobby/`.
11. `Main/engine-manager/`.
12. `Main/communication/` and `Main/system/linux/` integration as required by each slice.

This order expresses dependencies, not a mandate to create all folders immediately. Interfaces and real implementations must be introduced together where practical.

## 10. First directory-creation acceptance criteria

- `Main/README.md` explains the product, modules, maturity and dependency rules.
- `HISTORIAL/README.md` defines what is archived and how material is reused.
- The migration register lists every known legacy path and its disposition.
- Existing CI and prototype paths continue to work until migration parity is proven.
- No existing source is deleted during the skeleton phase.
- The Main Lobby target remains the first product; future engines do not displace the local Genesis-to-Lobby lifecycle.
- All newly created modules have a stated owner and first functional deliverable.

---
*This plan governs the transition to the new Main architecture. It does not claim that the listed directories or engines are already implemented.*
