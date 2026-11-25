# CIN Master Implementation Workplan

Target: First Successful CIN Main Lobby  
Status: execution plan; implementation must produce evidence  
Governing rule: Specified → Implemented → Tested → Integrated → Accepted

## 1. Purpose
This workplan converts architecture, contracts and backlog into a dependency-ordered build program. The repository is the source of truth for requirements, code, tests, build instructions, workflow results and acceptance evidence. A directory, mock, sample or passing documentation check is never described as a completed engine.

## 2. Collision-prevention rules
1. One canonical specification and one owner module per domain contract. UI/runtime/integration consume public interfaces; they do not duplicate domain logic.
2. Contract-first: define data, API, states, errors, idempotency and tests before implementation. Breaking changes require an ADR and migration notes.
3. Dependency order: foundational modules merge before consumers. Do not parallelize work across unstable contracts.
4. Bounded PRs: one primary Issue, one domain outcome, one focused PR. Avoid concurrent edits to shared schemas, root exports, lifecycle enums and lockfiles.
5. No false completion: scaffolding, README, mock adapters and CI-green docs are not engine implementation.
6. Tests travel with code: unit tests in owning module; integration tests at boundaries; E2E scenarios in tests/e2e; vectors in tests/vectors.
7. No production private key material in repo, ZIP, ordinary CI secrets or artifacts. CI uses deterministic development keys and synthetic fixtures.
8. Offline truth: missing authority/network/key/evidence is PENDING or UNAVAILABLE, never synthetic approval.
9. Portable data separation: package update/re-extraction must not overwrite user data root.
10. Shared files (lib.rs, schema registry, Cargo lock, workflow files) are changed only by Issues naming the integration owner; serialize those merges.

## 3. Phases and exit gates
| Phase | Scope | Depends | Exit evidence |
|---|---|---|---|
| P0 | Runtime decision, reproducible build, data-root ADR, contract freeze | M0 | accepted ADRs; desktop ZIP test; dependency/license audit |
| P1 | Core errors, IDs, time, document envelope, serialization interfaces | P0 | unit tests and schema compatibility |
| P2 | Atomic local storage, index/reference resolution, recovery | P1 | write/read, interruption, duplicate and restart tests |
| P3 | Crypto profile, canonicalization, digest, signer abstraction, verifier, trust | P1 | vectors, tamper/wrong-key/untrusted issuer tests |
| P4 | Package origin verification and portable bootstrap | P0–P3 as applicable | altered ZIP/signature/key rejection; extract/run/relaunch |
| P5 | Environment audit and Genesis Manifest | P1–P2 | provenance/status tests; deterministic manifest; first record commit |
| P6 | Authorization engine + authority/issuer records | P3, P2 | scope, expiry, key status, unavailable tests |
| P7 | Node birth | P2, P3, P5, P6 | authorized birth, identifier, record, idempotency/recovery |
| P8 | Personal registration + credential | P2, P3, P6, P7 | explicit association, separate authorization, number allocation and verified credential |
| P9 | Evidence association | P2, P3, P8 | evidence lifecycle and independent source verification |
| P10 | Attributes/history/profile assembly | P2, P8–P9 | versioned profile, append history, referential integrity |
| P11 | Main Lobby | P10 | UI reads assembled state; bad/missing records show incomplete |
| P12 | E2E, release packaging, acceptance | P4–P11 | clean ZIP-to-Lobby, full restart and recovery, release evidence |

M0 cannot close while runtime/data-root, crypto interoperability or storage recovery gates remain unresolved.

## 4. Component build sequence
### P1 Foundation
- core: typed errors, identifiers, UTC timestamp abstraction, lifecycle state machine, compatibility.
- documents: common envelope, document type/version registry, serialization boundary, references.
- validation: schema and semantic reports.
- events: append-only domain events and correlation IDs.

### P2 Persistence
- storage: data-root resolver, repository, atomic commit, indexes, integrity, recovery and migrations.
- Define transaction boundary before engines write authoritative records.
- Storage returns typed outcomes; no engine writes files ad hoc.

