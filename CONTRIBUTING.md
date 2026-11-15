# Contributing to CIN

Thank you for your interest in Core Identification Nodes (CIN). This repository is an evolving research, architecture, specification, and software-development project. Contributions should improve clarity, technical precision, reproducibility, or implementation quality while respecting the project's foundational principles.

## Before contributing

1. Read the [project overview](README.md).
2. Review the [foundational principles](docs/foundations/CIN_FOUNDATIONAL_PRINCIPLES.md).
3. Check the [project status and roadmap](docs/project/PROJECT_STATUS_AND_ROADMAP.md).
4. Search existing documentation and discussions before proposing a component or specification.

For substantial architectural changes, open a discussion or issue before submitting a large implementation.

## Contribution types

Contributions may include conceptual clarification and research; architecture diagrams and component boundaries; technical specifications and data schemas; implementation and refactoring; automated tests and reproducible test vectors; interoperability evaluation; documentation and user guides; and review of privacy, security, accessibility, and governance requirements.

## Core contribution principles

- Preserve the distinction between conceptual proposals, specifications, implementations, and validated results.
- Do not describe planned functionality as implemented.
- Keep node registration, human registration, authentication, authorization, consent, and network admission as distinct concepts.
- Document data provenance, privacy implications, and trust assumptions.
- Prefer explicit interfaces and versioned data contracts over undocumented coupling.
- Never commit private keys, passwords, tokens, recovery phrases, or other secrets.
- Do not claim that a cryptographic proof establishes more than the property it actually verifies.
- Clearly mark illustrative examples that are not valid production artifacts.

## Documentation and specifications

A technical specification should identify title, component, specification ID, version, status, scope, terminology, normative language, data structures and constraints, serialization and cryptographic profiles, inputs, outputs, states, failure behavior, trust assumptions, authorization requirements, privacy and retention, compatibility, versioning, conformance tests, references, and unresolved issues.

Use stable relative links. Avoid duplicating normative rules; designate one authoritative specification and reference it elsewhere.

## Code contributions

Code contributions should have a clear scope, follow existing language conventions, include tests for expected behavior and relevant failure cases, expose errors and state transitions clearly, avoid logging secrets or unrelated personal information, and document setup, execution, and limitations.

Avoid dependencies without a stated purpose and maintenance rationale. Implement the defined functional purpose first; add defensive controls in response to identified requirements and risks.

## Contribution rights and project license

CIN currently uses a proprietary, all-rights-reserved project declaration rather than a general open-source license. Before submitting a substantial contribution, discuss the intended terms with the maintainers. A pull request must not be assumed to grant the project rights to relicense, distribute, or commercially use a contribution beyond rights actually granted by its author. The maintainers should establish a written contributor agreement or another clear rights process before accepting substantial third-party code or documentation.

## Pull request expectations

A pull request should include:
1. Problem or requirement addressed.
2. Conceptual and architectural context.
3. Summary of files and behavior changed.
4. Related specification or issue references.
5. Tests performed and results.
6. Compatibility or migration impact.
7. Known limitations and follow-up work.

Keep pull requests focused. A foundational change should not be hidden inside an unrelated refactor.

## Review criteria

Reviewers should assess consistency with foundational principles; specification correctness; component boundaries; provenance and privacy; cryptographic correctness and trust assumptions; reproducibility; interoperability and versioning; and accuracy of maturity claims.

## Responsible disclosure and project maturity

Do not publish credentials, personal data, private signing material, or exploitable details about a live deployment in public issues. An appropriate private reporting channel should be established before production deployments.

CIN is under research and development. A merged contribution does not by itself establish production readiness, legal recognition, institutional endorsement, or independent validation.

---
*Thank you for helping make CIN clearer, more rigorous, and more verifiable.*