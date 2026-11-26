# CIN Main — Architecture V1

**Project:** CIN — Core Identification Nodes byLAEV  
**Status:** Proposed architecture baseline for the new Main  
**Phase:** Linux User Installer → Main Lobby → CIN Package Engine  
**Authority:** This document defines the new direction for `MAIN/`. Historical material in `HISTORY/` is reference material, not active implementation.

## 1. Product direction

CIN Main is built in three consecutive layers:

1. **Linux User Installer:** installs CIN for the current Linux user and establishes the local application environment.
2. **CIN Main Lobby:** runs the founding certificate and manifest processes, establishes the technical node records and completes the initial CIN Global Personal Document association process.
3. **CIN Package Engine:** the engine of engines; installs, registers, configures, updates, enables, disables and removes specialized CIN packages and engines.

The first two layers establish a usable CIN node environment. The third layer expands what that node can operate.

## 2. Linux User Installer

### 2.1 Installation scope

The installer is a per-user Linux application installer. It must not require root privileges for normal installation, launch, update or removal. It must not install system-wide daemons, modify system package databases, or require `sudo` as part of its normal path.

Default XDG locations (respect the corresponding environment variables when set):

| Purpose | Default location |
|---|---|
| Versioned application releases | `~/.local/opt/cin/releases/<version>/` |
| Active application | `~/.local/opt/cin/current` |
| User command launcher | `~/.local/bin/cin` |
| Desktop entry | `~/.local/share/applications/cin.desktop` |
| Persistent node data | `~/.local/share/cin/` |
| User configuration | `~/.config/cin/` |
| Cache and temporary working data | `~/.cache/cin/` |

Application binaries, configuration, cache and node records must remain separate. Updating the application must not overwrite or reset the user's node records.

### 2.2 Installation sequence

1. Obtain the CIN release ZIP, Package Manifest and detached signature.
2. Verify archive size and SHA-256 digest against the manifest.
3. Validate the manifest and detached Ed25519 signature using the configured publisher trust source.
4. Extract the verified package into a versioned release directory.
5. Check the declared runtime prerequisites and prepare the user-level directory structure.
6. Install or update the user launcher and desktop entry.
7. Start CIN Main Lobby.
8. Preserve the release verification result and installation metadata for later inspection.

Package verification, extraction, application installation and node birth are separate events. A successfully installed application is not a born node.

### 2.3 Existing package-signing profile

The archived Package Manifest v1 is the starting specification unless a successor is approved. It defines UTF-8 JSON, RFC 8785 JCS canonicalization, SHA-256 for the ZIP, Ed25519 detached signatures and independently provisioned publisher trust. The public key included inside an untrusted package cannot authenticate that same package.

The existing manifest describes a ZIP distribution. A different archive format requires a versioned package-manifest specification change; it must not be silently substituted.

## 3. CIN Main Lobby

The Lobby is the primary local user interface and lifecycle coordinator. It presents actual persisted state and invokes the dedicated certificate processes. It is not itself the authority that creates or verifies records.

### 3.1 Lobby installation and first launch

The Lobby is installed as part of CIN Main by the Linux User Installer. On first launch it initializes the minimum technical storage structure, loads the installation verification receipt, detects whether a Genesis Manifest or Node Birth Record already exists, and reconstructs the current state. It must not fabricate a completed lifecycle state from missing records.

The Lobby remains accessible in pre-birth state. Functions requiring a born node remain gated by the relevant lifecycle record and authorization result.

### 3.2 Three founding certificate processes

The initial Lobby workflow contains three sequential processes. Each process has a dedicated certificate module, input contract, output document, validation result and persisted status.

#### Process 1 — Genesis Environment Certificate

- Performs the environment audit within the collection scope and permissions disclosed to the operator.
- Distinguishes observed, declared, derived, external, unavailable and not-collected information.
- Produces the Genesis Environment Manifest.
- Validates the manifest against its versioned schema and calculates its integrity values.
- Registers the valid Genesis Manifest as the first logical CIN record in private local storage.

The Genesis Manifest describes pre-birth conditions. It is not the Node Birth Record and does not establish a born node.

#### Process 2 — CIN Node Birth Certificate

