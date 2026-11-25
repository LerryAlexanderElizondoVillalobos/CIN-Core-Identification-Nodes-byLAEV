# CIN Main — Active Product Implementation

**Product:** CIN Linux Lobby byLAEV  
**Status:** Architecture and migration skeleton; implementation maturity is tracked per module.

## Purpose

`Main/` is the single active implementation root for the CIN product. Its first delivery is the portable Linux Lobby and the local lifecycle required to prepare, register, birth and present a verifiable CIN node.

The Lobby is an application and read/presentation layer. Authoritative records belong to their domain services and durable storage.

## Current first-release lifecycle

Package verification → portable extraction and launch → environment audit → Genesis Manifest creation and first logical local registration → PRENATAL state → separately authorized node birth and Node Birth Record → separately authorized personal registration and credential → evidence association → versioned attributes/history → Main Lobby assembly from persisted records → full close/reopen reconstruction.

## Module map

| Directory | Responsibility | First useful deliverable |
|---|---|---|
| `bootstrap/` | Portable package, extraction and launcher | Verified local launch path |
| `application/` | Use-case composition and orchestration | Application service boundary |
| `lobby/` | Interface, read model and lifecycle presentation | Lobby assembled from stored state |
| `core/` | Shared types, IDs, errors and invariants | Stable domain primitives |
| `documents/` | Envelopes, schemas, references and registry | Common document contract |
| `environment/` | Environment audit and provenance | Auditable environment report |
| `genesis/` | Genesis Manifest and first logical registration | Deterministic Genesis record |
| `birth/` | Node identifier and Node Birth Record | Separately authorized birth |
| `personal-registration/` | Person–node association, number allocation and credential | Explicit registration and issuance |
| `certificates/` | Certificate profiles, issuance and verification | Versioned certificate contract |
| `cryptography/` | Canonicalization, digests and crypto interfaces | Reproducible digest vectors |
| `trust/` | Trust anchors, issuer and key status | Trust evaluation contract |
| `signing/` | External signer interface and adapters | Signer request/response contract |
| `authorization/` | Scoped requests and decisions | Operation authorization contract |
| `storage/` | Durable local records, transactions and recovery | First-record persistence |
| `evidence/` | Evidence records, provenance and status | Evidence association contract |
| `profile/` | Attributes, history and profile assembly | Versioned profile projection |
| `verification/` | Independent validation and reports | Verifiable result model |
| `engine-manager/` | Engine registry, installer and lifecycle | Installable test-engine flow |
| `engines/` | Dedicated engines installed by the manager | Created as real engines are introduced |
| `communication/` | Local API and Lindesk bridge | Defined local communication contract |
| `system/linux/` | Linux platform adapters | Linux environment/filesystem adapter |

## Current implementation layout\n\nThe first Rust implementation is consolidated in `Main/core/` as one crate. Its current internal modules include document envelopes/validation, schema validation, DataRoot, local storage, recovery inspection, lifecycle transitions and Genesis. The root-level directory map expresses longer-term ownership boundaries; do not duplicate these modules into parallel implementations until an extraction Issue defines the interface and migration. The portable runtime and published web Lobby remain separate migration inputs for now.\n\n## Architectural rules

1. Genesis Manifest, Node Birth Record and personal-registration credential are distinct artifacts.
2. Package verification, extraction, node birth, personal registration and network admission are distinct lifecycle events.
3. Genesis owns the Genesis Manifest; birth owns the Node Birth Record; personal-registration owns person–node association and issuance.
4. Private keys are not embedded in portable packages or founding records. Signing is performed through a defined signer interface.
5. Hash integrity, signature validity, issuer trust, evidence truth and operation authorization are separate verification outcomes.
6. Storage owns durable records; Lobby renders a projection and is never the source of truth.
7. ESMT and other specialized engines are introduced only when their contracts and first functional slices are ready.
8. Do not create empty module trees and mark them implemented. Every module must have a defined owner, contract, tests and maturity.
9. Existing prototypes are migration inputs. Reuse them only after inventory, compatibility review and test evidence.

## Development gates

**Specified → Implemented → Tested → Integrated and validated.**

Every feature begins with an approved Issue and a focused branch. Its Pull Request records source paths reused from `HISTORIAL/`, tests, changed contracts, limitations and acceptance evidence.

See:
- [Main reorganization and directory creation plan](../docs/project/CIN_MAIN_REORGANIZATION_AND_DIRECTORY_PLAN.md)
- [Project status and roadmap](../docs/project/PROJECT_STATUS_AND_ROADMAP.md)
- [GitHub development workflow](../docs/project/GITHUB_DEVELOPMENT_WORKFLOW.md)

## Maturity

This README establishes ownership and intended structure. It is not evidence that every listed module or first-release capability has been implemented.
