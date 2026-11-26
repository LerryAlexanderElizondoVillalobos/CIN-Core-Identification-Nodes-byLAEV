# CIN Main — Architecture V1

**Project:** CIN — Core Identification Nodes byLAEV  
**Status:** Proposed architecture baseline for the new Main  
**Phase:** Phase 1 — Main Lobby User-Space Installer → Phase 2 — CIN Package Engine Installer  
**Authority:** This document defines the new direction for `MAIN/`. Historical material in `HISTORY/` is reference material, not active implementation.

## 1. Product direction

CIN Main is delivered in two consecutive installation phases:

1. **Phase 1 — Main Lobby User-Space Installer:** a per-user Linux installer whose first milestone delivers the CIN Main Lobby, including its native runtime and informational Settings screen. The longer Phase 1 scope includes local storage and the three founding certificate processes. These processes execute inside the installed Lobby; they are not separate installation phases.
2. **Phase 2 — CIN Package Engine Installer:** a separate installer for the engine of engines, which installs and manages specialized CIN packages and engines. It follows the establishment of the node's technical identifiers and CIN Global Personal Document association in Phase 1.

## 2. Phase 1 — User-Space Linux Installer for the Main Lobby

### 2.1 Installation scope

The first downloadable milestone is one self-contained Debian archive named `Core_Identification_Nodes.deb` (Debian package `core-identification-nodes`, version `0.3.0`, architecture `all`). It contains the Main Lobby application, Settings, Deploy engine, network controller, and embedded user-space installer and uninstaller. It is extracted with `dpkg-deb --extract`; it is not registered through `apt install` or `dpkg -i`.

The user installer:
- Must run as a normal desktop user and refuse root execution.
- Must not invoke `sudo`, `apt install`, `dpkg -i` or privileged package scripts.
- Must not write to `/usr`, system-wide `/opt`, system application directories or the system package database.
- Must place application files under `~/.local/opt/cin-main-lobby/`.
- Must place the launcher under `~/.local/bin/cin-main`.
- Must place the desktop entry under `~/.local/share/applications/cin-main.desktop`.
- Must keep future persistent CIN node data separate from replaceable application files.

Python 3, PyGObject, GTK 4, OpenSSL, dpkg-deb, a running systemd user manager and systemd/cgroup support for `IPAddressDeny` are runtime prerequisites. The installer checks prerequisites and does not install system dependencies or request elevated privileges.

Default XDG locations (respect corresponding environment variables when implemented):

| Purpose | Default location |
|---|---|
| Application files | `~/.local/opt/cin-main-lobby/` |
| User command launcher | `~/.local/bin/cin-main` |
| Desktop entry | `~/.local/share/applications/cin-main.desktop` |
| Persistent node data | `~/.local/share/cin/` |
| User configuration | `~/.config/cin/` |
| Cache and temporary working data | `~/.cache/cin/` |

Application binaries, configuration, cache and node records must remain separate. Updating the application must not overwrite or reset the user's node records.

### 2.2 Installation sequence

1. Download the single `Core_Identification_Nodes.deb` artifact.
2. Extract the archive with `dpkg-deb --extract` into a temporary directory.
3. Run the embedded `/opt/cin-installer/install-user.sh` as the normal desktop user, passing the original `.deb` path.
4. The installer checks Python 3, PyGObject, GTK 4, OpenSSL and the systemd user manager.
5. The script extracts the application and installs it in the user's local application directory.
6. The script creates the user's launcher and desktop entry; the launcher runs CIN inside its dedicated systemd user scope.
7. Start CIN Main Lobby as the logged-in user.

Release signature verification and a detached publisher trust chain are not implemented by this first build pipeline. They remain a release-engineering requirement before treating public downloads as authenticated production releases.

Package payload extraction, per-user application installation and node birth are separate events. A successfully installed application is not a born node.

### 2.3 Existing package-signing profile

The archived Package Manifest v1 is the starting specification unless a successor is approved. It defines UTF-8 JSON, RFC 8785 JCS canonicalization, SHA-256 for the ZIP, Ed25519 detached signatures and independently provisioned publisher trust. The public key included inside an untrusted package cannot authenticate that same package.

