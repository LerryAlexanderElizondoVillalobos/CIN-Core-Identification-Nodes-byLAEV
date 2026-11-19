# CIN-NET-002 — Personal Document Presentation, Domain Resolution, Node Addressing and Block Explorer

**Document ID:** CIN-NET-002  
**Version:** 1.0  
**Classification:** Foundational Technical Architecture  
**Project:** Core Identification Nodes byLAEV  
**Status:** Proposed architecture — implementation and governance pending  
**Author:** LAEV  
**Depends on:** [CIN-NET-001 v1.2](CIN_NETWORKS_NATIVE_ADDRESSING_AND_DOMAIN_REGISTRY_v1.2.md)

---

## 1. Purpose

This specification extends CIN-NET-001 by defining the relationship between a registered CIN personal document, its associated .cin domain, the controlled presentation of information about local nodes, domain and node addressing forms, and discovery through the CIN Block Explorer.

The central proposal is that a CIN domain is not merely a conventional website name. It is a human-readable reference associated with a registered CIN record and an access point to the presentation that the document owner chooses to expose through the CIN infrastructure.

This is a proposed architecture. It does not claim that the global registry, public .cin resolution, personal-document web presentation, P2P addressing protocol or Block Explorer is implemented or operational.

## 2. Architectural position

The proposal distinguishes five related but separate elements:

1. **CIN personal document:** the registered personal record and the disclosure decisions governing its presentation.
2. **Local node:** the independently operating software instance that manages local resources, services and communication.
3. **CIN domain:** the registered, human-readable reference associated with the CIN record.
4. **CIN registry and resolver:** the services that maintain and resolve recognized associations between records, domains, nodes and services.
5. **CIN Block Explorer:** the interface for discovering registry entries and inspecting their cryptographic verification data.

The person, personal record, Node ID, domain and service endpoint are not interchangeable. A domain does not replace a Node ID, and a Node ID does not require a domain.

## 3. Domain as the presentation and access point of the CIN personal document

### 3.1. Main domain

Illustrative reference: **laev.cin**

The domain is proposed as the main access point associated with the person's registered CIN personal document. It presents the information, resources and services that the person has chosen to make available through the CIN infrastructure.

The presentation may include public information selected by the person, references to associated nodes and services, professional or organizational resources, contact and communication endpoints, registration or login interfaces, requests for information or signatures, and links to authorized applications.

The domain must not automatically expose the complete underlying personal document. Registration and discoverability are separate from disclosure and access authorization.

### 3.2. Controlled presentation

The person configures which information and resources are presented and under what conditions:

- **Public presentation:** information intentionally made available without an individual access grant.
- **Authenticated presentation:** resources available after the requesting party has authenticated.
- **Permission-controlled presentation:** resources requiring an explicit authorization decision.
- **Private or unexposed information:** information not made available through the domain.

A visitor connecting, registering or logging in at a CIN domain does not thereby obtain unrestricted access to the underlying document or local node. The Requests & Permissions Engine and the applicable disclosure policy govern each protected operation.

### 3.3. Domain and local-node relationship

The local node operates and administers its resources. The CIN personal document determines which eligible information about those resources is presented through the associated domain. The domain provides the human-readable access and resolution reference.

This is a presentation relationship, not a claim that all node data is stored on a public website or that the domain itself contains the complete personal document.

## 4. Hierarchical resource presentation

Illustrative reference: **laev.cin/node001**

This path represents the portion of the CIN presentation associated with laev.cin that the personal document chooses to expose about the resource or node referred to as node001.

The path may provide a public description, selected metadata, service links or an authorized interaction interface. It does not inherently reveal the node's complete internal state or grant direct access to its services.

Additional illustrative paths include:

- laev.cin/node001/services
- laev.cin/node001/resources
- laev.cin/node001/ledger

These are proposed path examples. The resource-path grammar, canonicalization, alias rules and access semantics require a normative addressing contract.

A path segment such as node001 may be a human-readable alias. It must resolve through a registry association to the canonical Node ID. It must not be assumed to be globally unique merely because it appears in a domain path.

## 5. Address classes and semantics

CIN should preserve distinct address classes instead of treating every string containing a domain or an at-sign as equivalent.

| Form | Proposed meaning |
|---|---|
| laev.cin | Main presentation associated with a CIN personal document |
| laev.cin/node001 | Hierarchical presentation/resource path for a referenced node |
| node001@laev.cin | Node alias scoped to the laev.cin domain |
| NODE_ID | Direct reference to a canonical node, independent of domain ownership |
| SOURCE_NODE_ID@destination-domain.cin | Directional route expression: source node initiating a request toward a destination domain |
| mircea@trilema.cin | Functional service, operator or administrative endpoint within a domain, according to its service registry |

### 5.1. Functional service addressing

For example, mircea@trilema.cin may identify an administrative function, operator, service, application or automated endpoint registered under trilema.cin. It is not necessarily an email address. Its meaning is determined by the CIN service registry and address type.

