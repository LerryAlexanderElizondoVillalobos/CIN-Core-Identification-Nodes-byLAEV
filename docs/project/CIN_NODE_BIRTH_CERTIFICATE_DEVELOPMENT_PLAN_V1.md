# CIN Node Birth Certificate — Development Plan v1

**Project:** Core Identification Nodes (CIN) byLAEV  
**Component:** CIN Node Birth Certificate  
**Document ID:** `cin.development-plan.node-birth-certificate`  
**Version:** 1.0.0  
**Status:** Development plan — proposed, ready for technical specification  
**Target repository:** `CIN-Core-Identification-Nodes-byLAEV`  
**Target module:** `prototype/cin-core/src/modules/birth/`  
**Related lifecycle phase:** P7 — Node birth  
**Governing sequence:** Specified → Implemented → Tested → Integrated → Accepted

---

## 1. Purpose

This plan defines the sequential development of a dedicated CIN certificate that imports the complete Genesis Environment Manifest, processes it as a single deterministic source, derives the node's technical identifiers, creates the Node Birth Record, and provides independent verification and export.

The certificate is a separate component from the Genesis Environment Certificate. It does not repeat the environment audit and does not recollect operating-system or browser information. It consumes the complete Genesis Manifest that has already been generated and registered.

The purpose is to make node birth reproducible, verifiable, traceable to its Genesis source, and implementable as a dedicated CIN engine.

## 2. Architectural position

The intended lifecycle is:

1. The portable CIN package is verified and extracted.
2. Genesis preparation audits the accessible environment.
3. The Genesis Environment Certificate generates the Genesis Environment Manifest.
4. The Genesis Manifest is registered as the first logical CIN record in private local storage.
5. The Node Birth Certificate imports the complete registered Genesis Manifest.
6. The certificate validates and processes the complete source document.
7. The certificate derives the identifiers defined by the approved identifier profile.
8. The birth operation is authorized under the separate Node Birth Authorization process.
9. The certificate creates the Node Birth Record and its integrity metadata.
10. The record is committed, read back, independently verified, and exported.
11. CIN can present the node as BORN only after the authoritative record is committed and verification succeeds.

The Genesis Manifest and Node Birth Record remain distinct documents. The birth record references the Genesis Manifest; it does not replace, rewrite, or absorb it.

## 3. Scope

### 3.1 Included

- Import from a complete JSON file and paste of the complete JSON document.
- Preservation of the exact imported source bytes for raw-integrity calculation.
- Strict JSON parsing and full-document structural validation.
- Versioned canonicalization of the entire manifest.
- SHA-256 digests for raw source bytes and canonical manifest bytes.
- Deterministic, domain-separated identifier derivation.
- Conditional derivation of identifiers requiring source fields or external scope.
- Birth authorization request/decision integration.
- Node Birth Record construction.
- Common document envelope integration.
- Independent validation and verification report.
- Durable local registration through the CIN storage interface.
- Read-back verification, idempotency, recovery and export.
- A user interface that exposes each processing stage and its result.

### 3.2 Explicitly excluded from this component

- Re-running the Genesis environment audit.
- Modifying or silently correcting the imported Genesis Manifest.
- Human registration or CIN Personal Number issuance.
- Automatic admission to a network or consensus system.
- Creating, storing or exporting private signing keys.
- Treating a digest as a signature, authorization, issuer trust or proof of factual truth.
- Claiming global uniqueness when only local uniqueness has been established.
- Installing application Ledgers, ESMT instances or unrelated engines as part of birth.

## 4. Core operating principle

**The complete Genesis Manifest is the source document.**

The certificate must not select a handful of fields and use only those fields to derive the principal node identifiers. The complete document participates in the canonical manifest digest, including its document metadata, node section, certificate profile, environment data, references, limitations and generation metadata.

The certificate must preserve the original input and must make the difference between the original bytes and the canonical representation explicit.

Two separate integrity values are required:

- `raw_sha256`: SHA-256 of the exact imported bytes.
- `manifest_sha256`: SHA-256 of the canonicalized complete JSON document.

The raw digest establishes whether the exact source byte sequence is unchanged. The canonical digest establishes the digest of the complete JSON data model under the selected canonicalization profile.

