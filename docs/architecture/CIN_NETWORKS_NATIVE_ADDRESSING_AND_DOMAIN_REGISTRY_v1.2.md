# CIN NETWORKS
## Native Addressing, Local Web Infrastructure, P2P Communication and CIN Domain Registry

**Document ID:** CIN-NET-001  
**Version:** 1.2  
**Classification:** Foundational Technical Architecture  
**Project:** Core Identification Nodes byLAEV  
**Status:** Proposed Architecture — implementation and governance pending  
**Author:** LAEV

---

## 1. Purpose

CIN Networks defines the native addressing, resolution and communication infrastructure of the Core Identification Nodes (CIN) ecosystem.

The Networks Engine enables independently operated CIN nodes to discover and recognize one another, resolve logical network addresses, expose authorized services and exchange information through compatible communication transports.

This specification introduces the proposed `.cin` namespace and the **CIN Domain Registry & Management**, through which eligible CIN nodes may request, register, renew and administer domain names for services operated by or associated with those nodes.

The namespace is intended to support personal, professional, commercial, institutional, governmental and organizational use.

This document defines a proposed architecture. It does not claim that the Networks Engine, P2P network, domain registry or public `.cin` domain infrastructure is already implemented or operational.

## 2. Position in the CIN architecture

The Networks Engine is one of the six independent basic engines planned for Phase 2. It is installed and managed through the CIN Engine Manager (Motor de Motores), established in Phase 1.

The six Phase 2 engines are:

1. Networks.
2. Requests & Permissions.
3. Storage.
4. Evidence & Proof.
5. Cryptography.
6. Consensus.

The Networks Engine must remain an independently installable package. Its implementation must not be absorbed into the foundational CIN personal identification document or into the Motor de Motores.

The Networks Engine coordinates with the other basic engines through defined interfaces. It does not replace their responsibilities:

- **Requests & Permissions** determines which operations, disclosures and service interactions are authorized.
- **Storage** maintains local configuration, domain associations, service records and other persistent data.
- **Evidence & Proof** maintains evidence and proofs associated with relevant network and registry events.
- **Cryptography** supplies cryptographic operations and verification.
- **Consensus** coordinates agreement on shared network state when the selected network configuration requires it.

The Motor de Motores installs, configures, updates, activates and removes the Networks Engine as a separate package.

## 3. CIN network certificates

CIN Network Certificates are network-specific credentials used to support a node's participation in a CIN network.

They are distinct from the foundational certificates and records used to establish the CIN environment and its personal identification document.

Depending on the network profile, network credentials may support:

- Recognition of a participating node.
- Association of network records with a node reference.
- Verification of network communications.
- Authorization checks for network operations.
- Verification of domain registration and service associations.

Possession of a network certificate does not automatically grant admission to every CIN network or permission to perform every operation. The applicable network configuration and Requests & Permissions rules determine participation.

Cryptographic verification and signature operations use the Cryptography Engine. Private keys must not be embedded in public domain records, ordinary registry data or distributable domain credentials. Signing may be provided through an authorized external signer, including a connected device or compatible signing extension.

A valid signature, trusted issuer and authorized operation are separate determinations and must remain distinguishable.

## 4. Native CIN addressing and the .cin namespace

The proposed `.cin` namespace provides human-readable logical addresses for CIN nodes and the services associated with them.

Illustrative examples:

- `laev.cin`
- `trilema.cin`
- `services.laev.cin`
- `api.laev.cin`
- `laev@trilema.cin`

These examples illustrate possible names and service conventions. Final syntax, reserved labels, subdomain rules and allocation policies require a namespace specification and governance decision.

A domain is a logical network name. It must not be permanently bound to one IP address, physical location or transport. The resolver associates the stable name with the registered node and its currently authorized service endpoints.

### 4.1. Node eligibility

Under the proposed CIN namespace model, domain registration is reserved for eligible participating CIN nodes.

A person, business, institution, governmental entity or organization may use a domain for its services, but the registration request must be made and maintained through an eligible CIN node with the required authorization.

Eligibility rules, evidence requirements and registry authority remain governance decisions. Institutional and governmental categories require evidence that the requesting operator is authorized to represent or administer the relevant entity or service.

Registering a domain does not create a CIN node, replace a foundational CIN certificate, prove factual claims about a registrant, or grant additional consensus or governance privileges.

## 5. CIN Domain Registry & Management

The **CIN Domain Registry & Management** is a component of the Networks Engine responsible for the registration lifecycle of `.cin` names.

Its functional scope includes:

