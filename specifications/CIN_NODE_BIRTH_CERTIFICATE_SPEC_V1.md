# CIN Node Birth Certificate Specification v1

**Specification ID:** `cin.node-birth-certificate`  
**Version:** 1.0.0-draft  
**Status:** Proposed contract — cryptographic and lifecycle gates remain open  
**Lifecycle phase:** P7 — Node birth  
**Certificate descriptor:** `Core Identification Node Github/CIN-NODE-BIRTH.cincert`  
**Primary Issue:** #34

## 1. Purpose

The CIN Node Birth Certificate consumes a complete, previously generated and registered Genesis Environment Manifest. It creates a separate Node Birth Record that establishes the technical birth event of a CIN node.

The Genesis Environment Manifest describes pre-birth conditions. The Node Birth Record records the subsequent birth event. Neither document replaces, rewrites, or silently absorbs the other.

The certificate does not rerun environment collection. It does not register a person, issue a CIN Personal Number, create private signing keys, or automatically admit the node to a network.

## 2. Lifecycle position and prerequisites

The repository master workplan defines P7 — Node birth as dependent on P2 (storage), P3 (cryptography and verification), P5 (Genesis) and P6 (authorization). P7 acceptance requires authorized birth, identifier, record, idempotency and recovery evidence.

Consequently, the certificate descriptor and this contract may be developed now, but production issuance must not be enabled until all four prerequisite phases provide their required evidence.

Required source lifecycle:
1. Package verification and extraction.
2. Environment audit.
3. Genesis Manifest creation and validation.
4. Genesis Manifest first logical-record registration in private local storage.
5. Node Birth Certificate source import.
6. Source validation and deterministic derivation.
7. Birth authorization.
8. Node Birth Record construction.
9. Atomic persistence and read-back.
10. Independent verification.
11. BORN state reconstruction from the authoritative records.

A generated Genesis Manifest that has not been durably registered is not a valid registered source for the normal birth flow. File import and paste are supported inspection/import modes, but an actual birth operation must resolve or register the source through the authoritative storage contract.

## 3. Input contract

Accepted input document:
- `document_type`: `cin.genesis-environment-manifest`
- `schema_version`: `1.0.0` for this initial profile.

Accepted UI modes:
- Select a registered Genesis Manifest by document reference.
- Import the complete JSON file.
- Paste the complete JSON text.

For every mode:
- Preserve the exact source bytes when available.
- Parse the complete root JSON document.
- Reject malformed JSON, invalid UTF-8 and duplicate object keys.
- Reject unsupported document types and schema versions.
- Validate required fields and types under the declared Genesis schema.
- Preserve supported unknown fields according to the source schema's forward-compatibility policy.
- Do not discard bibliographic references, limitations, generation metadata or any other root-level section.

The complete Genesis Manifest participates in canonicalization. Hashing only `node`, `environment_data`, or a selected subset is non-conforming.

## 4. Source fields and semantic interpretation

The sample Genesis Manifest has these distinct categories:

| Source field | Meaning in birth processing |
|---|---|
| `document_type` | Genesis source document type |
| `schema_version` | Source schema version |
| `manifest_id` | Source manifest reference; not the node identifier |
| `generated_at` | Source generation timestamp |
| `node.node_id` | Operator/system-facing node label; not the cryptographic NID |
| `node.storage_target` | Declared storage target; not a cryptographic identifier |
| `certificate.certificate_id` | Genesis certificate reference |
| `certificate.version` | Genesis certificate version |
| `certificate.collection_profile_id` | Environment collection profile |
| `certificate.profile_sha256` | Collection-profile digest; not the full manifest digest |
| `environment_data` | Collected environment data and limitations |
| `bibliographic_references` | Certificate-supplied documentary metadata |
| `generation` | Generator and execution provenance |

No field is promoted to a claim stronger than its source semantics. Browser-limited observations are not a complete operating-system or hardware inventory.

## 5. Integrity processing

Two input digests are recorded separately:

### 5.1 Raw source digest

`raw_sha256 = SHA-256(exact_original_input_bytes)`

This value changes if byte-level formatting changes, even if the parsed JSON data model remains equivalent.

### 5.2 Canonical manifest digest

The candidate canonicalization profile is RFC 8785 JSON Canonicalization Scheme (JCS), consistent with the proposed CIN Common Document Model and ADR-0003.

`canonical_manifest_bytes = JCS(complete_root_json_value)`

`manifest_sha256 = SHA-256(canonical_manifest_bytes)`

The canonical digest is the deterministic source for the node identifier profile. The raw digest is retained for exact-file provenance and must not be substituted for the canonical digest.

