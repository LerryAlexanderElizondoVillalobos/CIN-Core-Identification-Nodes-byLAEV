# CIN Architecture Decision Register

**Status:** Proposed decisions; project-owner review required.

This register is the index of architectural decision records. Proposed ADRs document questions and rationale but are not accepted decisions until their status and evidence are explicitly updated.

| ADR | Subject | Status | Scope |
|---|---|---|---|
| [ADR-0001](0001-genesis-manifest-and-node-birth-separation.md) | Separate Genesis Manifest from Node Birth Record | Proposed | Founding record boundary |
| [ADR-0002](0002-portable-runtime-and-zip-packaging-model.md) | Portable ZIP runtime and packaging model | Proposed; portable-folder model is a governing project requirement, runtime technology remains open | ZIP → verify → extract → run locally |
| ADR-0003 | Common document serialization and signature profile | Not yet authored; reserved | Issue #5; serialization and signature interoperability |
| ADR-0004 | Application runtime and technology selection | Not yet authored; reserved | Issue #4; only after inventory and feasibility evidence |

## Numbering and naming policy

- Never reuse an ADR number, even if a proposed ADR is later rejected or superseded.
- The existing Genesis Manifest / Node Birth Record separation remains ADR-0001.
- The portable ZIP runtime decision is ADR-0002.
- Issue #2 originally proposed ADR-0001-APPLICATION-STACK.md; that filename conflicts with the existing ADR-0001 and must not be created.
- Issue #5 originally proposed ADR-0002 for document serialization; that number is occupied by the portable runtime decision. Use ADR-0003 for that future decision.
- The runtime technology decision is reserved as ADR-0004 and must not be made until Issue #4 provides evidence.

## Decision lifecycle

Use Proposed, Accepted, Rejected or Superseded. Record decision owner, date, context, alternatives, rationale, consequences, validation evidence and reconsideration conditions. A proposed record is not an approved implementation choice.

---
*End of register.*