The initial Debian build is a user-space application payload. The Deploy engine's remote component channel uses an independently provisioned Ed25519 public key and a detached signature. The package itself is not publisher-authenticated by this build pipeline; signed production release authentication remains a separate release-engineering requirement.

## 3. Main Lobby included in Phase 1

The Lobby is the primary local user interface and lifecycle coordinator. It presents actual persisted state and invokes the dedicated certificate processes. It is not itself the authority that creates or verifies records.

### 3.1 Lobby installation and first launch

The Lobby is the product installed by the Phase 1 Linux User Installer. On first launch it initializes the minimum technical storage structure, loads the installation verification receipt, detects whether a Genesis Manifest or Node Birth Record already exists, and reconstructs the current state. It must not fabricate a completed lifecycle state from missing records.

The Lobby remains accessible in pre-birth state. Functions requiring a born node remain gated by the relevant lifecycle record and authorization result.

### 3.2 Three founding certificate processes

The initial Lobby workflow contains three sequential processes. Each process has a dedicated certificate module, input contract, output document, validation result and persisted status.

#### Process 1 — Genesis Environment Certificate

- Performs the environment audit within the collection scope and permissions disclosed to the operator.
- Distinguishes observed, declared, derived, external, unavailable and not-collected information.
- Produces the Genesis Environment Manifest.
- Validates the manifest against its versioned schema.
- Records the manifest as the first logical CIN record.

#### Process 2 — CIN Node Birth Certificate

- Imports the complete registered Genesis Manifest.
- Applies the approved identifier derivation profile and conformance vectors.
- Integrates separate Node Birth Authorization.
- Commits and independently verifies the Node Birth Record and applicable technical node identifiers.

#### Process 3 — CIN Global Personal Document and Node Marriage Certificate

- Derives the deterministic document identifier from the approved input profile.
- Requests explicit approval through an external signer.
- Verifies the signed association.
- Persists the personal document record and association agreement as separate artifacts.

The three processes are planned architecture. Their presence in this architecture does not claim that they are implemented in the first installer milestone.

## 4. Phase 2 — CIN Package Engine Installer

Phase 2 is a separate installation product, initiated only after the required node records and the CIN Global Personal Document association have reached their defined acceptance state. It is not included in the Phase 1 Lobby installer.

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

## 7. Two-phase delivery plan

| Phase | Deliverable | Completion condition |
|---|---|---|
| Phase 1A | Main Lobby User-Space Installer | User-space installer runs without root and launches CIN Main |
| Phase 1B | Lobby foundation | Lobby starts, initializes storage and reconstructs actual lifecycle state |
| Phase 1C | Genesis Environment Certificate | Valid Genesis Manifest is the first logical CIN record |
| Phase 1D | Node Birth Certificate | Authorized Node Birth Record and applicable node identifiers are committed and verified |
| Phase 1E | Global Personal Document and Node Marriage | Deterministic document identifier and verified explicit association are persisted |
| Phase 2 | Package Engine Installer | Separate installer deploys the engine-of-engines subsystem |
| Phase 2 validation | First specialized engine package | One independent engine is installed, configured, enabled, updated and removed through the Package Engine |

## 8. Explicit non-goals for the first Main foundation

- No global consensus or network admission claim.
- No assumption of globally unique personal numbers without a coordinating registry.
- No private key generation/storage embedded in the installer or Lobby.
- No installation of every future engine as part of the base application.
- No automatic execution of archived workflows or tests.
- No speculative security layers that obstruct the defined functional flow; security controls are introduced against concrete package, trust, authorization and data risks.

## 9. Relationship with historical documents

This V1 architecture selects a Linux per-user installer. The archived Package Manifest v1 remains the starting release-authentication profile. The archived certificate lifecycle and node-document association specifications remain reference designs and must be reviewed and adopted into active V1 contracts before implementation.

This document is a new architecture decision proposal. It is not evidence that the installer, Lobby, certificate engines or Package Engine have already been implemented.