- Checking domain availability and reserved names.
- Receiving and evaluating registration requests.
- Verifying node eligibility and applicable authorization.
- Classifying domains by intended use.
- Applying registration terms and fees.
- Associating domains with eligible nodes.
- Issuing verifiable domain credentials or registry proofs.
- Managing renewal, expiration, transfer, suspension, revocation and release.
- Publishing registry records to authorized CIN network services.
- Maintaining traceable changes to domain-to-node and domain-to-service associations.

### 5.1. Domain categories

The registry should support at least these categories:

| Category | Intended use | Illustrative name |
|---|---|---|
| Personal | Personal pages, portfolios, communication and individual services | `laev.cin` |
| Professional and commercial | Businesses, brands, products and commercial services | `trilema.cin` |
| Institutional | Foundations, educational entities, associations and institutions | `institution.cin` |
| Governmental | Public institutions and authorized government services | `agency.cin` |
| Organizational and community | Companies, groups, communities and civil organizations | `community.cin` |

The registry may introduce additional categories through governance. A category describes intended use; it does not itself establish legal status or public authority.

### 5.2. Registration and acquisition model

The proposed economic model is a paid registration or renewable right of use, not absolute and irrevocable ownership of a namespace label.

The registry governance must define prices, registration periods, renewal terms, reserved and premium names, transfer rules, dispute handling, expiration and recovery. This specification does not set prices or promise availability of any particular name.

A registration request follows this logical sequence:

1. An eligible node submits a requested name, category and intended use.
2. The registry verifies node participation credentials and operation authorization.
3. The registry checks availability and applicable reserved-name rules.
4. Category-specific evidence is evaluated where required.
5. Applicable terms and fees are presented and fulfilled.
6. The registry approves or rejects the request.
7. A domain credential or verifiable registry record associates the name with the node.
8. The registry publishes the relevant record to the resolution services.
9. The node configures the services and endpoints associated with the domain.

Payment alone must not grant network admission, consensus weight or authority over other nodes.

### 5.3. Domain credential and lifecycle

A domain credential or registry record should contain or reference:

- Canonical domain name and namespace identifier.
- Associated CIN node reference.
- Domain category.
- Registration status and validity period.
- Registry authority and record version.
- Permitted service associations, where applicable.
- Cryptographic verification information and evidence references.

It must not contain private keys.

The registry should define lifecycle states such as **Available, Reserved, Pending, Active, Suspended, Expired, Revoked** and **Released**. The exact state machine, renewal window, recovery process and dispute procedure require a dedicated registry contract.

A service becoming unavailable must not automatically erase or revoke the domain registration. Domain registration status and service availability are separate states.

## 6. CIN Address Resolver and service records

The CIN Address Resolver translates a logical `.cin` name into the relevant node and service information for the requesting environment.

A resolution result may include:

- Canonical domain.
- CIN node reference.
- Service identifier and type.
- Local or external endpoint.
- Supported transport.
- Registry credential or proof reference.
- Service availability information, where supported.

One domain may be associated with multiple authorized services. For example, `laev.cin` may identify a primary website while `api.laev.cin` identifies an application interface. The exact subdomain and service-record syntax must be specified separately.

The resolver must separate logical addressing from physical endpoint location. When a node changes network connection or endpoint, its authorized endpoint records can be updated without changing the logical domain.

## 7. Local Web and folder-based runtime

A CIN installation uses its local runtime as the backend for its installed engines, configurations, files and services. The browser is the shared interface for viewing and interacting with those services.

The Networks Engine must expose its management functions through this common local browser interface. It must not require a separate dedicated viewer for every engine.

### 7.1. Local virtual route

A local CIN runtime may expose a service through an address such as:

`http://127.0.0.1:1221/`

The port `1221` is illustrative and configurable, not a mandatory or reserved CIN port.

A local domain may be accessed through a virtual route such as:

`http://127.0.0.1:1221/laev.cin`

In this example:

- `127.0.0.1` is the loopback address of the device making the request.
- `1221` is the configured local runtime port.
- `/laev.cin` is a path interpreted by the local CIN server.
- The runtime looks up the local domain association and routes the request to the corresponding local service.

This makes local use of the `.cin` naming model possible without public DNS delegation.

The example is path-based virtual routing. It does not mean that a browser has resolved `.cin` through public DNS. A later implementation may also support local host-based resolution if appropriate.

### 7.2. Access from other devices

The loopback address `127.0.0.1` always refers to the device making the request. It cannot be used by a second device to reach the first device.

For access from another device on a local network, the destination node must be reached through an appropriate LAN address or configured local endpoint. For remote access, the Networks Engine must use an available external endpoint or supported P2P path.