A hash is not encryption and does not prove who issued the source document.

## 5. Proposed identifier catalogue

The final identifier profile must be approved and versioned before implementation. The following catalogue is the planning baseline.

| Identifier | Purpose | Derivation condition |
|---|---|---|
| `CIN-NID` | Principal permanent technical Node Identifier | Required; derived from the complete canonical Genesis Manifest digest |
| `CIN-NSID` | Root namespace identifier for the node's services, applications, Ledgers and subordinate resources | Required; separate derivation domain |
| `CIN-BID` | Identifier of the Node Birth Record | Required; separate derivation domain |
| `CIN-REF` | Short human-readable node reference | Required presentation reference derived from the NID; collision handling and display length must be specified |
| `CIN-ENID` | Identifier for the node within a named CIN ecosystem | Conditional; only when a valid `ecosystem_id` and scope profile are present |
| `CIN-PVID` | Parent/provenance reference identifier | Conditional; only when a parent or provenance source is explicitly defined by the accepted schema |

The two integrity digests are not additional node identifiers:

- `CIN-RAW-HASH`: exact imported-byte digest.
- `CIN-MANIFEST-HASH`: canonical full-manifest digest.

Future identifiers for applications, services, Ledgers, certificates, peers, requests, events and resources belong to a separate scoped-identifier specification. They must not be improvised inside the birth certificate.

### 5.1 Identifier semantics

- The source field `node.node_id` (for example, `CIN 001`) is a descriptive label, not the cryptographic NID.
- The source `manifest_id` identifies or references the Genesis Manifest; it is not the NID.
- A certificate profile digest such as `profile_sha256` identifies the collection profile; it is not the digest of the complete Genesis Manifest.
- `CIN-REF` is a convenience reference and must never replace the full NID in authoritative records.
- The absence of `ecosystem_id` means no ENID is issued. The certificate must report it as not applicable or unavailable according to the schema, not fabricate one.
- The absence of a defined parent/provenance relationship means no PVID is issued.

### 5.2 Deterministic derivation contract

The approved derivation profile must define, byte for byte:

1. The canonical source digest used as input.
2. The algorithm and its registered identifier.
3. The domain-separation label for each identifier type.
4. The profile version.
5. Character encoding and normalization rules for labels.
6. Field framing or length encoding so concatenated inputs cannot be ambiguous.
7. Output byte length and textual encoding.
8. Identifier textual syntax and comparison rules.
9. The handling of optional scopes and absent values.
10. Published test vectors.

A candidate construction is a domain-separated SHA-256 derivation over a fixed protocol context, identifier type, profile version and the complete canonical manifest digest. This is a proposal for specification, not yet a frozen interoperable formula. No implementation may invent its own concatenation or labels.

The same exact source manifest and derivation profile must always produce the same identifiers. Re-importing the same source must not introduce randomness or a new timestamp into identifier derivation.

If the system needs two different nodes to be born from otherwise identical source documents, the source-generation process must provide an explicit differentiating value under a defined schema/profile. The birth certificate must not add an unrecorded random value during derivation.

## 6. Sequential development programme

### Stage 0 — Repository alignment and ownership

**Objective:** Place the component within the existing CIN architecture without duplicating domain logic.

Tasks:
1. Confirm the current lifecycle contract and P7 dependency gates.
2. Confirm the common document envelope and cryptographic profile boundaries.
3. Confirm that the birth module owns node identifiers and the Node Birth Record.
4. Confirm that Genesis owns the Genesis Manifest and its provenance.
5. Confirm that storage owns durable commits and recovery.
6. Confirm that authorization owns operation decisions.
7. Confirm that verification reports structural, cryptographic, trust, authorization and reference checks separately.
8. Record any necessary architectural decisions before changing shared contracts.

Deliverables:
- Approved module ownership.
- Dependency map.
- Issue and implementation branch for the birth component.

Exit gate: no duplicate Genesis, storage, crypto, trust or authorization implementation is introduced into the birth module.

### Stage 1 — Technical specification and contract freeze

**Objective:** Define exact behavior before writing the engine.

