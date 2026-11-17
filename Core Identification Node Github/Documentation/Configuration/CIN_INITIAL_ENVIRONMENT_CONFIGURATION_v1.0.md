# CIN Initial Environment Configuration v1.0

**Project:** Core Identification Node (CIN) byLAEV  
**Configuration ID:** `cin.initial-environment`  
**Version:** 1.0.1  
**Status:** Corrected documented baseline — implementation alignment required  
**Scope:** Repository, web publication, future local application environment, storage, authentication and component layout  
**Branch reviewed:** `main`

---

## Revision note — 1.0.1

This patch clarifies a separation that is mandatory throughout CIN documentation and implementation:

- **CIN Web Environment** is the browser-based publication environment. Its current publication target is GitHub Pages and it does not depend on a local HTTP server.
- **CIN Local Environment** is the future installed/portable application environment. The Linux x86_64 runtime prototype belongs exclusively to this profile.
- The local runtime's loopback address, port selection, local filesystem access and runtime data-root behavior are not global CIN settings and are not requirements of the Web Environment.

No runtime code or deployment behavior is changed by this documentation correction.

## 1. Objective and status vocabulary

This document establishes the repository boundary and separates the distinct execution environments in which CIN may operate. It distinguishes:

- **Verified current configuration:** behavior or values present in the repository.
- **Selected baseline:** a configuration value adopted for future integration.
- **Not configured / not implemented:** a provider or component for which no active implementation was found.
- **Pending alignment:** a discrepancy between existing implementation artifacts that must be reconciled within the relevant environment profile.

This document does not claim that the multi-node Lobby architecture, a production backend, or a production local application is already implemented.

## 2. Repository configuration

| Parameter | Initial value | Status |
|---|---|---|
| Repository owner | `LerryAlexanderElizondoVillalobos` | Verified |
| Repository | `CIN-Core-Identification-Nodes-byLAEV` | Verified |
| Branch | `main` | Verified default branch |
| GitHub Pages publication directory | `Core Identification Node Github/` | Verified |
| Repository URL | `https://github.com/LerryAlexanderElizondoVillalobos/CIN-Core-Identification-Nodes-byLAEV` | Verified |
| Published Web Lobby | `https://lerryalexanderelizondo.github.io/CIN-Core-Identification-Nodes-byLAEV/` | Declared in repository |

### 2.1 Repository root versus publication root

`Core Identification Node Github/` is the GitHub Pages publication root for the current static Genesis Lobby. The workflow `.github/workflows/cin-genesis-lobby-pages.yml` publishes this directory.

It is not the root of all application source code. The Rust core library and the Linux local runtime prototype are maintained under `prototype/` at repository root.

The publication directory contains `CIN 001/`, currently established by a README. Its full Node Lobby and node-specific Configuration Engine are not yet implemented.

## 3. Execution environment profiles

The profiles below are distinct deployment/runtime contexts. A capability or setting belonging to one profile must not be silently inherited by another.

### 3.1 CIN Web Environment

| Setting | Current value | Status |
|---|---|---|
| Delivery model | Browser-based static web publication | Verified |
| Hosting | GitHub Pages | Verified |
| Publication URL | `https://lerryalexanderelizondo.github.io/CIN-Core-Identification-Nodes-byLAEV/` | Declared |
| Publication source | `Core Identification Node Github/` | Verified |
| Local HTTP server | Not required | Profile rule |
| Loopback address / local port | Not applicable | Profile rule |
| Direct host filesystem access | Not available to the static page by itself | Verified limitation |
| Backend/API connection | None configured for the published site | Verified |

The Web Environment serves the published Lobby in a browser. It must not assume that a local CIN process is installed, running, reachable at `127.0.0.1`, or available on any particular port.

A future web backend or remote node transport would be a separately declared service and connection configuration. Neither is currently configured by this baseline.

### 3.2 CIN Local Environment

This profile represents the future installed or portable local application environment. The existing Linux x86_64 runtime is a prototype belonging only to this profile.

| Setting | Prototype value | Status |
|---|---|---|
| Prototype path | `prototype/linux-runtime/` | Verified |
| Platform | Linux x86_64 | Verified |
| Runtime model | Local HTTP server with browser interface | Verified prototype |
| Bind address | `127.0.0.1` | Verified prototype |
| Port selection | `1221`, then `2112`, then OS-assigned ephemeral port | Verified prototype |
| Runtime address output | `CIN_URL=http://127.0.0.1:<selected-port>` | Verified prototype |
| Local runtime interface | `prototype/dist/index.html` | Verified |
| Production local application | Not yet established | Not implemented |