JCS selection remains proposed until ADR-0003 is accepted and independent implementation vectors pass. A runtime must reject an unsupported canonicalization profile; it must not silently substitute a serializer.

## 5.3 Identifier derivation decision candidate

A reviewable but unapproved derivation proposal is maintained in [CIN Node Identifier Derivation Profile v1 — Decision Candidate](CIN_NODE_IDENTIFIER_DERIVATION_PROFILE_V1_CANDIDATE.md). It proposes exact domain labels, fixed-width digest framing, textual forms, conditional identifier behavior, and the required two-implementation vector evidence. It does not override this specification's open status or authorize production identifiers. The project owner must approve the proposal and ADR-0003 before implementation freezes the profile.

## 6. Identifier profile

The initial catalogue is:

| Identifier | Meaning | Status |
|---|---|---|
| `CIN-NID` | Principal technical identifier of the node | Required |
| `CIN-NSID` | Root namespace identifier for resources owned by this node | Required |
| `CIN-BID` | Identifier of the logical birth record/event | Required |
| `CIN-REF` | Human-readable abbreviated reference derived from NID | Required |
| `CIN-ENID` | Identifier scoped to a named CIN ecosystem | Conditional |
| `CIN-PVID` | Parent/provenance reference identifier | Conditional |

`CIN-RAW-HASH` and `CIN-MANIFEST-HASH` are integrity digests, not additional node identifiers.

### 6.1 Domain separation

Every identifier type must use a distinct, versioned domain-separation label and an unambiguous byte framing rule. The profile must specify:
- protocol context;
- identifier type;
- derivation profile version;
- source digest bytes;
- optional ecosystem or parent scope where applicable;
- exact UTF-8/byte encoding;
- output length and textual encoding.

The candidate profile name is `cin.node-identifier-derivation/1.0.0`. Exact labels and framing are deliberately not frozen by this draft because ADR-0003 and the cryptographic interoperability gate remain open. Implementations must not invent their own concatenation, truncation or normalization rules.

### 6.2 Determinism

For the same complete canonical Genesis Manifest and the same accepted derivation profile, the required identifiers must be identical on every supported implementation.

No random nonce, local machine value, UI state or issuance timestamp may enter deterministic derivation unless explicitly included in the source document and approved profile.

If two distinct nodes are required from otherwise identical Genesis source data, the Genesis source/profile must include an explicit distinguishing value. The birth certificate must not inject hidden randomness.

### 6.3 Conditional identifiers

- ENID is not emitted unless a valid `ecosystem_id` and ecosystem scope profile are defined.
- PVID is not emitted unless a parent/provenance relationship is explicitly present and validated.
- Missing prerequisites produce an explicit `not_applicable` or `unavailable` status, not a fabricated value.

### 6.4 CIN-REF collision policy

CIN-REF is a display convenience, never an authoritative key. Its truncation length and alphabet require a profile decision. Any collision is detected by the authoritative registry; the system must not silently alter NID or derive a different NID to resolve a display-reference collision.

## 7. Node Birth Record

The output uses the common document model:
- `document`: immutable semantic content;
- `integrity`: canonicalization profile, digest algorithm and digest of the complete `document` object;
- `proofs`: optional detached proofs, added by the separate signer interface.

The birth payload contains at minimum:
- source Genesis document ID and canonical digest;
- source document type and schema version;
- raw source digest when exact original bytes are available;
- NID, NSID, BID and CIN-REF;
- conditional ENID/PVID only when applicable;
- identifier derivation profile and version;
- birth authorization decision reference;
- provenance classifications for values;
- birth event semantics and record version.

The complete Genesis Manifest is referenced, not copied into the birth payload. It remains a separate authoritative record.

The birth record's own integrity digest is calculated over its complete immutable `document` object under the common document profile. This digest is not fed back into NID derivation.

## 8. Authorization, signatures and trust

The birth operation is `cin.node.birth`. It requires a separate, verifiable authorization decision bound to the intended operation, subject, Genesis source and target node/birth context.

The verifier must report separately:
- structural/schema validity;
- canonicalization and digest integrity;
- signature validity, if a proof is supplied;
- signer/issuer trust;
- authorization decision and scope;
- validity/revocation status where supported;
- reference resolution.

A valid signature is not itself an authorization. A digest match is not a signature. An unsigned local record must not be represented as signed or issuer-authenticated.

Private signing keys remain outside the certificate and repository. External signer integration is optional and detached.

## 9. Persistence and BORN condition

The certificate must use the shared TransactionalStore/document repository, not write authoritative files directly from the interface.