Tasks:
1. Define the certificate's actors and user journey.
2. Define accepted input sources: file import and complete JSON paste.
3. Define the complete input manifest schema and supported schema versions.
4. Define the parser behavior for malformed JSON, invalid UTF-8, byte-order marks and duplicate object keys.
5. Define whether unknown fields are preserved and how unsupported schema versions are handled.
6. Define the canonicalization profile and its exact version.
7. Define the raw digest and canonical digest rules.
8. Freeze the identifier catalogue and exact derivation profile.
9. Define the Node Birth Record schema and common document envelope mapping.
10. Define authorization request/response references and the boundary to the authorization engine.
11. Define lifecycle states, error codes, retries and idempotency behavior.
12. Define storage commit and read-back requirements.
13. Define the verification report and export package.
14. Define conformance vectors and acceptance criteria.

Deliverables:
- Normative technical specification.
- Versioned JSON Schemas.
- Valid, invalid and boundary examples.
- Identifier derivation profile.
- Error/state tables.
- Test-vector format.

Exit gate: no ambiguous byte-level derivation rule or undocumented field is left for implementation to guess.

### Stage 2 — Input and source-document handling

**Objective:** Accept the complete Genesis Manifest without losing or silently changing it.

Tasks:
1. Implement file selection and complete-document paste.
2. Read the file as bytes before parsing.
3. Preserve the exact imported byte sequence for the raw digest.
4. Decode JSON using the specified strict encoding rules.
5. Detect duplicate object keys before ordinary object parsing can discard them.
6. Reject malformed JSON and unsupported document types.
7. Validate `document_type`, `schema_version` and required structural fields.
8. Preserve supported unknown fields according to the schema policy.
9. Display the imported source metadata and validation report.
10. Make the original source available for export without rewriting it.

Deliverables:
- Input service.
- Parser and schema validation.
- Input error catalogue.
- Fixtures for valid and invalid documents.

Exit gate: a valid complete manifest can be imported from both supported input methods, and its original bytes remain available for digest calculation.

### Stage 3 — Canonicalization and digest engine

**Objective:** Produce stable, reproducible cryptographic input.

Tasks:
1. Implement the accepted canonicalization profile (JCS/RFC 8785 if confirmed by the cryptographic ADR).
2. Canonicalize the complete root JSON object, not a selected subtree.
3. Compute SHA-256 over the exact original bytes.
4. Compute SHA-256 over the complete canonical byte sequence.
5. Display algorithm, profile, digest encoding and byte lengths.
6. Keep raw and canonical digests clearly distinguished.
7. Reject unsupported canonicalization profiles instead of silently substituting another.
8. Publish canonical byte and digest test vectors.

Deliverables:
- Canonicalization service.
- Digest service.
- Cross-implementation test vectors.

Exit gate: independent implementations produce identical canonical bytes and digest values for every published vector.

### Stage 4 — Identifier derivation engine

**Objective:** Generate the node identifiers deterministically from the approved source digest.

Tasks:
1. Implement the versioned derivation profile exactly as approved.
2. Derive NID from the complete canonical manifest digest.
3. Derive NSID using its own domain label.
4. Derive BID using its own domain label and the agreed birth-record semantics.
5. Derive CIN-REF from NID under a separately specified display/truncation rule.
6. Derive ENID only when the required ecosystem scope is present and valid.
7. Derive PVID only when the required parent/provenance reference exists.
8. Record the derivation profile version and source digest in the output.
9. Ensure no timestamp, random value, UI state or machine-local runtime value enters deterministic derivation unless explicitly included in the source and profile.
10. Verify that changing any part of the canonical source document changes the canonical digest and consequently the derived identifier set, subject to the cryptographic collision-resistance assumption.

Deliverables:
- Identifier service.
- Identifier format validators.
- Golden vectors and negative vectors.

Exit gate: repeated processing of the same input and profile produces byte-identical identifiers across supported implementations.

### Stage 5 — Birth authorization integration

**Objective:** Ensure that the act of birth is authorized independently from the existence of the Genesis Manifest.

