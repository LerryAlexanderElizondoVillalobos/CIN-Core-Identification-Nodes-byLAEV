# CIN Common Document Model v1

**Specification ID:** `cin.common-document-model`  
**Version:** `1.0.0-draft`  
**Status:** Proposed contract — review required  
**Planning phase:** M0 — Architecture Baseline  
**Related:** Issue #5; [Architecture Baseline](../docs/architecture/CIN_ARCHITECTURE_BASELINE_V1.md); [Verification Result Model](CIN_VERIFICATION_RESULT_MODEL_V1.md); [ADR-0003](../docs/decisions/0003-document-serialization-and-signature-profile.md)

## 1. Purpose

Define a common envelope for CIN records and credentials so individual components do not invent incompatible identifiers, version fields, issuer references, digests, signatures or verification semantics.

This model defines document structure and cryptographic binding. It does not select a legal credential format, establish an issuer authority, grant an operation permission, or prove the truth of a payload attribute.

## 2. Architectural rules

1. Every persisted CIN document has a stable document identifier, type and schema/profile version.
2. The immutable document body is separated from its integrity metadata and signature proofs.
3. The document digest is calculated over the canonicalized `document` object only.
4. A signature proof binds to the document type, schema version, digest algorithm and digest using a domain-separated signing input.
5. Signature validity, signer-key trust, issuer authority, operation authorization, validity period, revocation and reference resolution are separate checks.
6. Verification results are reports produced by a verifier under a named profile and policy version. They are not silently written into the immutable document body.
7. A schema-valid JSON object is not automatically an authentic, trusted, authorized or factually true document.
8. Private signing keys are never embedded in documents, the portable ZIP, repository files or ordinary CI artifacts.
9. Development/test keys and authorities must be explicitly marked as non-production.
10. A document can reference another document by stable ID and digest; references must be resolved and verified according to the consuming operation's policy.

## 3. Envelope structure

A CIN common document has three top-level sections:

| Section | Purpose | Mutable? |
|---|---|---|
| `document` | Immutable semantic content: identity, type, version, issuer, subject, timestamps, references and payload | No; corrections create a new version/document or append a correction event |
| `integrity` | Canonicalization profile and content digest for the immutable document body | Recomputed when the body changes |
| `proofs` | One or more detached signature proofs over the digest-bound signing input | Append only as separately defined proof events; never alter the signed body |

### 3.1 Required document fields

- `document_id`: stable identifier assigned under the relevant CIN document-ID profile.
- `document_type`: namespaced type such as `cin.genesis-manifest`, `cin.node-birth-record`, `cin.personal-registration`, or `cin.personal-credential`.
- `schema_version`: version of the type-specific schema, independent from the application version.
- `created_at`: RFC 3339 timestamp for document creation.
- `issuer.issuer_id`: stable reference to the issuing authority or node under the applicable trust profile.
- `payload`: type-specific content validated by the document-type schema.

Optional fields:
- `issued_at`, `valid_from`, `valid_until`: issuance and validity timestamps where applicable.
- `subject`: explicit subject reference where applicable.
- `references[]`: typed links to other documents, records, evidence or authorization decisions.
- `issuer.key_id`: key reference used for a proof; it does not itself establish trust.

### 3.2 Integrity section

The `integrity` section contains:
- `canonicalization`: a versioned canonicalization profile identifier.
- `digest_algorithm`: a registered algorithm identifier.
- `digest`: encoded digest bytes.

The initial proposed canonicalization candidate is RFC 8785 JSON Canonicalization Scheme (JCS), consistent with the existing Package Manifest v1 proposal. The common model must retain an explicit profile identifier so another interoperable profile can be introduced through a versioned decision.

The digest input is the canonical byte representation of the complete `document` object only. The `integrity` and `proofs` sections are excluded to avoid self-reference and signature circularity.

### 3.3 Signature proofs

Each proof records:
- `proof_id`: stable proof identifier.
- `proof_type`: detached signature proof type.
- `purpose`: declared purpose, such as document issuance or attestation.
- `signature_suite`: explicit, versioned algorithm-suite identifier.
- `verification_method`: issuer key reference.
- `created_at`: proof creation timestamp.
- `signature_value`: encoded signature bytes.

The signing input must be domain separated and bind at minimum:
- CIN document-signature context/version;
- `document_type`;
- `schema_version`;
- `digest_algorithm`;
- `digest`.

The exact byte encoding and signature-suite requirements must be specified by the accepted cryptographic profile. A verifier must reject an unsupported suite rather than silently substitute an algorithm.

## 4. Cryptographic and authority separation

| Question | Required mechanism | What it does not establish |
|---|---|---|
| Is the document structurally valid? | Type-specific schema validation | Authenticity or truth |
| Does the digest match? | Canonicalization and digest recomputation | Who created the document |
| Is the signature mathematically valid? | Signature verification using the referenced public key | Whether the key is trusted |
| Is the signer trusted for this purpose? | Trust-anchor, delegation, key status and purpose policy | Permission for a separate operation |
| Was an operation authorized? | Separate authorization decision bound to subject, action, scope and validity | Truth of all document payload claims |
| Are references valid? | Resolution and verification of referenced records | Automatic truth of referenced assertions |

Package publisher trust is a distinct trust purpose from CIN document issuer trust. The Package Manifest profile must not be treated as a universal issuer certificate.

## 5. Versioning and algorithm agility

- Document type and schema version are explicit and independently versioned.
- Canonicalization, digest algorithm and signature suite are named by stable identifiers.
- A verifier must support an explicit allowlist/profile; it must not infer an algorithm from signature length or key shape.
- Algorithm deprecation and migration require versioned profiles and test vectors.
- A new cryptographic suite must not change the meaning of an existing document type silently.
- Unsupported versions and algorithms produce an explicit unsupported/incomplete verification result.

## 6. Authorization references

An authorization is itself a separately typed, verifiable CIN document or authority response. It must bind the permitted operation to the relevant subject, target record, issuer, scope, time window and policy. A signature on the target document does not imply that the operation which created it was authorized.

Node Birth Authorization and Personal Issuance Authorization remain distinct document/decision types and must not be merged into a generic permission flag.

## 7. Privacy and key custody

- Payload fields are defined by the specific document type and data-minimization rules.
- Sensitive attributes are not placed into generic headers merely for convenience.
- The common document envelope contains public key references, never private key material.
- Signer adapters receive signing requests and return proof material; key custody remains outside the CIN portable package.
- Test fixtures must use clearly marked development keys and authorities.

## 8. Schema and example artifacts

- JSON Schema: `schemas/cin-common-document-v1.schema.json`
- Example: `examples/cin-common-document-v1.example.json`

The JSON Schema validates structure and basic field types only. It cannot validate canonicalization, digest correctness, signature validity, issuer trust, authorization, revocation or factual truth. Those require separate executable verifiers and conformance vectors.

## 9. Open decisions

- Final canonicalization and cryptographic suite profile, subject to interoperability review and ADR-0003.
- Trust-anchor format, issuer governance, key rotation and revocation source.
- Document ID allocation profile and globally coordinated uniqueness where applicable.
- Type-specific schemas and required payload fields for each CIN record.
- Credential interoperability format, if a future institutional use case requires one.

## 10. Completion boundary

This is a proposed common data contract. It does not mean individual CIN documents, certificates, authorities, signers or verifiers have been implemented. Issue #5 remains open until the common schemas, examples, positive/negative vectors and CI validation agree and pass review.

---
*End of specification.*