The loopback server and port strategy are strictly local-profile implementation details. They are not part of the CIN Web Environment, the Global Lobby's general configuration, or a universal CIN backend address.

The prototype exposes the following local routes:

- `GET /health`
- `GET /api/status`
- `GET /api/lifecycle`
- `POST /api/probe/write`
- `GET /api/probe/read`
- `POST /api/runtime/shutdown`

The selected local address is dynamic. A local client must discover it from the running runtime's `CIN_URL` output rather than treating a particular port as permanent.

**Implementation boundary:** this prototype does not yet implement the complete CIN Node Lobby, Global Lobby communication contract or a production backend.

### 3.3 Profile separation rules

1. GitHub Pages publication must remain usable without a local runtime.
2. The Web Environment must not probe or assume a local loopback server as a default backend.
3. The Local Environment may use loopback networking and local operating-system resources as required by its own runtime design.
4. Local filesystem paths, local ports, runtime process state and local data-root variables belong to the Local Environment profile.
5. Any future communication between Web and Local environments must be explicitly designed, declared and implemented; it is not implied by publishing the Web Lobby.
6. Global Lobby configuration and each node's configuration scope remain separate from environment-profile configuration.

## 4. Storage and data-root configuration

### 4.1 Storage status

The current filesystem persistence work belongs to the local Rust prototype and must not be interpreted as storage configured for GitHub Pages. No production storage provider is currently selected as the active provider for CIN.

1. `prototype/cin-core/src/storage/` contains a filesystem document repository and a `TransactionalStore` prototype. The transactional implementation stores JSON documents, stages writes, calculates SHA-256 over serialized bytes, uses commit markers and supports read/recovery inspection.
2. `prototype/linux-runtime/src/main.rs` contains a separate local runtime persistence probe that writes `runtime-probe.record` and reads it back.

These are prototype capabilities. The runtime probe is not the production CIN record store. The existence of the core storage prototype does not mean Genesis, node-birth or other production records are already persisted through it.

| Setting | Current status |
|---|---|
| Active storage provider | None selected for the production CIN environment | Not configured |
| Local prototype provider | Local filesystem | Prototype only |
| Document format | JSON |
| Core storage implementation | `prototype/cin-core/src/storage/TransactionalStore` |
| Runtime probe | `runtime-probe.record` |
| Production record provider | Not designated |
| Web Environment storage backend | Not configured by this baseline |
| Cloud/remote storage provider | Not configured |

### 4.2 Local data root

The core data-root resolver defines this precedence for the local application data environment:

1. Explicit application configuration.
2. Environment variable `CIN_DATA_DIR`.
3. Operating-system user data directory.

Platform defaults declared by the resolver:

| Platform | Default |
|---|---|
| Windows | `%APPDATA%/CIN` |
| macOS | `~/Library/Application Support/CIN` |
| Linux / Unix | `$XDG_DATA_HOME/CIN`, otherwise `~/.local/share/CIN` |

The local data root is separate from the executable and extracted package directory. This is a Local Environment concern; it does not configure a storage location for the static Web Environment.

**Local prototype integration discrepancy:** the shared core resolver/specification uses `CIN_DATA_DIR`, while the current Linux runtime prototype reads `CIN_DATA_ROOT` and uses lowercase `cin` in its fallback path. The selected canonical variable for the shared core contract is `CIN_DATA_DIR`. The local runtime integration must explicitly reconcile this discrepancy before both components are treated as one integrated local application. This discrepancy has no bearing on GitHub Pages.

## 5. Authentication and authorization

**Status: not configured in either profile.**

The static GitHub Pages Lobby now contains source code for GitHub App operator linking, but the App and token-exchange Worker still require provisioning and deployment. Until that setup is complete, the operator connection is not active. The current Linux local runtime prototype also does not declare an authentication provider.

No CIN issuer/authentication provider for certificate issuance is selected in this baseline. Separately, the source for a GitHub App operator-link flow has been added for the web Lobby, using Authorization Code + PKCE and a server-side token-exchange Worker. The GitHub App is not yet registered/installed and the Worker is not yet deployed, so operator linking is currently prepared but not active. This GitHub connection grants repository-operation context only; it is not Node Birth Authorization or Personal Issuance Authorization.

Authentication and operation authorization remain separate configuration domains. A future authentication provider establishes caller/session context; a separate authorization mechanism determines whether a particular operation is permitted. Neither GitHub Pages hosting nor repository ownership constitutes an authentication provider.

## 6. Connection state

