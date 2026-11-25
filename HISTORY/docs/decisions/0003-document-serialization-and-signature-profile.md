# ADR-0003 — Common Document Serialization and Signature Profile

- **Status:** Proposed — profile selection requires interoperability and implementation evidence
- **Date:** 2026-11-15
- **Decision owner:** CIN project owner
- **Related:** Issue #5; [Common Document Model](../../specifications/CIN_COMMON_DOCUMENT_MODEL_V1.md); [Verification Result Model](../../specifications/CIN_VERIFICATION_RESULT_MODEL_V1.md); [ADR-0002: Portable ZIP Runtime](0002-portable-runtime-and-zip-packaging-model.md)

## Context

CIN needs a common representation for Genesis Manifests, Node Birth Records, personal registration records, credentials, evidence records and authorization documents. Independent components must agree on stable document identifiers, schema versions, canonical bytes, content digests, signature proofs and verification outcomes.

The existing Package Manifest v1 proposal already uses JSON, RFC 8785 JCS, SHA-256 and Ed25519. That is useful repository precedent, but package publisher verification and CIN document issuer verification have different trust purposes and must remain separate.

## Proposed direction

1. Use JSON as the initial common document representation.
2. Use JSON Schema Draft 2020-12 for structural schema validation.
3. Evaluate RFC 8785 JCS as the canonicalization profile, consistent with the existing package-manifest proposal.
4. Preserve explicit digest-algorithm and signature-suite identifiers in every document profile.
5. Evaluate SHA-256 and Ed25519 as the initial interoperability/test-vector candidate, not as a silently universal production profile.
6. Separate document body, integrity metadata and detached signature proofs to avoid circular hashing/signing.
7. Use the independent verification-result model for signature validity, issuer trust, authorization, validity, revocation and reference checks.

## Alternatives considered

### Reuse Package Manifest v1 unchanged for all CIN documents
Not adopted. The package manifest describes a release artifact and its publisher. CIN documents have different issuers, subjects, purposes, authorization scopes and lifecycle rules.

### Adopt a specific credential standard immediately
Deferred. No implemented issuer, relying party, institutional interoperability profile or production authority has yet been demonstrated. A credential format should be selected only when the actual interoperability requirement is defined.

### Allow each component to choose its own serialization and signature structure
Rejected as the default. It would create inconsistent verification semantics and make cross-component records difficult to validate.

## Evidence required before acceptance

- Canonicalization and digest test vectors across at least two independent implementations.
- Positive and negative signature vectors, including wrong key, altered body, unsupported suite and purpose mismatch.
- A clear distinction between valid signature and trusted issuer.
- External signer interface compatibility evidence.
- Review of schema evolution and algorithm migration behavior.
- Confirmation that no production private keys enter the ZIP, repository or ordinary CI artifacts.

## Consequences

- The common document envelope and verification-result model are specified independently of any one certificate format.
- Type-specific schemas must use the common envelope and must not redefine shared fields.
- Package publisher trust remains a separate trust domain.
- Production profile selection remains open until the evidence above is reviewed.

## Reconsideration

This ADR may be accepted, revised or superseded after interoperability testing and project-owner review. Until then, its proposed direction is not a production cryptographic policy.

---
*End of ADR.*