Tasks:
1. Create a birth-operation request referencing the Genesis Manifest digest and the proposed birth operation.
2. Bind the request to the relevant node/source and operation scope.
3. Pass the request to the CIN authorization service.
4. Consume the authorization decision and its verifiable reference.
5. Check issuer trust, signature validity, scope, subject/target, validity period and status through their respective services.
6. Keep authorization outcomes separate: pending, authorized, rejected, expired, unavailable or invalid.
7. Do not treat a valid signature alone as authorization.
8. Do not create a BORN state while required authorization is absent or invalid.

Deliverables:
- Birth authorization adapter.
- Request/decision reference contract.
- Integration tests with development fixtures.

Exit gate: only a valid authorization decision for the intended birth operation can proceed to record creation.

### Stage 6 — Node Birth Record construction

**Objective:** Create the formal founding record for the technical node.

Tasks:
1. Define the immutable semantic document body.
2. Include the Node Birth Record type and schema version.
3. Include the NID, NSID, BID and CIN-REF.
4. Include conditional ENID/PVID only when their prerequisites are met.
5. Reference the complete Genesis Manifest by stable document reference and canonical digest.
6. Include the derivation profile and source digest references.
7. Reference the birth authorization decision.
8. Distinguish source observations, operator declarations, derived values and unavailable values.
9. Keep issuance metadata separate from deterministic node identifier derivation.
10. Build the common document envelope with integrity metadata.
11. Keep signature proofs detached and optional until a separate authorized signer is available.
12. Never embed private keys.

Deliverables:
- Node Birth Record builder.
- Versioned birth schema.
- Example record using synthetic fixtures.

Exit gate: the record is structurally valid, references the exact Genesis source and contains no unapproved or inferred claims.

### Stage 7 — Issuance, persistence and idempotency

**Objective:** Commit one authoritative birth record and recover it reliably.

Tasks:
1. Define the boundary between deterministic birth content and later document issuance events.
2. Ensure re-issuing or exporting the same birth does not silently change the NID.
3. Use the storage repository interface; do not write authoritative files directly from the UI.
4. Commit the birth record atomically.
5. Enforce idempotency for retries of the same authorized birth operation.
6. Detect an already committed birth record for the same source/operation.
7. Read back the committed record.
8. Recompute and verify its digest and references.
9. Handle interrupted commits and uncertain outcomes using the storage recovery contract.
10. Never overwrite a valid Genesis Manifest or an existing birth record silently.

Deliverables:
- Birth registration service.
- Storage integration.
- Idempotency and recovery tests.

Exit gate: a successful BORN state requires durable commit and successful read-back verification; failed or uncertain commits never appear as successful birth.

### Stage 8 — Independent verification

**Objective:** Allow the certificate and other CIN components to verify the record without trusting the creation path.

Verification must report separate results for:
1. JSON syntax and encoding.
2. Document type and schema version.
3. Source Genesis Manifest availability and reference match.
4. Raw source digest, where original bytes are supplied.
5. Canonical manifest digest.
6. Identifier derivation and profile version.
7. Node Birth Record digest.
8. Authorization reference and decision validity.
9. Signature validity, if a signature proof is present.
10. Signer trust and issuer authority, where applicable.
11. Storage read-back and record continuity.

A missing optional signature must not be reported as a valid signature. It must be reported as absent/not evaluated according to the verification model. A digest match must not be described as issuer authentication.

Deliverables:
- Independent birth verifier.
- Structured verification report.
- Tampering and invalid-reference tests.

Exit gate: changing source bytes, canonical content, identifier profile, authorization reference or record content is detected by the relevant independent check.

### Stage 9 — Certificate interface and user workflow

**Objective:** Make the defined engine usable without moving domain rules into the interface.

User workflow:
1. Open CIN Node Birth Certificate.
2. Import the complete Genesis Manifest or paste the complete JSON.
3. Review source type, version and validation result.
4. Review the raw source digest.
5. Review the canonical full-manifest digest.
6. Review the identifiers that can be derived and why conditional identifiers may be unavailable.
7. Request/confirm the birth authorization process.
8. Review the proposed Node Birth Record.
9. Confirm the birth operation.
10. Review commit and read-back result.
11. Run independent verification.
12. Export the Node Birth Record, verification report and source references.

