# CIN Node Lifecycle Specification v1

**Specification ID:** cin.node-lifecycle  
**Version:** 1.0.0-draft  
**Status:** Proposed contract — dependent on M0 architecture acceptance  
**Planning phase:** M0 — Architecture Baseline  
**Related:** [CIN Architecture Baseline v1](../docs/architecture/CIN_ARCHITECTURE_BASELINE_V1.md), [Node Lifecycle Architecture](../docs/architecture/NODE_LIFECYCLE_ARCHITECTURE.md), [Genesis Preparation Architecture](../docs/architecture/GENESIS_PREPARATION_ARCHITECTURE.md), Issue #3

## 1. Purpose

This specification turns the proposed CIN lifecycle into a testable state and transition contract for the first successful local Main Lobby. It distinguishes package verification, extraction, local execution, pre-birth preparation, Genesis registration, node birth, personal registration, evidence association, profile assembly and Lobby presentation.

This is a draft contract. It does not claim that lifecycle engines, records, schemas, storage or UI have been implemented. Final adoption depends on acceptance of the M0 architecture baseline and review of unresolved decisions.

## 2. Normative distinctions

1. A verified ZIP is a verified distribution artifact; it is not an extracted application and not a born node.
2. Extraction creates the portable folder from which CIN runs locally; it is not node birth and does not require a conventional installer.
3. Genesis Manifest records pre-birth conditions and is intended to be the first logical CIN record in private local storage.
4. Node Birth Record is a separate founding event referencing the registered Genesis Manifest.
5. Node Identifier is a technical node identifier, not the CIN Personal Number.
6. Node Birth Authorization and Personal Issuance Authorization are separate, operation-scoped permissions.
7. Signature validity, issuer trust and operation authorization are independent verification results.
8. Human-to-node association must be an explicit recorded event. It must not be inferred from wallet possession, device data or evidence attachment.
9. Evidence attachment does not automatically mean the evidence is verified or that every associated claim is true.
10. Main Lobby is a presentation/read layer. It reconstructs its view from persisted source records and verification outcomes.

## 3. State model

### 3.1 Package and runtime states

| State | Meaning | Entry condition | Persistent evidence |
|---|---|---|---|
| PACKAGE_UNVERIFIED | Archive has not passed the required checks | ZIP received or selected | Optional package receipt/attempt log; not a trusted state |
| PACKAGE_VERIFIED | Origin, manifest, signature, key trust and archive digest checks passed under policy | All required package checks succeed | Structured verification report bound to exact archive digest and manifest |
| PACKAGE_VERIFICATION_FAILED | One or more required package checks failed or are incomplete | Invalid digest, signature, manifest, trust or metadata | Failure report with separate check outcomes |
| EXTRACTED | Verified archive extracted to a directory | Extraction completed and result checked | Extraction location/package version record where applicable |
| RUNTIME_READY | CIN launched locally from the extracted folder | Launcher prerequisites pass and process starts | Runtime/package version and launch diagnostics where required |

A failed package verification does not authorize extraction or execution. A failed extraction or launch may be retried without creating any Genesis or node-birth record.

### 3.2 Pre-birth and Genesis states

| State | Meaning | Entry condition | Persistent evidence |
|---|---|---|---|
| AUDIT_NOT_RUN | No completed pre-birth audit exists | Runtime ready and audit not completed | None required |
| AUDIT_IN_PROGRESS | Audit is currently executing | Operator starts audit | Optional resumable progress; not a completed audit |
| AUDIT_COMPLETED | Audit result is complete, with provenance and collection status | Audit process completes | Versioned audit result |
| AUDIT_PARTIAL | Audit completed with unavailable, denied, unsupported or uncollected fields | Partial outcome is explicitly represented | Audit result with per-field status |
| GENESIS_MANIFEST_CREATED | A candidate manifest has been built and validated but is not yet registered | Candidate passes schema and content validation | Candidate document, schema/version and digest |
| GENESIS_MANIFEST_REGISTRATION_PENDING | User confirms local storage destination and registration begins | Explicit registration request | Registration attempt status |
| GENESIS_MANIFEST_REGISTERED | Manifest is durably committed as the first logical CIN record and read-back verification passes | Atomic storage commit and independent read-back succeed | Authoritative Genesis Manifest record and registration receipt |
| GENESIS_VALIDATION_FAILED | Audit/manifest candidate fails a required validation | Schema, provenance, canonicalization or digest check fails | Failure report; no successful registration claim |
| GENESIS_STORAGE_FAILED | Registration did not commit or commit outcome is uncertain | Storage unavailable, interrupted or read-back fails | Recovery/transaction status; no false success |