- Imports the complete registered Genesis Manifest; it does not repeat the environment audit.
- Preserves the exact source and calculates raw and canonical integrity values.
- Validates the complete document and applies the approved, versioned identifier derivation profile.
- Derives the applicable technical node identifiers, including CIN-NID, CIN-NSID, CIN-BID and CIN-REF; CIN-ENID and CIN-PVID are conditional where their prerequisites apply.
- Obtains the separate Node Birth Authorization.
- Creates the distinct Node Birth Record, referencing the Genesis Manifest.
- Commits, reads back and independently verifies the record before the Lobby presents the node as BORN.

A derived candidate identifier is not an authoritative birth record. A digest is not a signature, issuer trust or authorization.

#### Process 3 — CIN Global Personal Document and Node Marriage Certificate

- Consumes the authoritative Node Birth Record.
- Derives the CIN Global Personal Document identifier under the approved deterministic profile.
- Requests the holder's explicit cryptographic acceptance of the node-to-document association through the configured wallet/signing interface.
- Verifies the signature and recovered signer against the stated subject address.
- Produces the CIN Global Personal Document record and the separate node-personal-document marriage agreement.
- Persists the outputs and their verification status.

The archived development candidate uses a MetaMask-compatible EVM wallet, EIP-712 typed-data signing and signer recovery. The signed association demonstrates control of the signing address and acceptance of the agreement; it does not by itself establish civil attributes, legal recognition, issuer trust or worldwide uniqueness.

No private signing key is stored in CIN Main or in its portable release. Signing is performed through an external wallet, hardware device or separately installed signer connector.

### 3.3 Later personal registration

The archived architecture defines a fourth certificate, CIN Personal Registration and Credential. It consumes an authoritative Node Birth Record, an explicit person-to-node association and a separately verified Personal Issuance Authorization. It coordinates the CIN Personal Number, personal-registration record and personal credential issuance/verification.

This is a subsequent personal-issuance stage, not one of the three founding processes above. A locally allocated number must be labelled with its actual allocation status and must not be described as globally unique or reserved without a verified coordinating-registry response.

### 3.4 Lobby header

The header is a rebuildable read model assembled from persisted authoritative records. It may display:

- Node lifecycle status.
- Genesis Manifest identifier and registration status.
- CIN-NID, CIN-NSID, CIN-BID and CIN-REF.
- CIN-ENID and CIN-PVID when applicable.
- CIN Global Personal Document identifier and node-document association status.
- Later CIN Personal Number and credential status, only when issued and approved for display.
- Latest record references and verification states.

Candidate, preview, registered, authorized, signed, issued and verified are distinct states. The header must display the actual state of each artifact.

## 4. CIN Package Engine — the engine of engines

The Package Engine is introduced only after the three founding Lobby processes have produced the required node records and the CIN Global Personal Document association has been completed to its defined acceptance state.

Its purpose is to manage specialized packages and their engines as installable, versioned, discoverable and independently manageable components.

### 4.1 Core subsystems

| Subsystem | Responsibility |
|---|---|
| Package Registry | Catalogues available packages, versions, sources and installation status |
| Package Manifest Verifier | Validates package metadata, integrity, publisher signature and trust |
| Package Resolver | Resolves dependencies and compatible versions |
| Package Installer | Stages, installs and registers package contents |
| Engine Registry | Records installed engines, versions, capabilities and lifecycle state |
| Engine Loader | Loads an engine through its declared integration contract |
| Configuration Manager | Creates and manages engine-specific configuration |
| Request and Permission Engine | Processes operation requests, scopes, approval requirements and authorization outcomes |
| Signing Connector Manager | Connects external signers; CIN does not store their private keys |
| Update Manager | Plans, stages and applies package updates while preserving node data |
| Removal Manager | Disables and removes package-owned files and registrations without deleting unrelated node records |
| Package Lifecycle Ledger | Records installation, configuration, activation, update and removal events |

### 4.2 Package lifecycle

`DISCOVERED → VERIFIED → RESOLVED → STAGED → INSTALLED → CONFIGURED → ENABLED`

Additional transitions include `DISABLED`, `UPDATE_PENDING`, `UPDATED` and `REMOVED`. Each transition records its input package version, manifest reference, result and affected engine.

A package being present in a registry does not mean it is installed. An installed engine is not necessarily configured, trusted, enabled or operational.

### 4.3 Initial engine families

The engine architecture must support independently installable modules, including:

- Certificate and credential engines.
- Dedicated Ledger engines.
- Binary Merkle Tree and Enterprise Merkle Tree engines.
- Request and permission engines.
- External signing connectors.
- Configurable one-time resource/UTXO-style engines for domains beyond Bitcoin.
- Storage, indexing, evidence and verification engines.
- Application-specific engines and their dedicated Lobbies.

