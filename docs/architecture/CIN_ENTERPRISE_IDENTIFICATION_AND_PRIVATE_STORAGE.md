# Core Identification Nodes — Enterprise Identification, Storage Architecture and Private Folder

**Project:** Core Identification Nodes (CIN) byLAEV  
**Document classification:** Conceptual architecture proposal  
**Version:** 1.0  
**Status:** Proposed architecture for review and repository documentation  
**Language:** English

---

## 1. Purpose

This document describes a proposed extension of the CIN architecture in three related areas:

1. The CIN Worldwide Enterprise Identification Document.
2. The storage categories available to a CIN node.
3. The CIN Private Folder for individuals and organizations.

Its purpose is to record the functions and conceptual relationships proposed for these components and provide an organized basis for subsequent specification and development.

This document describes a proposal. It does not claim that the functions described here have already been implemented, nor that the Enterprise Identification Document has universal legal recognition. Its final scope, requirements, technical structure and relationship with external authorities remain subject to definition.

## 2. Scope and design principles

This proposal is limited to the capabilities already described for CIN in these three areas. It does not define financing, fees, payments, remuneration, digital assets or revenue distribution. It also does not specify protocols, engines or technical mechanisms whose functional behavior has not yet been defined.

The terms **individual**, **organization**, **personal identification document** and **Enterprise Identification Document** distinguish records relating to individuals from records relating to organizations.

The proposal is guided by the following principles:

- **Owner control:** individuals and organizations retain control over their documents and files.
- **Separation of responsibilities:** enterprise documents, personal documents, applications and storage spaces have distinct functions.
- **Privacy:** recording integrity evidence does not require publishing the contents of private files.
- **Verifiability:** a file or folder state can be compared with previously recorded evidence.
- **Modularity:** storage categories are distinguished by function and may serve different applications.
- **Progressive development:** foundational functions should be defined and validated before additional mechanisms are specified.

## 3. CIN Worldwide Enterprise Identification Document

### 3.1. Concept

The **CIN Worldwide Enterprise Identification Document** is the documentary representation of a company or organization within the CIN infrastructure. Its purpose is to provide an organization with its own reference within the network and allow that organization to associate its records, activities, applications and storage spaces with that reference.

The enterprise document is distinct from personal identification documents. The former relates to an organization; the latter relates to an individual who may have an authorized relationship with that organization.

The term “worldwide” expresses the intended international scope of the CIN infrastructure. It does not, by itself, mean that the document replaces commercial registers, licenses, national registrations or documents required by authorities in any jurisdiction.

### 3.2. Function within CIN

The CIN Enterprise Identification Document may serve as a reference to:

- Represent an organization within the CIN environment.
- Associate the organization with its enterprise documents and records.
- Link individuals acting on behalf of the organization when a documented relationship and authorization exist.
- Associate applications and services used by the organization.
- Identify the enterprise environment to which particular files and records belong.
- Relate the organization to evidence and records maintained within CIN.

### 3.3. Relationship with personal identification documents

An organization may maintain documented relationships with individuals who participate in its activities. Depending on the circumstances and on conditions defined later, these relationships may include representatives, employees, administrative officers, professionals, suppliers or other authorized individuals.

A link between an individual and an organization must not automatically be interpreted as general permission to access every enterprise document. Access must correspond to the permission granted by the organization and to the scope of that permission.

Likewise, a relationship with an organization does not transfer ownership of an individual's personal documents to that organization.

### 3.4. Enterprise use

The enterprise document may provide an organizational reference for activity within CIN. The contemplated areas of use include:

- Commercial and service companies.
- Educational institutions.
- Professional organizations.
- Research organizations.
- Public or private institutions, subject to their authority and applicable law.
- Organizations that administer files, records, certificates or other documentary materials.

The final fields of the enterprise document, issuance requirements, verification procedures and relationships with external registers remain to be specified. This document does not assume a data structure that has not yet been approved.

## 4. Enterprise operating model within CIN

### 4.1. Approach

The proposed enterprise model allows each organization to maintain its own reference within CIN and use it to associate its documents, authorized individuals, applications and storage resources.

CIN provides a common infrastructure on which solutions for different sectors may operate. Organizations retain administration of their own documents and decide which relationships and access permissions they authorize.

This approach allows CIN to function as shared infrastructure without requiring every organization to use a single application to administer its activities.

### 4.2. Relationship among organizations, individuals and applications

The structure contemplates three functional participants:

1. **The organization:** has a CIN Enterprise Identification Document and administers its documentary environment.
2. **The individual:** has a CIN personal identification document and retains control over personal documents and authorizations.
3. **The application:** provides specific functions to an organization or individual and operates within the applicable permission scope.

A CIN-compatible application could use documentary references and corresponding authorizations to support registration, consultation or verification processes. The application does not thereby acquire ownership of the documents it uses.

### 4.3. Application integration

The architecture allows developers and integrators to adapt applications to work with CIN. These applications may address sector-specific needs without each having to reproduce the entire documentary infrastructure of the network.