A candidate Genesis Manifest is not registered merely because it was generated or serialized. The registered state requires a durable commit and successful read-back verification.

### 3.3 Node birth states

| State | Meaning | Entry condition | Persistent evidence |
|---|---|---|---|
| PRENATAL | Genesis Manifest is registered; the node has not completed its birth operation | Genesis registration is committed and verified, and no valid Node Birth Record exists | Derived from the registered Genesis record and the absence of a valid birth record; no separate mutable status file is authoritative |
| BIRTH_PENDING | The operator has entered the birth procedure; node has not been born | PRENATAL state and required birth profile are available | Genesis record plus birth-operation request/reference; no birth record yet |
| BIRTH_AUTHORIZATION_PENDING | Birth operation awaits an authority decision | A scoped birth authorization request is submitted | Request reference and current decision status |
| BIRTH_AUTHORIZED | Valid authorization for this birth operation is verified | Issuer trust, signature, scope, subject/reference, validity and policy checks pass | Authorization record or independently verifiable authorization reference |
| BIRTH_AUTHORIZATION_REJECTED | Authority rejected or authorization is invalid/out of scope | Explicit rejection or failed authorization verification | Rejection/verification report |
| BIRTH_CREATION_PENDING | Authorized birth transaction is being committed | Idempotent birth operation starts | Operation reference and transaction status |
| BORN | Node Birth Record is committed and verifies against its Genesis reference and authorization | Durable commit plus independent validation succeeds | Node Identifier, Node Birth Record and verification report |
| BIRTH_CREATION_FAILED | Birth operation failed without a verified committed record | Creation or commit fails | Failure and recovery status |

A node cannot enter BORN solely because an authorization exists. The Node Birth Record must be committed and independently verified. Once BORN is established, later credential, evidence or profile failures cannot return the node to a pre-birth state.

### 3.4 Personal registration and credential states

| State | Meaning | Entry condition | Persistent evidence |
|---|---|---|---|
| PERSONAL_ISSUANCE_PENDING | Personal issuance has been requested but not authorized | Born node and explicit person-node association request are available | Request/association proposal reference |
| PERSONAL_ISSUANCE_AUTHORIZED | Personal issuance operation is authorized | Separate issuance authorization passes verification | Authorization record/reference |
| PERSONAL_REGISTRATION_PENDING | Number allocation and registration are being committed | Authorized registration operation begins | Allocation attempt/status |
| PERSONAL_REGISTERED_LOCAL | CIN Personal Number and registration record are committed locally; global uniqueness is not established | Local generation and duplicate checks pass | Local registration record with explicit allocation scope |
| PERSONAL_NUMBER_RESERVED | A coordinating registry confirms reservation/uniqueness within its declared scope | Authenticated reservation response and record are verified | Reservation receipt and authority reference |
| PERSONAL_CREDENTIAL_ISSUANCE_PENDING | Credential generation/signing is underway | Registration record and issuer profile are valid | Issuance transaction status |
| PERSONAL_CREDENTIAL_ISSUED | Credential is serialized, stored and independently verified | Schema, signature, issuer trust, authorization and reference checks pass | Credential record and verification report |
| PERSONAL_ISSUANCE_REJECTED | Issuance request rejected or authorization invalid | Explicit rejection or failed verification | Rejection/verification report |
| PERSONAL_REGISTRATION_FAILED | Number/record commit failed or outcome uncertain | Allocation or storage failure | Failure/recovery status |
| PERSONAL_CREDENTIAL_FAILED | Credential generation, signing, storage or verification failed | Credential operation fails | Failure report; prior valid node-birth and registration records remain |

A locally generated CIN Personal Number must not be presented as globally unique unless a defined coordination mechanism has issued a verified reservation. The software must preserve the distinction between local registration and globally reserved status.

### 3.5 Evidence, profile and Lobby states

