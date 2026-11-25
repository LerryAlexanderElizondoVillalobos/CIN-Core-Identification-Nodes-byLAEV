# CIN Node Identifier Derivation Profile v1 — Decision Candidate

**Profile ID:** `cin.node-identifier-derivation`  
**Candidate version:** `1.0.0`  
**Status:** Proposed candidate — NOT approved for production  
**Related:** ADR-0003; CIN Node Birth Certificate Specification v1; Issue #34

## 1. Purpose

This document turns the open identifier-derivation questions in the Node Birth Certificate draft into one reviewable candidate. It is a decision proposal, not an implementation permission or a production cryptographic policy. The project owner must approve the profile and ADR-0003 before an implementation can label its outputs official CIN identifiers.

## 2. Source document and digest inputs

The derivation source is the complete root JSON value of the registered Genesis Environment Manifest. No root section is excluded. In particular, `bibliographic_references`, `limitations`, and `generation` participate in the canonical digest.

Two digests are distinct and must never be substituted for one another:

- `raw_sha256 = SHA-256(exact_original_input_bytes)`: exact byte provenance; whitespace and key-order changes affect it.
- `manifest_sha256 = SHA-256(JCS(complete_root_json_value))`: semantic canonical digest; equivalent JSON objects canonicalize to the same bytes.

The proposed canonicalization is RFC 8785 JSON Canonicalization Scheme. Implementations must reject duplicate object keys before conversion into a data model, preserve the exact input bytes when available, validate UTF-8 and the Genesis schema, and reject unsupported canonicalization profiles. A generic JSON serializer is not an acceptable silent fallback.

## 3. Proposed digest and byte framing

For review, the candidate uses SHA-256 and a fixed 32-byte source digest. Each identifier is derived as:

`identifier_digest = SHA-256(domain_label_bytes || manifest_sha256_raw_32_bytes)`

The labels below are exact ASCII byte strings including the final NUL byte. The fixed-width 32-byte digest follows immediately; no hexadecimal text, JSON wrapper, delimiter guessing, random nonce, timestamp, machine property, or UI state is inserted.

| Identifier | Candidate domain label | Output |
|---|---|---|
| CIN-NID | `CIN\0NODE\0NID\0v1\0` | 32-byte SHA-256, lowercase hex |
| CIN-NSID | `CIN\0NODE\0NSID\0v1\0` | 32-byte SHA-256, lowercase hex |
| CIN-BID | `CIN\0NODE\0BID\0v1\0` | 32-byte SHA-256, lowercase hex |

Textual forms:

- `cin:nid:v1:<64 lowercase hexadecimal characters>`
- `cin:nsid:v1:<64 lowercase hexadecimal characters>`
- `cin:bid:v1:<64 lowercase hexadecimal characters>`

CIN-REF is a display-only abbreviation candidate: the first 16 uppercase hexadecimal characters of the CIN-NID digest. It is never an authoritative registry key. The registry must detect collisions; a collision must not silently change NID.

**Important semantic note:** Under this proposal CIN-BID is deterministic for the same canonical Genesis source and profile. Re-running birth with that same source therefore addresses the same logical birth event and supports idempotency. A distinct node requires a distinct, explicit Genesis source value; the birth engine must not add hidden randomness.

## 4. Conditional identifiers

- CIN-ENID is absent unless a valid ecosystem identifier and versioned ecosystem-scope profile are present in the source/validated context.
- CIN-PVID is absent unless an explicit parent or provenance reference exists and is validated.
- Absence is represented as `not_applicable` or `unavailable`, never by a fabricated identifier.

CIN-RAW-HASH and CIN-MANIFEST-HASH are integrity digests, not additional node identifiers.

## 5. Interoperability vector contract

Every published vector must contain:

1. Exact source JSON UTF-8 bytes (fixture file).
2. Expected parse/validation result, including duplicate-key rejection cases.
3. Expected JCS canonical UTF-8 bytes, represented losslessly (fixture file or hex).
4. Expected raw SHA-256 where exact source bytes are supplied.
5. Expected canonical manifest SHA-256.
6. Exact domain-label bytes in hex.
7. Expected 32-byte NID, NSID and BID digests.
8. Expected textual identifiers and CIN-REF.
9. Profile ID/version and implementation/tool versions.
10. Negative mutation cases and expected outcomes.

At least two independent implementations must agree byte-for-byte on canonical output and digest/identifier results before ADR-0003 can be considered for acceptance. A single implementation testing itself is not independent evidence.

## 6. Required test cases

| Case | Expected result |
|---|---|
| Same exact source repeated | Same raw digest and all identifiers |
| JSON whitespace/key order changed, same JSON value | Raw digest changes; canonical digest and identifiers remain the same |
| Any semantic field changed, including bibliography or generation notes | Canonical digest and derived identifiers change |
| Duplicate JSON key | Reject before canonicalization |
| Invalid UTF-8 / malformed JSON | Reject |
| Unsupported Genesis schema version | Reject |
| Unsupported canonicalization profile | Reject; no fallback |
| Wrong domain label | Produces a different digest; vector must detect it |
| Hex text accidentally hashed instead of raw 32-byte digest | Vector must detect mismatch |
| Missing ecosystem scope | No ENID |
| Missing parent/provenance reference | No PVID |
| Repeated birth request for same source/profile | Same logical BID; storage operation is idempotent |

## 7. CIN 001 fixture status

The supplied CIN 001 Genesis Environment Manifest is the intended positive fixture. Its exact original pasted byte stream must first be preserved as a fixture file to calculate a defensible raw digest. The canonical JCS bytes and expected outputs must then be independently generated by at least two conforming implementations.

No expected hash or identifier is hard-coded in this proposal because an unverified value would create a false interoperability vector. Previously produced prototype hashes are not accepted as normative vectors.

## 8. Approval gates

This candidate remains blocked until:

- The project owner approves the exact labels, framing, identifier semantics and CIN-REF rule.
- ADR-0003 is accepted or amended to accept the canonicalization/digest/signature profile.
- Two independent JCS implementations agree on the CIN 001 fixture and published edge-case vectors.
- The birth-record schema, descriptor and tests reference the same accepted profile.
- The P2 storage, P3 crypto/verification, P5 Genesis and P6 authorization prerequisites are satisfied before production issuance.

## 9. Implementation boundary

After approval, implement this as a pure deterministic module in `prototype/cin-core` with no filesystem writes, signer calls, authorization side effects or UI dependencies. The birth orchestration layer must call it only after validating and resolving the registered Genesis source. Persistence and the BORN transition remain governed by the P2/P6/P7 contracts.

---

*End of candidate profile.*