Birth is idempotent for a given authorized birth operation. Retrying the same operation and same immutable input returns or verifies the existing result. Reusing the same operation reference with different input is a conflict.

BORN may be reported only after:
1. birth authorization is accepted under policy;
2. Node Birth Record construction succeeds;
3. atomic commit succeeds;
4. committed record is read back;
5. independent verification of the record, Genesis reference and authorization succeeds.

A failed or uncertain commit must never be presented as BORN. Lobby state is reconstructed from authoritative records and verification results, not a UI flag.

## 10. Issuance and reproducibility

Separate deterministic birth content from issuance metadata:
- NID/NSID/BID/CIN-REF are derived under the fixed source/profile.
- A later export or re-issuance does not change those identifiers.
- Issuance timestamps and detached proofs are not part of the deterministic source digest.
- A new immutable issuance/proof event references the same birth record where applicable.

Reprocessing the exact same Genesis source under the same profile reproduces identifiers. Re-running Genesis collection is not guaranteed to reproduce the same source because observations and timestamps may change.

## 11. Verification report

The independent verifier reports distinct checks:
- input syntax/encoding;
- source schema/type/version;
- source raw digest (when source bytes are available);
- canonicalization profile support;
- complete canonical source digest;
- identifier derivation/profile match;
- birth record schema;
- birth record digest;
- authorization reference and decision;
- optional proof validity;
- issuer trust and authority;
- source and authorization reference resolution;
- storage commit/read-back status.

A missing optional proof is reported as absent/not checked, not as a successful signature.

## 12. Errors and non-success outcomes

At minimum:
- invalid encoding or JSON;
- duplicate object key;
- unsupported source type/version;
- schema validation failure;
- unsupported canonicalization profile;
- digest mismatch;
- unsupported identifier profile;
- missing conditional scope;
- authorization pending/rejected/unavailable/expired/out-of-scope;
- identifier collision in the authoritative registry;
- conflicting idempotency key;
- storage unavailable/commit failed/commit uncertain;
- read-back or independent verification failure.

Errors remain typed and must not be converted into authorization or success.

## 13. Test and acceptance matrix

| Scenario | Expected result |
|---|---|
| Same source bytes imported by file and paste | Same raw digest, canonical digest and identifiers |
| Semantically same JSON with different whitespace/key order | Raw digest may differ; canonical digest and identifiers match under JCS |
| Any complete source field changes | Canonical digest changes; identifiers change, subject to hash collision resistance |
| Bibliography/limitations/generation section omitted | Schema or canonical digest mismatch; source is not silently narrowed |
| Duplicate object key | Reject before canonicalization |
| Unsupported source schema | Explicit unsupported result |
| Missing ecosystem ID | No ENID |
| Missing parent reference | No PVID |
| Authorization unavailable | Defer; do not create BORN |
| Authorization rejected or wrong scope | Reject |
| Same authorized operation retried | Idempotent result; no duplicate birth |
| Same operation ID with different input | Conflict |
| Storage interrupted | Recovery report; no false BORN |
| Birth record altered | Digest/verification failure |
| Signature absent | Integrity may pass; signature remains absent/not checked |
| Restart after successful birth | BORN reconstructed from committed records and verifier |

Cross-implementation vectors must publish exact source bytes, canonical bytes, raw digest, canonical digest, each identifier output and expected verification report. At least two independent implementations must agree before the cryptographic profile is accepted.

## 14. Dependencies and release gate

P7 depends on accepted evidence from:
- P2: storage atomicity, recovery, idempotency and restart behavior;
- P3: canonicalization, digest, identifier/signature profile and independent verification;
- P5: Genesis schema, provenance, deterministic source and first-record registration;
- P6: authorization, issuer/authority and unavailable/rejection behavior.

The current repository marks ADR-0003 proposed and the P2/P3/P5/P6 engines as incomplete or in progress. Therefore this certificate descriptor is a registered development artifact, not an executable production certificate yet.

## 15. Definition of done

- Accepted specification and ADR decisions.
- Versioned input/output schemas.
- Strict complete-document import and preservation.
- JCS and SHA-256 conformance vectors.
- Frozen, domain-separated identifier profile and vectors.
- Conditional identifier semantics.
- Authorization integration.
- Node Birth Record builder.
- Transactional persistence, idempotency and recovery.
- Independent verifier.
- Runner action implemented and tested.
- User interface displays actual service outcomes.
- End-to-end Genesis → authorized birth → committed record → verification → BORN test.
- No private keys in source, package, repository or ordinary CI artifacts.

---
*End of specification.*