| State | Meaning | Entry condition | Persistent evidence |
|---|---|---|---|
| EVIDENCE_PENDING | Evidence reference submitted but not fully evaluated | Evidence association operation begins | Evidence reference and provenance |
| EVIDENCE_ASSOCIATED | Evidence reference is stored; verification may still be pending or unavailable | Association commit succeeds | Evidence record with explicit status |
| EVIDENCE_VERIFIED | Required evidence-specific verification checks pass | Relevant verifier reports success under a declared policy | Verification report and verifier/profile version |
| EVIDENCE_REJECTED | Evidence fails a required check or is explicitly rejected | Failed verification or rejection | Failure/rejection report |
| PROFILE_INCOMPLETE | Required profile inputs are missing, unresolved or invalid | Profile assembly cannot satisfy its declared completeness profile | Assembly report and unresolved references |
| PROFILE_INITIALIZED | Versioned profile and history records exist and validate | Initial profile transaction commits | Profile version and history event(s) |
| GENESIS_LOBBY_OPEN | The pre-birth preparation interface is displaying the current package, audit and Genesis state | User opens the Genesis Lobby from RUNTIME_READY | Transient UI session; authoritative lifecycle state comes from persisted records |
| LOBBY_READY | Main Lobby header can be assembled from persisted records and actual verification outcomes | Profile assembly succeeds for required Main Lobby header fields | Rebuildable projection or assembly report |
| MAIN_LOBBY_OPEN | Main Lobby interface is displaying the current assembled profile | User opens Main Lobby from LOBBY_READY | Transient UI session; not an authoritative source record |
| STORAGE_RECOVERY_REQUIRED | Authoritative record recovery or integrity review is required | Corruption, uncertain commit or unresolved storage transaction is detected | Recovery incident/report |

Evidence may be associated while remaining unverified, pending, rejected or unavailable. The Lobby must show the actual status and must not infer verification from mere existence.

## 4. Transition contract

| From | Trigger | Preconditions / guards | To | Authoritative output |
|---|---|---|---|---|
| PACKAGE_UNVERIFIED | Verify selected ZIP | Manifest and detached signature available; independent trust configuration available | PACKAGE_VERIFIED or PACKAGE_VERIFICATION_FAILED | Package verification report |
| PACKAGE_VERIFIED | Extract archive | Exact verified archive remains unchanged; extraction destination approved | EXTRACTED | Extraction result |
| EXTRACTED | Launch CIN | Runtime prerequisites satisfied | RUNTIME_READY | Launch result |
| RUNTIME_READY | Open Genesis Lobby | Local runtime is ready; no birth record is presumed | GENESIS_LOBBY_OPEN | Read-only preparation view showing the actual audit and Genesis state |
| RUNTIME_READY | Start environment audit | Collection rules and operator consent/permissions satisfied | AUDIT_IN_PROGRESS | Audit operation reference |
| AUDIT_IN_PROGRESS | Audit completes | Each field has provenance and collection status | AUDIT_COMPLETED or AUDIT_PARTIAL | Audit result |
| AUDIT_COMPLETED or AUDIT_PARTIAL | Build Genesis candidate | Required fields and schema version available; unknown values remain explicit | GENESIS_MANIFEST_CREATED or GENESIS_VALIDATION_FAILED | Candidate manifest and validation report |
| GENESIS_MANIFEST_CREATED | Confirm local registration | Destination and storage policy reviewed; no prior registered Genesis exists | GENESIS_MANIFEST_REGISTRATION_PENDING | Registration operation reference |
| GENESIS_MANIFEST_REGISTRATION_PENDING | Commit and read back | Atomic commit succeeds; stored bytes validate and record is first logical CIN record | GENESIS_MANIFEST_REGISTERED or GENESIS_STORAGE_FAILED | Registration receipt or recovery report |
| GENESIS_MANIFEST_REGISTERED | Establish prenatal state | Genesis record is committed and read-back verified; no valid birth record exists | PRENATAL | Prenatal state derived from authoritative Genesis and birth records |
| PRENATAL | Request node birth | Operator explicitly starts the birth procedure; required birth profile and authorization interface are available | BIRTH_PENDING | Birth-operation request/reference |
| BIRTH_PENDING | Request birth authorization | Request references exact Genesis record/digest and intended operation | BIRTH_AUTHORIZATION_PENDING | Authorization request |
| BIRTH_AUTHORIZATION_PENDING | Verify authority response | Signature, issuer trust, scope, validity and references pass | BIRTH_AUTHORIZED or BIRTH_AUTHORIZATION_REJECTED | Authorization verification result |
| BIRTH_AUTHORIZED | Execute birth | Idempotency key unique for this birth operation; Genesis and authorization references unchanged | BIRTH_CREATION_PENDING | Birth transaction reference |
| BIRTH_CREATION_PENDING | Commit and verify | Node identifier and birth record schema valid; durable commit and read-back pass | BORN or BIRTH_CREATION_FAILED | Node Identifier and Node Birth Record |
| BORN | Request personal issuance | Explicit person-node association and separate issuance request supplied | PERSONAL_ISSUANCE_PENDING | Association/issuance request |
| PERSONAL_ISSUANCE_PENDING | Verify issuance authorization | Authorization is valid for the specific subject, issuer, operation and scope | PERSONAL_ISSUANCE_AUTHORIZED or PERSONAL_ISSUANCE_REJECTED | Authorization result |
| PERSONAL_ISSUANCE_AUTHORIZED | Allocate and register number | Allocation policy and local duplicate check pass | PERSONAL_REGISTRATION_PENDING | Allocation transaction |
| PERSONAL_REGISTRATION_PENDING | Commit registration | Atomic storage commit and read-back pass | PERSONAL_REGISTERED_LOCAL or PERSONAL_REGISTRATION_FAILED | Registration record and allocation status |
| PERSONAL_REGISTERED_LOCAL or PERSONAL_NUMBER_RESERVED | Issue credential | Issuer profile and signer interface available; operation authorized | PERSONAL_CREDENTIAL_ISSUANCE_PENDING | Credential transaction |
| PERSONAL_CREDENTIAL_ISSUANCE_PENDING | Store and verify credential | Serialization, signature, issuer trust, authorization and references pass | PERSONAL_CREDENTIAL_ISSUED or PERSONAL_CREDENTIAL_FAILED | Credential and verification report |
| PERSONAL_CREDENTIAL_ISSUED | Associate evidence | Evidence source/reference and association permission are supplied | EVIDENCE_PENDING | Evidence operation |
| EVIDENCE_PENDING | Commit association | Reference and provenance structure valid; verification status separately represented | EVIDENCE_ASSOCIATED | Evidence record |
| EVIDENCE_ASSOCIATED | Run evidence-specific verifier | Verifier and evidence format supported | EVIDENCE_VERIFIED or EVIDENCE_REJECTED; unsupported/unavailable remains associated with that status | Verification report |
| Evidence/profile inputs available | Initialize or update profile | Attribute assertions authorized; history append transaction available | PROFILE_INITIALIZED or PROFILE_INCOMPLETE | Profile version and history events |
| PROFILE_INITIALIZED | Assemble Lobby header | Required source records resolve and their validation states are available | LOBBY_READY or PROFILE_INCOMPLETE | Profile assembly result |
| LOBBY_READY | Open Main Lobby | Local Main Lobby read model loaded | MAIN_LOBBY_OPEN | Display session |
| GENESIS_LOBBY_OPEN | Close and relaunch before birth | Authoritative local storage remains available | RUNTIME_READY then GENESIS_LOBBY_OPEN after state reconstruction | Rebuilt preparation view from stored records |
| MAIN_LOBBY_OPEN | Close and relaunch after profile initialization | Authoritative local storage remains available | RUNTIME_READY then LOBBY_READY after reconstruction | Rebuilt Main Lobby header from stored records |