Potential application areas include:

- Customer registration and administration.
- Enterprise file management.
- Institutional document administration.
- Academic records management.
- Consultation of certificates and authorized documentary records.
- Project archive administration.
- Document management for relationships between organizations and individuals.

These examples illustrate possible application areas. They are not an approved product list and do not imply that such applications have already been developed.

### 4.4. Organizational documentary autonomy

An organization retains administration of its enterprise documents and the permissions it grants over them. It may maintain information in its private environment and, where appropriate, authorize specific consultations by applications or individuals associated with the organization.

The CIN infrastructure may maintain references and evidence that support verification of certain documentary states without requiring general access to private content.

## 5. CIN Private Folder

### 5.1. Concept

The **CIN Private Folder** is a storage space under the control of an individual or organization. Its function is to allow private files to be retained and administered within the corresponding node.

The private folder is intended to keep documents under the owner's control. Recording evidence about the folder's state does not require its file contents to be published to the CIN network.

The private folder may be used by a personal node or an enterprise node. In either case, the owner administers the contents and determines the access conditions.

### 5.2. Access and use

Access to the private folder takes place through authentication and authorization mechanisms defined for the node. The design must allow the owner to control the opening, use and closing of the private space.

During a session, files may be added, consulted, organized or modified in accordance with the permissions of the authorized user.

### 5.3. State manifest

At the end of a session, the folder may generate a **state manifest** that cryptographically represents its contents and structure at that time.

The manifest may use file references and hashes to enable a later comparison. Its purpose is to represent a verifiable folder state, not to disclose the contents of the documents.

The recorded manifest serves as a reference for checking whether the local state matches the state documented at the end of the previous session.

### 5.4. Exit certificate

When a session is closed, the system may generate an **exit certificate** associated with the corresponding manifest. This certificate represents the documented state of the folder at the end of the session and includes a temporal reference for the closure.

The certificate makes it possible to establish a sequence of folder states across different usage sessions.

The exit certificate and manifest do not, by themselves, prove who made each change or the exact time an alteration occurred. Their primary function is to preserve a verifiable reference for detecting differences between states.

### 5.5. Verification before a new session

Before allowing a new session, the node may consult the evidence corresponding to the last recorded state and compare that reference with the current local state of the folder.

The comparison may indicate:

- The local state matches the last recorded state.
- One or more files differ.
- Files recorded in the manifest are missing locally.
- Local files are not present in the previous manifest.
- The folder structure has changed.
- The evidence required for verification could not be retrieved or checked.

Detecting a difference makes it possible to warn that the current state does not match the previous reference. It does not automatically attribute the cause to an individual or establish that an intrusion occurred.

### 5.6. Access between personal and enterprise folders

The private folder may be used for personal or enterprise documents. An organization may authorize selected individuals to consult specific files or resources in its private environment. Likewise, an individual may authorize an organization to consult specific information from the individual's space, within the scope granted.

Authorization to consult does not transfer ownership of the documents. Access must remain limited to the content and conditions expressly authorized.

The technical details for granting, changing and revoking permissions remain to be defined.

### 5.7. Backup and storage location

The private folder may keep its primary storage on the owner's node and have backup copies in associated cloud services or in CIN distributed storage categories.

The existence of a backup copy and verification of its integrity are different conditions. Synchronizing a file must not automatically be interpreted as proof that its contents match the recorded state.

Specific backup, recovery, synchronization and availability conditions must be defined for each storage category.

## 6. CIN node storage categories

The architecture contemplates ten functional storage categories. Each serves a different purpose and should retain its own classification within node resource administration.

The classification **public** indicates that storage capacity may be offered to other network participants or services. It does not necessarily mean that every stored file is publicly readable; access to content depends on the applicable conditions.

### 6.1. Private Storage

Local private storage under the control of the individual or organization that owns the node. It is intended to retain documents and files that are not offered as storage capacity to other participants.

The CIN Private Folder uses this category as its reference for local storage.

### 6.2. Public Local Storage

Local storage capacity that a node makes available to authorized CIN services or participants. Its purpose is to allow local resources to be used beyond the owner's private environment, subject to the conditions established for the relevant service.

### 6.3. Private Decentralized Storage

Distributed storage intended to retain private information using resources located on more than one node. Its functional characteristic is that storage is distributed without making the content publicly accessible.

Its design must establish how privacy is maintained, how access is controlled and how distributed files are recovered.

### 6.4. Public Decentralized Storage

Distributed storage capacity that participants may offer to CIN network services. It is intended to provide shared storage resources across nodes.

Offering capacity does not mean that the stored content is necessarily public. Access conditions are determined for each use.

### 6.5. Ledger Storage

Storage intended for CIN record and evidence elements. Depending on the specifications of each component, it may contain hashes, documentary references, records, Merkle roots, inclusion proofs, state certificates and evidence associated with recorded operations.

This category retains verification and record elements. It does not automatically replace original files or mean that every source document must be incorporated into the Ledger.