### P3/P6 Trust and signatures
- crypto: JCS canonical bytes, SHA-256, domain-separated signing payload, Ed25519 profile.
- trust: explicit local_dev anchor, authority/issuer registry, trust policy, key status/rotation.
- signing: development signer and external signer adapters; private keys outside package.
- verification: schema, digest, signature, issuer, authorization, status and references independently reported.
- authorization: operation/resource/scope/subject/issuer/expiry and decision record.

### P4–P11 Lifecycle
- package: manifest, digest/signature/trust verifier and extraction gate.
- bootstrap: portable launch and environment audit.
- genesis: audit provenance, Manifest builder/validator/registrar.
- birth: authorization consumption, Node Identifier profile, Birth Record.
- personal_registration: explicit association, number allocator, issuance authorization, credential.
- evidence: source adapters, provenance, verification status and association.
- profile: attributes, history and assembly/read model.
- lobby: UI and state rendering only.

## 5. Test pyramid
- Unit: module-local tests, deterministic and no network/hardware.
- Contract/schema: specifications/schemas, examples, tests/contracts; valid/invalid/boundary fixtures.
- Crypto vectors: tests/vectors/crypto; canonical bytes, digest, signature and expected result.
- Storage integration: tests/integration/storage; temporary roots, process restart, interrupted commit and corruption.
- Engine integration: tests/integration/engines; authorized/rejected flows with test signer.
- E2E: tests/e2e; ZIP → Genesis → birth → registration → evidence/profile → Lobby → close/reopen.
- Desktop acceptance: docs/testing/CIN_DESKTOP_E2E_TEST_PLAN.md; actual OS, GUI and physical signer.
- Performance: tests/performance after correctness baseline, measured environment only.

## 6. Definition of Done
Each component records:
1. Specified: reviewed spec, schema/interface, state/error table, dependencies and acceptance criteria.
2. Implemented: real code covers declared scope; mock is not production.
3. Tested: normal, boundary, negative, recovery and idempotency cases pass reproducibly.
4. Integrated/accepted: consumer integration works, CI evidence links commit, limitations documented and reviewer accepts.

Statuses: proposed, specified, in_progress, implemented, testing, integrated, accepted, blocked. Never skip a gate without evidence.

## 7. PR protocol
- Branch: feat/<issue>-<short-name>; docs: docs/<issue>-<short-name>; fix: fix/<issue>-<short-name>.
- PR references one primary Issue and lists contracts, files, test commands/results, migration impact and limitations.
- Merge prerequisites first; schema/interface changes require domain and integration review.
- No concurrent PRs changing root exports, schema registry, state enum or Cargo lock without coordination.
- Squash merge; update status only after acceptance evidence. Release from accepted main.

## 7.1 Existing isolated P1 foundation exception

The initial Rust domain/lifecycle foundation may be developed as an isolated preparatory slice while M0/P0 remains open, provided it does not assume unresolved runtime, storage, cryptographic or trust decisions. This limited foundation does not close P0, does not authorize dependent engines to bypass their phase gates, and must not be represented as completion of full P1. Full P1 progression remains subject to the P0 contracts and exit evidence. This clarification reconciles the existing lifecycle foundation commits with the stated P1 dependency.

## 8. Immediate execution queue
1. P0-01: verify CI/runtime and desktop acceptance; reconcile audit docs with current snapshot.
2. P0-02: choose runtime/data-root through ADR, not prototype assumption.
3. P1-01: establish cin-core, errors and lifecycle transitions with tests.
4. P1-02: freeze common document/signature bytes and compatibility vectors.
5. P2-01: implement storage backend and recovery before Genesis.
6. P3-01: crypto profile and independent verifier before issuance.
7. P4/P5: package verifier, bootstrap, audit and Genesis.
8. P6–P11: authorization, birth, personal registration, evidence, profile and Lobby in order.
9. P12: full ZIP-to-Lobby acceptance/release.

## 9. ESMT integration
ESMT (Enterprise Merkle Tree) is a separate integrity engine, not a replacement for CIN signatures, authorization, storage or issuer trust. Integrate through a versioned module/API after hash semantics and odd-leaf policy are tested. A Merkle proof establishes inclusion against a supplied root; it does not alone establish issuer, authorization or trust.