UI requirements:
- Show each stage and its state.
- Distinguish required, conditional, unavailable and failed fields.
- Never present a preview as a committed record.
- Never display BORN before the persistence and verification gate succeeds.
- Keep original source and generated record distinguishable.
- Provide clear errors and retry guidance.

Deliverables:
- Certificate UI.
- Accessibility and workflow tests.
- User guide.

Exit gate: the UI invokes application services and displays their actual outcomes; it does not implement cryptographic or authorization logic itself.

### Stage 10 — Integration with CIN Core

**Objective:** Integrate the completed birth engine into the existing lifecycle.

Tasks:
1. Export the birth module through the approved CIN Core public interface.
2. Connect Genesis Manifest retrieval through the document/storage interfaces.
3. Connect canonicalization/digest through the shared crypto module.
4. Connect identifier profile through the approved identifier contract.
5. Connect authorization and verification through their owning services.
6. Connect the record builder to private local storage.
7. Connect the Lobby read model to the persisted Node Birth Record.
8. Ensure the Lobby reconstructs BORN state from authoritative records after restart.
9. Keep personal registration as a separate subsequent lifecycle operation.
10. Update architecture maps, lifecycle docs and project status only after evidence exists.

Deliverables:
- Integrated birth module.
- Updated interfaces and architecture documentation.
- End-to-end lifecycle test.

Exit gate: Genesis → authorized birth → persisted record → independent verification → Lobby reconstruction works without bypassing module boundaries.

### Stage 11 — Acceptance and release

**Objective:** Demonstrate the component works from a clean, reproducible environment.

Acceptance scenarios:
- Import a valid Genesis Manifest by file.
- Import the same complete manifest by paste.
- Confirm identical canonical digest and identifiers.
- Re-import and reproduce the same identifiers.
- Change one field and confirm the source digest and derived outputs change.
- Reject malformed JSON and duplicate object keys.
- Reject unsupported schema and canonicalization versions.
- Correctly omit conditional ENID/PVID when prerequisites are absent.
- Reject absent, expired, invalid or out-of-scope birth authorization.
- Commit a valid birth record exactly once under retries.
- Recover correctly after interrupted storage operations.
- Detect source, record and reference tampering.
- Verify behavior when no signature is attached.
- Verify an attached signature through the separate signer/trust path.
- Close and reopen CIN and reconstruct the same BORN state from storage.
- Confirm no private key material exists in source, package, fixtures or CI artifacts.

Deliverables:
- Unit, schema, vector, integration and E2E results.
- Reproducible build/test instructions.
- Acceptance report with commit references.
- Versioned release notes and limitations.

Exit gate: all mandatory acceptance scenarios pass and are linked to reproducible CI or documented desktop evidence.

## 7. Proposed repository layout

The following is a target layout. Files and directories should be introduced when their first functional slice is ready; do not create empty files and label them engines.

```text
specifications/
  CIN_NODE_BIRTH_CERTIFICATE_SPEC_V1.md
  schemas/
    cin-genesis-environment-manifest-v1.schema.json
    cin-node-birth-record-v1.schema.json
    cin-node-birth-authorization-v1.schema.json
    cin-node-birth-verification-report-v1.schema.json
  examples/
    genesis-manifest-valid.example.json
    genesis-manifest-invalid.example.json
    node-birth-record.example.json
  test-vectors/
    node-birth-v1/
      README.md
      canonical-inputs/
      expected-digests.json
      expected-identifiers.json

prototype/cin-core/src/modules/birth/
  mod.rs
  types.rs
  service.rs
  errors.rs
  tests.rs
  README.md

tests/
  contracts/node-birth/
  integration/node-birth/
  e2e/node-birth/
  fixtures/node-birth/

docs/
  testing/CIN_NODE_BIRTH_CERTIFICATE_ACCEPTANCE.md
  user-guides/CIN_NODE_BIRTH_CERTIFICATE_USER_GUIDE.md
```

The module must reuse shared document, crypto, authorization, verification and storage interfaces. It must not fork those implementations.

## 8. Data flow and responsibility boundaries

