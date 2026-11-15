# CIN Schema Validation Engine Specification v1

Status: Implemented baseline contract.

## Purpose
Validate JSON values against explicitly supplied versioned JSON Schema contracts before persistence or workflow transitions.

## Contract
- Draft 2020-12 is supported.
- Schema compilation is explicit and reusable.
- Validation returns all issues with instance path and message.
- Invalid schema is a configuration error; invalid instance is a validation result.
- This engine does not establish signatures, issuer trust, authorization or semantic truth.
- Schema selection is trusted application configuration, never an untrusted document URL.

## Acceptance
Valid fixtures pass; required-field/type violations fail with paths; invalid schema fails compilation; compiled validator reuse is deterministic.
