# CIN Common Document Envelope Specification v1

**Status:** Initial implementation contract  
**Scope:** Structural envelope and serialization only  
**Out of scope:** JSON Schema semantics, canonicalization, cryptographic proof, trust, authorization and domain-specific payloads.

## 1. Envelope

A CIN document is a typed, versioned record with stable identifier, creation timestamp, optional issuer reference, explicit references and a domain payload.

| Field | Type | Requirement |
|---|---|---|
| document_id | string | required, non-empty, stable and unique within repository namespace |
| document_type | string | required, non-empty registered type |
| schema_version | string | required, non-empty version |
| created_at | string | required UTC RFC3339 timestamp (Z) |
| issuer | object | optional; issuer_id non-empty |
| references | array | required; zero or more typed document references |
| payload | JSON value | required; validated against document-specific schema |

Reference object: reference_type and document_id, both non-empty. Duplicate target document IDs in one envelope are rejected in v1; if multiple semantic relations to the same record are needed, represent them in a domain payload or revise this rule through an ADR.

## 2. Structural validation
- Reject empty required fields.
- Reject malformed timestamp shape; implementation v1 checks UTC/RFC3339 shape only. Full calendar/time-zone validation is a follow-up.
- Reject empty reference fields and repeated reference target IDs.
- Reject empty issuer identifier when issuer is present.
- Structural validation does not infer schema validity, issuer trust, signature validity or authorization.

## 3. Serialization
The initial implementation uses UTF-8 JSON. Serialization is not canonical and must not be used as signature input. RFC 8785 JCS canonical bytes are a separate cryptographic contract.

## 4. Compatibility
- Adding optional fields requires a schema-version/compatibility review.
- Renaming/removing fields or changing semantics is breaking.
- Domain payload schemas are independently versioned.
- Consumers must reject unsupported major schema versions and report a typed compatibility result.

## 5. Acceptance tests
Valid envelope round-trip; empty ID/type/version; malformed timestamp; empty issuer; empty reference; duplicate reference; payload preserved; unknown/unsupported version behavior documented.