| Component | Owns | Birth certificate interaction |
|---|---|---|
| Genesis | Audit and Genesis Manifest | Supplies the complete registered source |
| Documents | Document envelope, type/version and references | Supplies shared document model |
| Crypto | Canonicalization, digest and cryptographic profiles | Supplies canonical bytes and digest operations |
| Identifiers | Common identifier types and profiles | Supplies or hosts the approved derivation contract |
| Authorization | Scoped operation decisions | Authorizes node birth |
| Trust | Issuer, authority and key status | Evaluates trust independently |
| Signing | External signer interface and adapters | May attach detached proof after authorization |
| Storage | Atomic commit, indexes and recovery | Persists source references and birth record |
| Verification | Independent checks and reports | Verifies source, record, authorization and optional proof |
| Birth | Node identifier orchestration and Node Birth Record | Owns the birth domain operation |
| Lobby | Read model and presentation | Displays persisted and verified lifecycle state |

## 9. Required state model

The implementation must map to the existing CIN lifecycle and use explicit states at the birth boundary. At minimum:

- `PRENATAL`
- `BIRTH_PENDING`
- `BIRTH_AUTHORIZATION_PENDING`
- `BIRTH_AUTHORIZED`
- `BIRTH_AUTHORIZATION_REJECTED`
- `BIRTH_CREATION_PENDING`
- `BIRTH_CREATION_FAILED`
- `BORN`

The existing lifecycle specification remains authoritative for state semantics until a reviewed amendment is accepted. Do not create a competing state machine inside the UI.

## 10. Cryptographic and data integrity requirements

1. SHA-256 is used only under an explicit versioned profile.
2. The full canonical Genesis Manifest is the deterministic source for the core identifier derivation.
3. Raw-byte integrity and canonical-document integrity are separate values.
4. Canonicalization must be interoperable and tested across implementations.
5. Every identifier type uses domain separation.
6. Identifier derivation must be deterministic and contain no hidden randomness.
7. Document integrity digest and detached signature proof are separate.
8. Signature validity, signer trust, issuer authority and operation authorization are independent results.
9. Private keys remain external to the certificate and portable repository package.
10. No algorithm or profile is silently substituted when unsupported.

## 11. Open decisions that must be resolved before implementation

1. Final identifier syntax and exact domain-separated derivation byte format.
2. Whether the initial canonicalization profile is RFC 8785 JCS and its precise implementation contract.
3. Exact Genesis Manifest schema versions accepted by Birth Certificate v1.
4. Whether the birth record uses the existing common document envelope without extension or requires a reviewed extension.
5. Exact distinction between stable birth-record ID, issuance event ID and later proof IDs.
6. CIN-REF length, alphabet and collision policy.
7. Exact ecosystem scope model required for ENID.
8. Exact parent/provenance model required for PVID.
9. Authorization document/decision contract and issuer policy dependency.
10. Storage transaction/idempotency contract and behavior for pre-existing birth records.
11. Whether v1 permits an unsigned local birth record pending a separate signature operation, and how its verification status is displayed.
12. Supported import/export media and size limits.

Each decision must be recorded in the appropriate specification or ADR. Do not conceal unresolved choices inside code.

## 12. Definition of done

The certificate is accepted only when all of the following are true:

- Its specification and schemas are reviewed and versioned.
- It imports the complete Genesis Manifest and preserves the exact source bytes.
- Raw and canonical digest behavior is deterministic and covered by vectors.
- Identifier derivation is fully specified and interoperable.
- Conditional identifiers are handled without fabrication.
- Birth authorization is independently evaluated.
- A valid Node Birth Record is built against the exact Genesis source.
- Persistence is atomic, idempotent and recoverable under the storage contract.
- Independent verification reports each check separately.
- The interface reflects real engine outcomes.
- CIN Core and Lobby integration works after restart.
- Unit, contract, vector, integration and E2E tests pass.
- The release contains no private keys and makes no unsupported claims of global uniqueness, issuer trust or institutional recognition.

## 13. Development order recommendation

Build in this order:

**Specification and test vectors → input/parser → canonicalization/digests → identifier derivation → authorization integration → birth record builder → storage/idempotency → independent verifier → UI → CIN Core/Lobby integration → acceptance.**

This order is intentional. The identifier algorithm and source serialization are foundational contracts; the UI and integration must consume them rather than define them.

---

*End of development plan.*