### 5.2. Scoped node addressing

node001@laev.cin identifies a node alias within the context of the laev.cin domain. Resolution must return the canonical Node ID and the applicable domain association.

### 5.3. Direct node addressing

A node without a domain remains addressable by its canonical Node ID. Domain ownership is optional and must not be a prerequisite for node existence or network participation.

### 5.4. Directional P2P route notation

The proposed notation SOURCE_NODE_ID@destination-domain.cin expresses a communication initiated by the source node toward a destination domain. The resolver determines the destination node or service endpoint according to the domain's registered associations and the request context.

The notation is a route expression, not an email address and not necessarily a complete wire-level message format. The protocol message envelope should carry typed fields for source node, destination domain, resolved destination node/service, operation, authorization context and protocol version.

### 5.5. Reserved alternative syntax

laev@node001.cin has been discussed as an alternative domain-node expression. Its exact meaning is not yet defined. It must remain reserved and must not be treated as equivalent to node001@laev.cin until a separate grammar and semantic rule are approved.

## 6. Domain resolution and registry association

When a compatible CIN application receives laev.cin, the resolver queries the CIN Domain Registry and retrieves the recognized association.

A resolution record may include the canonical domain and namespace identifier, CIN registration reference, canonical record/version reference, cryptographic commitment, associated canonical Node ID or node references where published, authorized presentation/service endpoint references, registry status and validity period, and registry event or proof reference.

A domain may be associated with a personal CIN record and one or more nodes or services. The registry must distinguish the stable registration association from the current presentation configuration and from endpoint availability.

If a domain resolves to multiple nodes or services, the request context or an explicit service selector must determine the destination. The resolver must not choose an arbitrary node.

## 7. CIN Block Explorer

### 7.1. Purpose

The CIN Block Explorer provides search, discovery and verification of records and associations maintained by the CIN registry and, when integrated, the CIN ledger infrastructure.

It is not limited to conventional blockchain transaction browsing. It is an index and verification interface for CIN registration references, domain associations, node associations, registry events and cryptographic commitments.

### 7.2. Search inputs

The explorer should support:

1. **Domain:** laev.cin
2. **CIN registration number:** the registered number associated with the relevant CIN personal document, when searchable under registry policy.
3. **Cryptographic hash:** the exact commitment or record digest.
4. **Canonical Node ID:** the globally scoped node reference.
5. **Registered node alias:** an alias resolved within its domain context.
6. **Registry event, block or transaction reference:** where the selected ledger implementation exposes such references.

Search type detection may use syntax, but the user must be able to see which reference type was interpreted. Ambiguous input should return a disambiguation result rather than silently selecting an unrelated record.

### 7.3. Example: search by domain

A user enters laev.cin. The proposed search workflow is:

1. Normalize and classify the input as a domain reference.
2. Query the domain index.
3. Retrieve the registered domain association.
4. Retrieve the associated CIN registration reference, subject to its publication policy.
5. Retrieve the record/version commitment and registry event reference.
6. Retrieve the available Merkle inclusion proof or other registry verification evidence.
7. Verify the association against a recognized registry authority or authenticated ledger root.
8. Display the domain, registration association, registry status, proof status and permitted public references.
9. Offer navigation to the domain's authorized presentation separately from the registry result.

Illustrative result fields:

| Field | Illustrative content |
|---|---|
| CIN domain | laev.cin |
| CIN registration reference | 111540707 — example only |
| Record/version hash | Retrieved from the actual registry |
| Registry event | Retrieved from the actual registry |
| Domain status | Active / pending / expired / suspended / revoked |
| Association proof | Available / unavailable / invalid |
| Public presentation | Available / restricted / unavailable |

The example registration number is illustrative. The system must retrieve actual values from the registry and must never fabricate a hash, block reference, registration association or verification result.

### 7.4. Alternative lookup by registration number

A search by the registered CIN number should retrieve the corresponding record and its published domain, node and commitment associations. When the domain association and registration reference are current and valid, searching by either reference should resolve to the same underlying registry record/version as defined by the registry model.

### 7.5. Alternative lookup by hash

A hash search should locate the exact record or version containing that commitment. The explorer should identify the hash algorithm, canonicalization/profile, record type and version context. A matching digest alone is not proof of issuer authority, factual truth or permission to access the underlying content.

### 7.6. Alternative lookup by Node ID

A canonical Node ID search should return registered domain associations and public service references, subject to publication rules. A short alias such as node001 must be searched within an explicit domain context or returned as ambiguous if multiple domains use that alias.

## 8. Cryptographic verification and registry history

The explorer should distinguish record-content integrity, Merkle inclusion relative to a particular root, authentication and trust of the root publisher or ledger, validity of the domain-to-record association, current registry lifecycle status, and authorization to access the personal presentation or protected content.