The logical `.cin` name remains independent of the chosen endpoint and transport.

## 8. Public and external .cin resolution

The intended public-facing form is:

`https://laev.cin`

This form requires a resolution mechanism available to the external client, a reachable service endpoint and a TLS trust configuration accepted by the browser.

A private CIN registry can operate an internal namespace, but it cannot by itself create a publicly recognized DNS top-level domain.

For ordinary Internet clients to resolve `.cin` through the conventional DNS hierarchy, the string must be eligible and formally delegated through the applicable global DNS process. Until that occurs, external access may be provided only to clients configured to use a compatible CIN resolver or another explicitly supported resolution mechanism. Such configuration does not make the name universally resolvable by all standard DNS clients.

Public HTTPS additionally requires an appropriate certificate and a trust model compatible with the resolution environment. Private-resolver deployments must define how clients obtain and validate that trust.

The project must verify the current status and applicable process with ICANN and IANA before announcing public availability or selling publicly resolvable `.cin` names. This specification does not assert that `.cin` is currently delegated, approved or available as a public top-level domain.

Local addressing and a private CIN namespace can be implemented and tested independently of public delegation.

## 9. CIN application protocol and P2P transport

The CIN application protocol defines the logical structure and meaning of messages exchanged by participating nodes. The underlying transport provides the means to deliver those messages.

A CIN message may carry:

- Sender node reference.
- Destination node or domain.
- Service identifier.
- Message type.
- Request or operation reference.
- Required authorization information.
- Evidence or proof references.
- Protocol version.
- Cryptographic verification information.

The Requests & Permissions Engine determines whether a request or disclosure is authorized. The Networks Engine resolves the destination and transports the authorized CIN message. The receiving node evaluates the message under its own protocol and permission rules.

Messages that do not conform to the CIN application protocol must not be processed as valid CIN messages. This is an application-protocol requirement; it does not mean that underlying TCP, WebRTC or other transport packets must themselves carry a `.cin` suffix.

Possible transport technologies include TCP-based communication, WebRTC, libp2p or other compatible P2P mechanisms. Final selection is an implementation decision. The logical CIN address must remain stable when the transport or IP endpoint changes.

A domain may identify a local web service, an externally reachable service or a P2P service, provided the registry and node configuration authorize the association.

## 10. Coordination with the six basic engines

A typical authorized interaction follows this responsibility model:

1. The node or user initiates a service request.
2. Requests & Permissions evaluates the operation and required disclosure.
3. Networks resolves the destination domain and service.
4. Storage supplies the required local configuration and records.
5. Cryptography verifies relevant credentials, signatures and proofs.
6. Consensus participates when agreement on shared network state is required by the selected network configuration.
7. Networks establishes the configured communication path.
8. Evidence & Proof records or supplies the applicable evidence.
9. The destination node evaluates and processes the request under its own permissions.

The exact execution order depends on the operation. Engine boundaries and authority must remain separate: Networks does not independently authorize disclosure, Storage does not decide trust, Cryptography does not establish factual truth, and Consensus does not replace operation-level permissions.

## 11. Relationship with Phase 3 engines

The registry can begin with the Storage, Evidence & Proof, Cryptography and Consensus capabilities defined for Phase 2.

When the specialized Phase 3 engines are implemented, the registry may integrate:

- **Ledger Engine:** traceable domain registration, renewal, transfer and lifecycle records.
- **UTXO Engine:** one-time registration or renewal authorizations where unique consumption is appropriate.
- **Binary Merkle Tree Engine:** cryptographic commitments and inclusion proofs for registry records.

These integrations are future capabilities, not prerequisites for implementing local domain resolution and the initial registry contract. A Merkle proof demonstrates inclusion relative to a trusted root; it does not independently prove issuer authority, signature validity or operation authorization.

## 12. Namespace governance and economic administration

The `.cin` namespace requires a governance model defining:

- Registry operator and authority.
- Node eligibility and admission conditions.
- Domain categories and reserved names.
- Registration and renewal fees.
- Registration periods and expiration.
- Transfers, suspension, revocation and recovery.
- Institutional and governmental verification.
- Dispute resolution.
- Publication and auditability of registry records.
- Continuity if registry operators or governance arrangements change.

The registry may become an economic service of the CIN ecosystem through registration and renewal fees. Commercial participation must remain separate from network authority: acquiring a domain does not automatically grant additional consensus weight, control of the namespace or access to protected data.

Registry continuity and verifiable records must be considered so domain associations can be audited and managed when a node becomes unavailable or a registration is transferred under the applicable rules.

