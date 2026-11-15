# CIN Genesis Preparation Architecture

**Project:** CIN — Core Identification Nodes  
**Component:** Environment Audit and Genesis Preparation  
**Status:** Architecture established; v1 specification and initial implementation under review

## 1. Purpose and lifecycle position

Genesis Preparation is the pre-birth stage of a CIN node. It examines the environment in which the portable CIN directory has been extracted, collects relevant and permitted information, prepares a structured initial-state description, and generates the Genesis Manifest.

It is not limited to the CIN folder. It may describe the broader technical environment accessible to the tool, subject to operating-system permissions, declared purpose, and privacy boundaries. It runs after package verification and extraction, before formal node birth. It does not itself create the Node Birth Record, register a person, issue a personal identifier or certificate, or admit a node to consensus.

## 2. Component responsibilities

### Environment Auditor
Discovers relevant information such as:
- operating system, version, architecture, locale, and time configuration;
- processor, memory, storage, and device capabilities;
- filesystem type, permissions, available capacity, and selected installation paths;
- network interface metadata and connectivity capability, not unrelated traffic content;
- installed runtimes, dependencies, and cryptographic providers;
- connected devices and discoverable external signing interfaces;
- CIN package version, directory structure, files, and component inventory;
- relevant certificate or trust-store metadata the operator is authorized to expose;
- storage locations and capabilities relevant to private local storage;
- operator-declared node label, purpose, and configuration choices.

This is a discovery taxonomy, not permission to collect everything. Each field requires a documented purpose, source, method, sensitivity classification, and collection status.

### Genesis Manifest Builder
Transforms audit results and operator declarations into a versioned, schema-valid document. It preserves provenance and distinguishes observed, declared, derived, external, unavailable, not collected, and not applicable values. It must not invent missing values or convert unknown into a negative assertion.

Deterministic serialization and an integrity digest will be defined by the Genesis Manifest Specification. Any signature is a separate operation with explicit key custody and trust rules.

### Private Local Storage Registrar
Initializes the minimum storage structure and commits the Genesis Manifest as the first logical CIN record. The storage contract must define durable registration, atomic commit, failure handling, recovery, access control, and verification of stored bytes.

## 3. Data provenance model

Each field should carry enough metadata to interpret it:

| Attribute | Purpose |
|---|---|
| Field identifier | Stable field name |
| Value | Collected, declared, or derived content |
| Source | OS, filesystem, CIN package, operator, external source, or calculation |
| Method | How it was obtained |
| Observation time | When it was collected |
| Status | Observed, declared, derived, unavailable, not collected, not applicable |
| Sensitivity | Public, internal, confidential, or sensitive |
| Authorization | Whether permission was required and granted |
| Limitation | Known uncertainty or limitation |

The final schema must avoid arbitrary environment dumps and use structured, purpose-limited fields.

## 4. Initial data domains

1. Execution environment: operating system, architecture, runtime, locale, time.
2. Hardware capabilities: relevant processor, memory, storage, and device capabilities.
3. Filesystem and installation context: extraction path, directory structure, permissions, available space.
4. Network capability: interface metadata and connectivity status.
5. CIN package inventory: package version, components, file inventory, dependency status.
6. Cryptographic capability: algorithms, providers, PKI interfaces, external signer availability.
7. Existing trust material: relevant certificate and trust-store metadata with authorization.
8. Storage capability: locations and properties relevant to private storage.
9. Peripheral integration: supported external devices and interfaces.
10. Operator declarations: node label, purpose, organizational context, configuration choices.

Exact fields and platform-specific methods belong in the technical specification.

## 5. Privacy boundaries

Technical accessibility is not unrestricted permission. The audit must not collect passwords, tokens, private keys, recovery phrases, unrelated personal files or their contents, arbitrary browser histories or messages, unrelated network payloads, or biometric and sensitive personal attributes as a default inventory.

Where a value could expose sensitive information, such as a full path containing a personal name, the specification must determine whether it is necessary, whether a redacted representation is sufficient, and whether explicit approval is required. Prefer capability and status metadata over copying underlying content.

## 6. Operator review and guided preparation

Before finalizing the manifest, present collected information and sources, operator declarations, unavailable or uncollected fields, confirmations, warnings, limitations, and the intended private storage destination.

The operator should be able to correct declarations and decline optional collection. Mandatory fields require justification and must not be silently inferred. After successful registration, the Lobby should guide post-birth preparation based on actual component states and dependencies.

## 7. Failure and retry behavior

Distinguish partial audit, permission denied, unsupported capability, invalid collected value, schema failure, serialization or digest failure, storage unavailable, atomic registration failure, and successful registration plus verification.

Failure to register must not be reported as successful genesis preparation. Retrying must not silently overwrite an existing Genesis Manifest. Recovery and attempted re-genesis require explicit rules.

## 8. Logical interfaces

- audit_environment: returns structured audit results with provenance and collection status.
- build_genesis_manifest: consumes audit results and operator declarations; returns a schema-valid candidate and validation report.
- register_genesis_manifest: commits the manifest as the first logical CIN record and returns a verifiable registration result.

These are conceptual operations, not finalized API contracts. Concrete language bindings, schemas, errors, and serialization are pending.

## 9. Component relationships

| Component | Relationship |
|---|---|
| Package Origin Verification | Establishes package origin and byte integrity before extraction |
| Portable Runtime | Provides the extracted execution environment |
| Node Birth Engine | Consumes the registered manifest |
| Private Local Storage | Persists genesis and subsequent records |
| Certificate Engine | May use capability metadata; issuance is separate |
| External Signer Interface | May be discovered; signing requires separate authorization |
| Lobby and Setup Guide | Presents results and guides preparation |
| ESMT | May commit or prove selected records; it does not replace the manifest data model |

## 10. Next work

This is component architecture, not an implementation specification. Next define the exact manifest schema, canonicalization and digest profile, versioning, provenance, storage registration contract, and conformance tests.

---
*End of document.*