| Connection/context | Initial state | Meaning |
|---|---|---|
| GitHub repository | Available | Repository and `main` branch are accessible |
| CIN Web Environment / Pages | Published static interface | Static Lobby publication target exists |
| Web-to-local-runtime connection | Not configured / not assumed | Pages does not depend on a local process |
| Web backend/API | Not configured | No backend endpoint is connected to the published page |
| CIN Local Environment runtime | Prototype | Local Linux prototype can expose loopback HTTP when launched |
| Local filesystem storage | Prototype | Filesystem persistence components exist in Rust prototype |
| Remote node transport | Not configured | No operational Global Lobby-to-node administration transport found |
| Authentication | Not configured | No active provider found |

Connection status must be observed in the relevant runtime. A repository URL or published static page does not prove that a local runtime or CIN node is online.

## 7. Component structure

### 7.1 Current repository layout relevant to the profiles

```text
CIN-Core-Identification-Nodes-byLAEV/
│
├── .github/
│   └── workflows/
│       └── cin-genesis-lobby-pages.yml
│
├── docs/
│   └── architecture/
│       ├── CIN_ARCHITECTURE_BASELINE_V1.md
│       ├── CIN_COMPONENT_DEPENDENCY_MAP.md
│       ├── CIN_IMPLEMENTATION_DIRECTORY_MAP.md
│       └── CIN_REPOSITORY_TECHNICAL_AUDIT.md
│
├── specifications/
│   ├── CIN_DATA_ROOT_RESOLVER_SPECIFICATION_V1.md
│   └── CIN_LOCAL_DOCUMENT_STORAGE_SPECIFICATION_V1.md
│
├── prototype/
│   ├── cin-core/
│   │   └── src/
│   │       ├── data_root.rs
│   │       ├── documents/
│   │       ├── storage/
│   │       ├── schema.rs
│   │       ├── lifecycle.rs
│   │       └── recovery.rs
│   ├── linux-runtime/
│   │   ├── run-cin.sh
│   │   └── src/
│   │       ├── main.rs
│   │       ├── browser.rs
│   │       └── runtime_lifecycle.rs
│   └── dist/
│       └── index.html
│
└── Core Identification Node Github/
    ├── index.html
    ├── manifest.webmanifest
    ├── service-worker.js
    ├── cin-icon.svg
    ├── CIN Lobby.url
    ├── CIN-GENESIS-ENVIRONMENT.cincert
    ├── CIN-NODE-BIRTH.cincert
    ├── CIN 001/
    │   └── README.md
    └── Documentation/
        └── Configuration/
```

This is a relevant component map, not a complete recursive inventory.

### 7.2 Repository roots

- Repository root: source code, prototypes, specifications, CI and development documentation.
- `Core Identification Node Github/`: current static Genesis Lobby publication and related web-facing assets/documentation.
- `prototype/linux-runtime/`: local Linux runtime prototype only.
- `prototype/cin-core/`: shared Rust domain/core library currently used by prototype work.

### 7.3 Core modules and engines

The current Rust core library is `prototype/cin-core/`. Its observed modules include:

| Module | Location | Observed responsibility |
|---|---|---|
| Data Root Resolver | `src/data_root.rs` | Resolve local user-data directory |
| Documents | `src/documents/` | Common document model and validation |
| Storage | `src/storage/` | Filesystem repository and transactional record prototype |
| Schema | `src/schema.rs` | JSON Schema validation |
| Lifecycle | `src/lifecycle.rs` | Explicit lifecycle transition model |
| Recovery | `src/recovery.rs` | Recovery-related core functionality |

These are existing core modules, not a complete set of production engines. The full Configuration Engine described by the evolutionary configuration specification is not yet implemented.

### 7.4 Lobby interfaces

Two different interface artifacts currently exist:

1. **Published Genesis Lobby:** `Core Identification Node Github/index.html`, served as static GitHub Pages content.
2. **Local runtime web interface:** `prototype/dist/index.html`, served by the Linux local runtime prototype.

They belong to different profiles. Neither currently implements the complete target architecture of a Global Lobby selector plus a separate Node Lobby inside each CIN node.

### 7.5 Services and Guest

There is no separate top-level `services/` directory in the inspected repository. Current responsibilities are implemented as modules in `prototype/cin-core/` and runtime behavior in `prototype/linux-runtime/`.

No implemented `Guest/` directory, Guest service or Guest module was found in the inspected component paths. Guest remains a planned component whose purpose, permissions and relationship to the Global Lobby and node-specific Lobby must be specified before implementation.

### 7.6 Configuration artifacts

