# CIN Verification Result Model v1

**Specification ID:** `cin.verification-result`  
**Version:** `1.0.0-draft`  
**Status:** Proposed contract — review required  
**Planning phase:** M0 — Architecture Baseline  
**Related:** Issue #5; [Common Document Model](CIN_COMMON_DOCUMENT_MODEL_V1.md); [Architecture Baseline](../docs/architecture/CIN_ARCHITECTURE_BASELINE_V1.md)

## 1. Purpose

Define a structured result for verifiers so CIN components can report what was checked, what passed, what failed, what remains unknown and which policy produced the result.

A verification result is not a boolean and must not collapse cryptographic validity, issuer trust and operation authorization into one status.

## 2. Result envelope

Every report contains:

- `report_id`: stable report identifier.
- `target_document_id`: document being evaluated.
- `verifier_profile`: verifier implementation/profile name and version.
- `policy_id`: policy under which the decision was made.
- `evaluated_at`: RFC 3339 timestamp.
- `decision`: `accept`, `reject`, `defer` or `not-evaluated`.
- `checks`: independent results for each applicable verification dimension.
- `findings[]`: machine-readable reasons and optional human-readable context.

The report should also record the verifier software version and trust-store snapshot/reference where those affect reproducibility.

## 3. Independent check dimensions

| Check | Question | Possible statuses |
|---|---|---|
| `schema` | Does the document match its declared type/schema? | pass, fail, not_checked, error |
| `canonicalization` | Can the declared canonicalization profile be applied? | pass, fail, unsupported, not_checked, error |
| `digest` | Does recomputed content digest match the declared digest? | pass, fail, not_checked, error |
| `signature` | Is each proof mathematically valid for the bound digest and purpose? | pass, fail, unsupported, not_checked, error |
| `issuer_trust` | Is the key/issuer trusted for this document type and purpose? | trusted, untrusted, unknown, expired, revoked, not_checked, error |
| `authorization` | Is the specific operation permitted for this subject, target and scope? | authorized, unauthorized, unavailable, not_applicable, not_checked, error |
| `validity` | Is the document/proof within its declared time window? | valid, not_yet_valid, expired, not_applicable, not_checked, error |
| `revocation` | Is the relevant issuer/key/document status current and non-revoked? | not_revoked, revoked, unknown, unavailable, not_applicable, not_checked, error |
| `references` | Do required referenced records resolve and satisfy their declared constraints? | resolved, missing, invalid, incomplete, not_checked, error |
| `policy` | Does the full result satisfy the named consumer policy? | pass, fail, indeterminate, not_checked, error |

A check that is not applicable must say so. An unavailable trust or revocation service must not be converted into a successful result.

## 4. Decision semantics

- `accept`: every check required by the named policy passed; no required check is unknown, unsupported, pending or unavailable.
- `reject`: at least one required check definitively failed, or the policy explicitly rejects the document/operation.
- `defer`: a required check cannot currently be completed, such as unavailable authority, trust or revocation data.
- `not-evaluated`: the verifier did not execute the policy or the input was insufficient to begin evaluation.

The decision is policy-scoped. A document may pass integrity and signature checks but still be untrusted or unauthorized. Consumers must inspect the independent checks and findings, not rely on the decision field alone.

## 5. Findings

Each finding should include:
- stable `code`;
- `category` such as structure, integrity, signature, trust, authorization, validity, revocation, reference or policy;
- `severity` such as info, warning, error or critical;
- concise `message`;
- optional related document, proof, key, authority or reference identifier.

Avoid embedding private data or secret material in diagnostic messages.

## 6. Development and production trust separation

A report must identify the trust profile and environment used. Development/test authorities and keys must be marked as non-production. A test certificate that passes a development trust profile must not be reported as production-trusted.

Trust evaluation must consider key purpose, issuer delegation, validity, revocation and the trust-anchor configuration. A cryptographically valid signature from an unknown key remains untrusted.

## 7. Schema and example artifacts

- JSON Schema: `schemas/cin-verification-result-v1.schema.json`
- Example: `examples/cin-verification-result-v1.example.json`

Schema validation checks the report structure only. It does not prove that the verifier executed the checks correctly or that the reported outcome is true. Cryptographic and authorization conformance tests must use independent positive and negative vectors.

## 8. Completion boundary

This model defines how results are represented. It does not implement the verifiers, trust registry, revocation service or authorization engine. Issue #5 remains open until schemas, examples, test vectors and automated validation are reviewed and integrated.

---
*End of specification.*
