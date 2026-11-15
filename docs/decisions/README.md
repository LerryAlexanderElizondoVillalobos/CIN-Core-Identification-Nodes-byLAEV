# CIN Architecture Decision Records

This directory contains architectural decisions and their status.

An ADR may be Proposed, Accepted, Superseded or Rejected. A proposed decision is not an approved architecture requirement. Record context, alternatives, consequences, acceptance evidence and reconsideration conditions.

## Decision register

| ADR | Subject | Status |
|---|---|---|
| [ADR-0001](0001-genesis-manifest-and-node-birth-separation.md) | Separation of Genesis Manifest and Node Birth Record | Proposed |
| [ADR-0002](0002-portable-runtime-and-zip-packaging-model.md) | Portable ZIP runtime and packaging model | Proposed — portable-folder requirement established; runtime feasibility pending |
| [ADR-0003](0003-document-serialization-and-signature-profile.md) | Common document serialization and signature profile | Proposed — interoperability evidence pending |
| ADR-0004 | Application runtime and technology selection | Reserved — Issue #4; decision must follow repository inventory and feasibility evidence |

## Numbering and decision lifecycle

- Never reuse an ADR number, including when a proposal is rejected or superseded.
- ADR-0001 and ADR-0002 are existing records; future document/signature and runtime decisions use ADR-0003 and ADR-0004 respectively.
- Do not create a second ADR-0001 for the application stack or renumber the existing portable-runtime decision.
- A reserved ADR is not an accepted decision. Create and accept it only after the corresponding Issue provides the required evidence.