Current configuration-related artifacts include:

- `prototype/cin-core/src/data_root.rs`: local data-root resolution.
- `specifications/CIN_DATA_ROOT_RESOLVER_SPECIFICATION_V1.md`: local data-root contract.
- `specifications/CIN_LOCAL_DOCUMENT_STORAGE_SPECIFICATION_V1.md`: local JSON document storage contract.
- `prototype/cin-core/src/schema.rs`: JSON Schema validation.
- `Core Identification Node Github/manifest.webmanifest`: web publication/PWA metadata.
- `CIN Configuration Engine — Evolutionary Configuration Specification v1.0`: multi-scope configuration architecture.

The evolutionary Configuration Engine specification describes target architecture; it does not mean that engine has already been implemented.

## 8. Multi-node configuration scope

The target architecture has one Global Lobby scope and one independent scope per CIN node:

| Scope | Owner | Configuration authority |
|---|---|---|
| Global Lobby | `Core Identification Node Github/Lobby Core/` (target structure) | Global Configuration Engine/context |
| CIN 001 | `Core Identification Node Github/CIN 001/` | CIN 001 local Configuration Engine |
| CIN 002 | `Core Identification Node Github/CIN 002/` | CIN 002 local Configuration Engine |
| CIN N | Its own node directory | Its own local Configuration Engine |

The current repository establishes the CIN 001 directory with a README. The Global Lobby and per-node local Configuration Engine folders remain target architecture elements.

Environment profiles and configuration scopes are separate dimensions: the Web or Local profile describes where a component executes; the Global Lobby or node scope describes which component owns the configuration state. A global repository reference does not imply shared node configuration, and adding CIN 002 must not reuse CIN 001's state or local data root.

## 9. Machine-readable configuration record

The companion file is `cin-initial-environment.v1.json`. It mirrors this document's separation between Web and Local profiles and records repository settings, profile-specific deployment/runtime details, local storage and data-root status, authentication status and component paths.

The JSON is a descriptive baseline. It does not provision a backend, create credentials, start a service or activate an authentication provider.

## 10. Required alignment work

1. Keep the Web Environment independent of the local Linux runtime and any loopback port.
2. Reconcile `CIN_DATA_DIR` and `CIN_DATA_ROOT` within the Local Environment integration; do not propagate either variable as a Web Environment requirement.
3. Connect the local runtime to the shared `cin-core` storage API rather than treating its persistence probe as the record store.
4. Decide and implement authentication only when the operational requirements for the relevant profile are defined.
5. Define any future Web backend/API separately from the local runtime interface.
6. Implement the Global Lobby node selector and node registry.
7. Implement a local Node Lobby and Configuration Engine inside CIN 001.
8. Define Guest as a functional role/component before implementing it.
9. Extend node provisioning to CIN 002 and later nodes without sharing local configuration state.

## 11. Acceptance criteria

This configuration baseline is consistent when:

- repository owner, name, branch and Pages publication root are explicitly recorded;
- Web and Local environments are separate named profiles;
- the Web Environment has no dependency on `127.0.0.1`, local ports or a local server;
- loopback binding, dynamic port selection and local filesystem access are recorded only under the Local Environment;
- local storage and data-root details are not presented as Web hosting configuration;
- existing providers and components are accurately marked as configured, prototype, planned or not implemented;
- Global Lobby and node configuration scopes remain distinct from environment profiles;
- the JSON descriptor matches the explanatory specification.

**Current completion status:** the environment documentation is corrected. Runtime integration, authentication, full Lobby topology and production record storage remain implementation work.

---

*End of document — CIN Initial Environment Configuration v1.0, revision 1.0.1.*


## 12. GitHub operator-link integration status

The web Lobby now contains the client-side Authorization Code + PKCE flow and the repository includes the OAuth exchange Worker source.

- GitHub App: not yet registered or installed on the CIN repository.
- Worker: source committed under `services/cin-github-oauth-worker/`; deployment pending.
- Public browser configuration: `Core Identification Node Github/cin-github-config.js`; enabled remains false until the App Client ID and deployed Worker endpoint are configured.
- Requested repository permissions: Contents read/write and Metadata read-only.
- Target repository ID: `1458540194`.
- Token handling: access token held in page memory only; it is not committed or stored in browser persistent storage.
- Scope: repository operations by the linked operator. It does not replace CIN document issuer trust, node-birth authorization or personal-issuance authorization.

The GitHub Pages Lobby therefore displays the connection control, but it cannot complete account linking until the external GitHub App and Worker provisioning steps have been completed.