The named domain states describe lifecycle facts. PRENATAL is derived from a registered Genesis Manifest and the absence of a valid Node Birth Record. GENESIS_LOBBY_OPEN and MAIN_LOBBY_OPEN are transient presentation states; UI navigation, progress indicators and an open window must not overwrite authoritative lifecycle records.

## 5. Persistence and event rules

Persist authoritative events and documents, not merely the latest UI state. At minimum, preserve:

- Package verification result when retained as local provenance.
- Environment audit result and Genesis Manifest candidate/registered record.
- Genesis registration receipt and storage integrity metadata.
- Birth authorization request/decision and Node Birth Record.
- Explicit human-to-node association event and personal issuance authorization.
- CIN Personal Number allocation status and personal registration record.
- Credential and its independent verification report.
- Evidence references, provenance, consent/association event and verification reports.
- Attribute change events and profile versions.
- Profile assembly results where useful for audit; the projection remains rebuildable.
- The prenatal condition is reconstructed from the registered Genesis Manifest and the absence/presence of a valid Node Birth Record; do not maintain a conflicting mutable prenatal flag.

Do not persist a state as successful before its authoritative output has been committed and read back. Transient progress may be stored for safe resumption but must not be mistaken for a completed event.

## 6. Idempotency, retries and duplicate operations

Each state-changing operation must have a stable operation identifier/idempotency key and an explicit binding to its inputs and intended action.

- Repeating a completed operation with the same idempotency key and identical input returns the existing result; it must not create a second founding record.
- Reusing an idempotency key with different input is a conflict and must be rejected.
- A retry after a known pre-commit failure may resume or restart according to the operation's transaction contract.
- If commit outcome is uncertain, the system must read and verify the authoritative store before attempting another commit.
- A duplicate birth request must resolve to the existing valid Node Birth Record or an explicit conflict; it must not silently generate a second Node Identifier.
- A duplicate personal registration request must resolve against allocation and registration records; it must not silently issue another number.
- A failed credential issuance must not undo node birth or a valid personal registration.
- Profile updates append history events and must not overwrite previous history or create a new birth event.

