# ADR-0001: Separate Genesis Manifest from Node Birth Record

- **Status:** Proposed
- **Date:** 2026-11-15
- **Decision owners:** CIN project authorship and maintainers
- **Related:** [Foundational Principles](../foundations/CIN_FOUNDATIONAL_PRINCIPLES.md), [Node Lifecycle](../architecture/NODE_LIFECYCLE_ARCHITECTURE.md), [Genesis Preparation](../architecture/GENESIS_PREPARATION_ARCHITECTURE.md)

## Context

CIN's portable distribution is downloaded, verified, and extracted before a node is formally born. The operator may enter the Lobby directly or run a preparation and audit process that examines the CIN package and the accessible environment in which it was extracted.

The project uses a lifecycle metaphor: the extracted directory is the node's body; the Genesis Manifest records the circumstances and technical environment preceding birth; the Node Birth Record formalizes the creation of the node as a technical instance.

Combining these records would obscure an important temporal and conceptual distinction: evidence about the environment before birth is not the same event as the formal creation of the node.

## Decision

CIN will model two separate founding records:

1. **Genesis Manifest:** a structured, provenance-aware description of relevant pre-birth conditions. It is intended to be the first logical CIN record committed to the node's private local storage.
2. **Node Birth Record:** a distinct record created by the birth procedure. It references the Genesis Manifest and establishes the node's formal technical birth state.

The Lobby must present the actual lifecycle state. A prepared environment without a verified Node Birth Record is not to be represented as a born node.

## Rationale

- Preserves the historical boundary between pre-birth observation and the birth event.
- Makes the original environment auditable without confusing it with later node configuration.
- Allows later records to reference the founding context without rewriting it.
- Supports a guided preparation process before the node becomes operational.
- Provides a clear point for defining node identifiers, key references, and birth authorization.
- Makes it possible to distinguish the node's own lifecycle from human registration and network admission.

## Consequences

- The Genesis Manifest schema and provenance model must be specified.
- Private local storage must define and test the first-logical-record guarantee.
- The Node Birth Record requires its own schema, identifier profile, and verification rules.
- The system must define recovery, interrupted preparation, duplicate birth attempts, and re-genesis behavior.
- Secrets and private keys must not be included in portable genesis records.
- Neither record by itself establishes human legal status, institutional recognition, or network admission.

## Alternatives considered

### One combined birth document
Rejected because it merges pre-birth environmental observations with the birth event and makes their chronology less explicit.

### Treat extraction as node birth
Rejected because extraction only creates a directory structure. It does not establish the node's founding record, identifiers, or lifecycle state.

### Create the birth record first and append the environment later
Rejected as the primary model because it reverses the intended sequence and loses the role of the pre-birth environment record as the first logical local CIN record.

## Implementation status

This is an architectural decision proposal. It becomes an implemented guarantee only after the schemas, storage contract, state machine, and conformance tests are defined and implemented.