These are package-engine capabilities and future package families; they are not all part of the Linux bootstrapper or the three founding Lobby processes.

### 4.4 Engine contract

Every installable engine must declare at minimum:

- Stable package and engine identifiers.
- Package and engine versions.
- Manifest schema/version.
- Supported CIN Main interface version.
- Dependencies and compatibility constraints.
- Required capabilities and requested permissions.
- Entry point and lifecycle operations.
- Configuration schema and persistent-data boundaries.
- Publisher and signature references.
- Installation, activation and removal behavior.

The engine contract is a proposed interface and must be versioned before executable third-party engines are loaded.

## 5. Repository structure

The target structure under `MAIN/` is:

```text
MAIN/
├── README.md
├── ARCHITECTURE/
│   ├── MAIN_ARCHITECTURE_V1.md
│   ├── MAIN_COMPONENT_MAP.md
│   ├── MAIN_STATE_MODEL.md
│   └── ENGINE_PACKAGE_CONTRACT_V1.md
├── installer/
│   └── linux/
│       ├── README.md
│       ├── bootstrap/
│       ├── package-verification/
│       ├── extraction/
│       ├── user-integration/
│       └── release/
├── app/
│   ├── launcher/
│   ├── runtime/
│   └── lifecycle/
├── lobby/
│   ├── README.md
│   ├── shell/
│   ├── dashboard/
│   ├── state-assembly/
│   └── certificates/
│       ├── genesis-environment/
│       ├── node-birth/
│       └── global-personal-document/
├── core/
│   ├── documents/
│   ├── identifiers/
│   ├── storage/
│   ├── integrity/
│   ├── trust/
│   ├── authorization/
│   └── signer-interfaces/
├── package-engine/
│   ├── README.md
│   ├── registry/
│   ├── manifest/
│   ├── resolver/
│   ├── installer/
│   ├── engine-registry/
│   ├── loader/
│   ├── configuration/
│   ├── lifecycle/
│   └── permissions/
├── packages/
│   └── catalog/
├── shared/
│   ├── schemas/
│   ├── contracts/
│   └── formats/
└── docs/
    ├── decisions/
    ├── specifications/
    └── operations/
```

This is the target logical layout. Directories become active implementation only when their contracts and code are introduced.

## 6. State and data boundaries

- Release files and installed application versions are replaceable.
- User configuration is separate from application files.
- Node records and founding documents are persistent and must survive application upgrades.
- Certificate outputs remain separate documents with explicit references.
- The Genesis Manifest and Node Birth Record are never merged or silently rewritten.
- Public repository progress artifacts are not the authoritative private local record store.
- Private keys and secrets are not included in packages, manifests or founding records.
- Lobby status is reconstructed from stored records and verification outcomes after every full restart.

## 7. Delivery sequence

| Phase | Deliverable | Completion condition |
|---|---|---|
| M1 | Linux User Installer | Verified release installed and launched for a normal Linux user without root |
| M2 | Main Lobby foundation | Lobby starts, initializes storage and reconstructs actual lifecycle state |
| M3 | Genesis Environment Certificate | Valid Genesis Manifest is the first logical CIN record |
| M4 | Node Birth Certificate | Authorized Node Birth Record and applicable node identifiers are committed and verified |
| M5 | Global Personal Document and Node Marriage | Deterministic document identifier and verified explicit association are persisted |
| M6 | Package Engine foundation | Registry, manifest verification, resolver, installer and engine contract operate |
| M7 | First specialized engine package | One independent engine can be installed, configured, enabled, updated and removed through the Package Engine |

## 8. Explicit non-goals for the first Main foundation

- No global consensus or network admission claim.
- No assumption of globally unique personal numbers without a coordinating registry.
- No private key generation/storage embedded in the installer or Lobby.
- No installation of every future engine as part of the base application.
- No automatic execution of archived workflows or tests.
- No speculative security layers that obstruct the defined functional flow; security controls are introduced against concrete package, trust, authorization and data risks.

## 9. Relationship with historical documents

This V1 architecture deliberately supersedes the archived baseline's distribution-only-as-portable-folder constraint by selecting a Linux per-user installer. The archived Package Manifest v1 remains the starting release-authentication profile. The archived certificate lifecycle and node-document association specifications remain reference designs and must be reviewed and adopted into active V1 contracts before implementation.

This document is a new architecture decision proposal. It is not evidence that the installer, Lobby, certificate engines or Package Engine have already been implemented.