## 7. Failure and recovery rules

| Failure | Required behavior |
|---|---|
| Package signature/digest/trust failure | Block extraction and execution; preserve separate failure reasons |
| Extraction/launcher failure | Permit safe retry; do not create Genesis or birth records |
| Audit permission denied/unavailable | Preserve field status; do not invent a value |
| Genesis schema/canonicalization failure | Do not register candidate |
| Genesis storage interruption | Resolve transaction state by read-back/recovery; never claim registration without proof |
| Birth authorization unavailable | Remain pending; do not fabricate approval |
| Birth authorization rejected | Do not create birth record |
| Birth commit uncertain | Inspect store before retry; avoid duplicate birth |
| Personal issuance rejected | Do not create personal registration/credential |
| Number coordination unavailable | Local status may be recorded, but do not claim global reservation |
| Credential signing/verification failure | Preserve born node and registration; mark credential issuance failed |
| Evidence verifier unavailable | Keep evidence associated but unverified/unavailable |
| Missing/corrupt source record | Report incomplete profile or STORAGE_RECOVERY_REQUIRED; do not invent Lobby values |
| Restart with valid records | Reconstruct derived states and Lobby from authoritative persisted records |

A later-stage failure does not roll back earlier valid historical events. Corrections are new records/events under defined rules, not silent mutation of founding records.

## 8. Derived state and Lobby reconstruction

The Profile Assembly Service reads authoritative records, resolves stable references, invokes or consumes verification results, and produces a rebuildable read model. It must not treat file presence as proof of validity.

After a full process restart, the application reconstructs the current state from stored records and transaction outcomes. If a Genesis Manifest is registered and no valid Node Birth Record exists, the Genesis Lobby presents the PRENATAL state. If the birth record exists, later profile state is reconstructed from its records. The application must not rely on in-memory state from the previous process. If required records are absent, corrupt or unverifiable, the relevant Lobby must display an incomplete/recovery state rather than a successful header.

## 9. Conformance scenarios

The future executable test suite must include, at minimum:

1. Valid ZIP passes; altered ZIP fails digest comparison.
2. Valid signature from untrusted key fails trust policy.
3. Invalid signature fails independently of digest result.
4. Extracted package launches locally without a conventional installer.
5. Audit preserves unavailable and not-collected values.
6. Genesis candidate is not reported registered before atomic commit/read-back.
7. Genesis is first logical CIN record.
8. Interrupted Genesis commit is recovered without duplicate record.
9. Birth authorization cannot be inferred from a valid signature alone.
10. Unauthorized or out-of-scope birth does not create a record.
11. Repeated birth operation does not create a second birth record or identifier.
12. Born node remains born after personal credential failure.
13. Personal issuance requires separate authorization and explicit association.
14. Local personal number is not reported globally unique without reservation evidence.
15. Evidence association without verifier success remains unverified.
16. Attribute update preserves prior history and does not create another birth.
17. Missing/corrupt references prevent a complete Lobby header.
18. After Genesis registration and before birth, full process shutdown/relaunch reconstructs the PRENATAL state in the Genesis Lobby.
19. After profile initialization, full process shutdown/relaunch reconstructs the Main Lobby header from persisted records.

These are acceptance requirements, not claims that tests already exist or pass.

## 10. Open decisions and dependencies

This draft intentionally does not select:
- Application runtime/language/framework or operating system targets (Issue #4).
- Storage engine, exact data layout or data-root relocation policy (Issue #6).
- Common document serialization/signature profile and certificate format (Issue #5).
- Root authority, issuer governance or offline authorization service.
- Global CIN Personal Number coordination protocol.
- Evidence-specific verification standards and person-association governance.

The state names and transition semantics may be refined after the M0 architecture baseline is accepted. Schema fixtures and executable state-machine tests should be added only after the repository agrees the machine-readable format and runtime test harness.

## 11. Completion status

This document is **Specified — draft**, not implemented or tested. Issue #3 may close only after:
- M0 architecture baseline is accepted.
- Every transition has reviewed preconditions, authoritative input, persistent output and failure behavior.
- Idempotency and recovery rules are reviewed.
- State persistence versus transient UI state is explicit.
- Conformance scenarios are accepted and linked to future executable tests.
- Documentation reference validation passes.

---
*End of document.*