### 6.6. Lobby Operating System Storage

Storage intended for the components and data of the main CIN Lobby operating system. It includes files and resources needed to preserve its structure, components, configurations and operational information.

Its boundaries should distinguish operating-system data from the private documents of individuals and organizations.

### 6.7. Temporary Storage

Temporary storage used by operations that require intermediate space. It may hold caches, working files, transfers in progress, intermediate results and data needed during preparation or transfer processes.

Its purpose is to meet temporary operational needs, not to replace permanent storage spaces.

### 6.8. Right to Be Forgotten Storage

A functional category intended to address information deletion lifecycle management. Its purpose is not to permanently retain documents that must be deleted, but to account for deletion requests and the management of associated copies or replicas.

Its design must distinguish between content to be deleted and the minimum evidence that may, where appropriate, be retained to document completion of a deletion operation. The scope and retention of such evidence remain to be defined.

### 6.9. Cloud Synchronization Storage

A category intended to manage synchronization between a CIN node and cloud storage services associated by the owner.

Its function is to maintain the relationship between copies and their corresponding synchronization states. Synchronization indicates that a transfer or update operation took place; it is not, by itself, cryptographic certification of integrity.

### 6.10. Specialized Configurable Storage

An extensible category intended to incorporate storage spaces configured for specialized applications or needs.

Potential future uses may include academic records, project files, technical documentation, BIM files, multimedia, scientific information or sector-specific document collections. Each specialization must be defined according to the application that uses it.

## 7. Relationship among storage, the private folder and the enterprise node

Storage categories form part of a CIN node's capacity. The private folder and the enterprise environment use those categories according to the nature of their documents and the applicable access conditions.

In general:

- A personal private folder uses Private Storage for its owner's documents.
- An enterprise private folder uses Private Storage for documents controlled by the organization.
- Backup copies may be associated with Private Decentralized Storage or linked cloud services.
- Verification and record elements may be retained in Ledger Storage.
- Temporary processes may use Temporary Storage.
- Specialized applications may use Specialized Configurable Storage.
- Capacity offered to other services may use Public Local Storage or Public Decentralized Storage.
- Deletion operations must account for Right to Be Forgotten Storage and its relationship with associated copies.

Storage administration should distinguish three aspects: **storage category**, **resource location** and **purpose of use**. This distinction makes it possible to describe where a resource is located, what function it serves and under what conditions it is used without confusing these characteristics.

## 8. Design and development organization

The following order is recommended for turning this proposal into a technical definition.

### 8.1. Define the Enterprise Identification Document

Specify its documentary function, the data it contains, its relationships with external records and the conditions for linking authorized individuals. The final structure must not be treated as established until it has been specified and approved within the project.

### 8.2. Define the storage catalogue

Document the purpose, ownership, possible location, capacity, access conditions and relationships with other categories for each storage type.

### 8.3. Define private folder operation

Specify the lifecycle of creating, opening, using and closing a private folder, together with generation of the manifest and exit certificate.

### 8.4. Define state comparison

Specify how the last recorded state is retrieved, how it is compared with the local state and how differences are presented to the owner.

### 8.5. Define backup and recovery

Establish how the private folder relates to distributed storage and cloud services, and how a copy is checked for recoverability and correspondence with the expected state.

### 8.6. Integrate enterprise functions

Once the preceding elements are defined, relate the Enterprise Identification Document to its private folder, documents, authorized individuals and applications using the CIN infrastructure.

This order prioritizes definition and validation of foundational functions before additional mechanisms are introduced.

## 9. Items expressly pending definition

To avoid presenting undecided elements as approved decisions, the following remain outside the scope of this version:

- The final data structure and issuance requirements of the CIN Worldwide Enterprise Identification Document.
- Legal recognition procedures and relationships with authorities or registers in each jurisdiction.
- Specific technical mechanisms for authentication, signing and permission administration.
- Consensus, synchronization and inter-node communication protocols.
- Detailed technical implementation of distributed storage categories.
- Final criteria for retention, deletion and preservation of evidence.
- Financial, commercial, pricing, remuneration or revenue-distribution models.
- Compatibility and certification requirements for third-party applications.

These subjects may be documented in separate specifications once their scope and functional behavior have been defined.

## 10. Conclusion

The addition of a CIN Worldwide Enterprise Identification Document, together with the storage categories and private folder system, extends the functional scope of CIN from the administration of individual documents to the documentary administration of organizations.

The enterprise document provides an organizational reference within CIN. The storage categories classify resources according to their function. The private folder provides a space under its owner's control and makes it possible to preserve verifiable evidence of recorded states between sessions.

These components share a central principle: individuals and organizations retain control of their documents, while CIN provides infrastructure for relating those documents, preserving references and verifying states without requiring private content to be exposed to the network.

This proposal establishes a conceptual basis for continuing CIN design. Technical specifications, procedures and mechanisms that have not yet been defined must be developed separately, without prematurely assigning them functions that have not been approved.