## 13. Implementation roadmap

### Stage 1 — Local addressing foundation
- Define Networks Engine package boundary and interfaces.
- Implement local network configuration and local CIN Address Resolver.
- Implement local virtual routes and domain-to-service associations.
- Expose the interface through the shared CIN local browser runtime.
- Demonstrate local access using a route such as `http://127.0.0.1:1221/laev.cin`.

### Stage 2 — Node communication
- Define CIN Network Certificate profile and verification interfaces.
- Define CIN application message envelope and protocol versioning.
- Implement node addressing, discovery and P2P transport.
- Integrate Requests & Permissions and the other basic engines.
- Test communication between independently installed local CIN nodes.

### Stage 3 — Domain Registry
- Specify registry data model, states and service contract.
- Implement node eligibility and authorization checks.
- Implement availability, registration, domain credentials and lifecycle.
- Implement categories, local registry records and service associations.
- Define fee, renewal and governance interfaces without inventing unapproved commercial terms.

### Stage 4 — Distributed registry verification
- Integrate Ledger, UTXO and Binary Merkle Tree engines where their capabilities are required.
- Add verifiable lifecycle records and proof generation.
- Test independent verification by participating nodes.

### Stage 5 — External and public access
- Implement external resolution and reachable service endpoints.
- Define TLS issuance, renewal and trust.
- Establish compatible resolver integrations.
- Determine the formal global namespace and DNS delegation path.
- Enable conventional public access only when the required external arrangements are in place.

## 14. Architectural principles

1. **Node-based registration:** domain registration is reserved for eligible CIN nodes under the proposed registry rules.
2. **One logical namespace:** local and external access use the same logical addressing model.
3. **Independent engines:** Networks remains independently installable and manageable through the Motor de Motores.
4. **Local-first functionality:** local resolution does not depend on public DNS delegation.
5. **Stable logical addresses:** domain names are independent of temporary IP addresses and physical location.
6. **Protocol consistency:** CIN messages follow the CIN application protocol independently of transport.
7. **Permission-based operation:** domain registration does not bypass Requests & Permissions.
8. **Verifiable registration:** domain assignments and lifecycle changes have verifiable records.
9. **Private-key separation:** private keys are not distributed in domain credentials or public registry records.
10. **Governance separation:** payment or domain registration does not grant consensus privileges or control over other nodes.
11. **Honest public-deployment boundary:** an internal namespace and a publicly delegated DNS top-level domain are different deployment conditions.

## 15. Decisions pending

The following require separate technical or governance decisions:

1. Definitive `.cin` syntax, normalization and reserved-label rules.
2. Network certificate profile and issuing authority.
3. Registry operator, governance and eligibility criteria.
4. Domain registration categories, terms, prices and renewal periods.
5. Transfer, recovery, dispute and revocation procedures.
6. Domain credential format and registry record schema.
7. Resolver record format and caching behavior.
8. P2P transport selection and node discovery mechanism.
9. Local data and service endpoint configuration.
10. External resolution before public DNS delegation.
11. Public DNS delegation strategy and TLS trust model.
12. Integration points with Ledger, UTXO and Binary Merkle Tree engines.

An unresolved decision remains open until its rationale, owner and acceptance evidence are recorded. This specification does not silently approve a registry authority, certificate format, price schedule, transport or public delegation.

## 16. Final architectural definition

CIN Networks provides the native addressing, resolution and communication infrastructure of the Core Identification Nodes ecosystem.

Its proposed `.cin` namespace allows eligible CIN nodes to register logical names for personal, professional, commercial, institutional, governmental and organizational services. The CIN Domain Registry & Management associates each registered name with an eligible node and its authorized services.

The same logical domain may be used locally and, when the required external resolution and trust infrastructure exists, publicly.

**Local example:**

`http://127.0.0.1:1221/laev.cin`

**Intended public example:**

`https://laev.cin`

The local example can be implemented through the CIN local runtime and virtual routing without public DNS delegation. The public example requires an externally available resolution mechanism, a reachable endpoint and compatible HTTPS trust.

The `.cin` namespace is therefore proposed as a native network-addressing resource through which CIN nodes can publish, identify, resolve and provide services within the wider Core Identification Nodes architecture.

---

## References and external deployment context

Public DNS deployment must be assessed against the current ICANN new-gTLD process and IANA Root Zone records. The project must consult the current official records before making claims about the public status or availability of `.cin`.

- ICANN New gTLD Program: https://newgtldprogram.icann.org/
- IANA Root Zone Database: https://www.iana.org/domains/root/db

**End of Document — CIN-NET-001, Version 1.2**