A valid hash demonstrates consistency with the committed bytes under the specified hashing and canonicalization rules. A Merkle inclusion proof demonstrates inclusion relative to a supplied root. Neither alone establishes the truth of personal assertions or grants access.

Registry changes should be historically traceable. A domain transfer, update, suspension, expiration or revocation should create a new registry event or version according to the registry contract rather than silently rewriting historical evidence.

The explorer should distinguish current status from historical status and indicate when a previously valid association has been superseded or revoked.

## 9. ESMT and the CIN registry

The Enterprise Merkle Tree (ESMT) proposal may be evaluated as a cryptographic engine for batching canonical registry events and producing Merkle roots and inclusion proofs.

Potential registry events include domain registration, domain-to-CIN-record association, domain-to-node association, service/presentation manifest update, renewal, transfer, suspension or revocation, and registry authority or schema-version events.

The ESMT engine constructs commitments and proofs. The registry ledger or authenticated registry log records the accepted sequence of roots and events. Search indexes provide efficient lookup but are not the authority for cryptographic validity.

ESMT must remain a candidate integration until its normative tree construction, canonical event encoding, proof format, test vectors and implementation are completed and validated. The existence of an ESMT proposal does not imply that the CIN registry already anchors roots or operates a production ledger.

## 10. Functional component boundaries

| Component | Responsibility |
|---|---|
| CIN Personal Document / Presentation Engine | Maintains presentation configuration and disclosure choices |
| Local Node Engine | Operates local resources, applications and services |
| CIN Namespace Manager | Defines namespace syntax and reserved labels |
| CIN Domain Registry | Maintains domain registrations and lifecycle associations |
| CIN Address Resolver | Resolves domain, node and service references |
| Node Discovery / Addressing | Resolves canonical Node IDs and scoped aliases |
| Requests & Permissions Engine | Evaluates access and operation authorization |
| Registry Index | Supports searches by domain, number, hash, node and event |
| CIN Block Explorer | Displays results, history and verification evidence |
| Cryptography / Evidence & Proof | Verifies digests, signatures and proofs under defined trust rules |
| Ledger / ESMT integration | Records registry history and provides cryptographic commitments/proofs when implemented |

## 11. Privacy and disclosure boundary

A searchable registry reference must not expose the complete personal document by default.

The registry can publish a minimal association record and cryptographic proof while the personal presentation remains controlled by the person. The explorer must not infer permission to retrieve private data from the fact that a domain, number or hash is searchable.

Where verification requires access to protected content, the system should use an explicitly authorized disclosure or proof mechanism. The exact selective-disclosure, credential and privacy-preserving proof formats remain separate specifications.

## 12. Relationship with CIN-NET-001 and development phases

This document extends, rather than replaces, CIN-NET-001.

- **CIN-NET-001** defines the Networks Engine, local virtual routing, native addressing foundation, P2P message/transport boundaries and Domain Registry & Management.
- **CIN-NET-002** defines the personal-document presentation model, hierarchical node presentation, address-class semantics, registry lookup behavior and Block Explorer requirements.
- Phase 2 Networks, Requests & Permissions, Storage, Evidence & Proof, Cryptography and Consensus provide the foundational capabilities and interfaces.
- Phase 3 Ledger, UTXO and Binary Merkle Tree engines may provide specialized registry history, unique-consumption operations and cryptographic commitments.
- The implementation and maturity status of each capability must be reported separately.

## 13. Decisions reserved for normative specification

1. Canonical CIN registration-number format and its relationship, if any, to other identifiers.
2. Canonical Node ID format and uniqueness scope.
3. Domain-to-personal-document association and ownership/administration rules.
4. Domain-to-node cardinality and multi-node destination selection.
5. Canonical grammar for domain, path, service and P2P route expressions.
6. Formal meaning, if any, of laev@node001.cin.
7. Presentation manifest schema and versioning.
8. Public, authenticated, restricted and private field classification.
9. Resolver response schema, caching and stale-record behavior.
10. Registry search index and consistency model.
11. Hash algorithm, canonical record serialization and version binding.
12. Registry event ordering, root authentication and proof format.
13. ESMT integration contract and ledger anchoring.
14. Domain transfer, expiry, suspension and revocation semantics.
15. Selective disclosure and privacy-preserving verification mechanisms.

## 14. Foundational statement

A CIN domain is a human-readable reference associated with a registered CIN record. It provides an access point to the presentation and resources that the person authorizes through the CIN infrastructure. A hierarchical path can expose a selected view of an associated node. Node IDs remain independently addressable, and domain ownership is not required for node participation. The CIN Block Explorer enables discovery of registered associations and inspection of their cryptographic evidence without turning registry lookup into unrestricted access to personal information.

**Core Identification Nodes byLAEV**  
*Personal Document Presentation · CIN Namespace · Node Addressing · Registry Resolution · Cryptographic Verification*

---

*End of CIN-NET-002, Version 1.0.*
