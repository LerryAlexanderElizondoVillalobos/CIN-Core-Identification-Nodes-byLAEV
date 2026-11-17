# CIN Initial Environment Configuration v1.0

**Project:** Core Identification Node (CIN) byLAEV  
**Configuration ID:** `cin.initial-environment`  
**Version:** 1.0.0  
**Status:** Initial configuration baseline — implementation alignment required  
**Scope:** Repository, deployment, local runtime, storage, authentication and component layout  
**Branch reviewed:** `main`

---

## 1. Objective

This document establishes the initial operational space of CIN: which repository and directory define the current project boundary, how the published Lobby differs from the local runtime, where local data is resolved, which providers are currently available, and how the existing components are organized.

This is a configuration baseline grounded in the repository as inspected. It deliberately distinguishes:

- **Verified current configuration:** values and behavior present in the repository.
- **Selected baseline:** the configuration value adopted for future integration.
- **Not configured / not implemented:** a provider or component for which no active implementation was found.
- **Pending alignment:** a discrepancy between existing implementation artifacts that must be reconciled.

This document does not claim that the multi-node Lobby architecture or a production backend is already implemented.

## 2. Repository configuration

| Parameter | Initial value | Status |
|---|---|---|
| Repository Owner | `LerryAlexanderElizondoVillalobos` | Verified from GitHub repository metadata |
| Repository | `CIN-Core-Identification-Nodes-byLAEV` | Verified |
| Branch | `main` | Verified default branch |
| Root Directory | `Core Identification Node Github/` | Verified Pages publication directory |
| Repository URL | `https://github.com/LerryAlexanderElizondoVillalobos/CIN-Core-Identification-Nodes-byLAEV` | Verified |
| Published Lobby | `https://lerryalexanderelizondo.github.io/CIN-Core-Identification-Nodes-byLAEV/` | Declared in repository README |

### 2.1 Meaning of Root Directory

`Core Identification Node Github/` is currently the **GitHub Pages publication root** for the CIN Genesis Lobby. The workflow `.github/workflows/cin-genesis-lobby-pages.yml` uploads only this directory as the Pages artifact.

It is not the root of all application source code. The current local runtime and core library are located under `prototype/` at repository root.

The directory also contains `CIN 001/`, which currently has a README establishing the node directory, but does not yet contain the full Node Lobby or local Configuration Engine implementation.

## 3. Environment configuration

### 3.1 Storage provider

**Selected baseline:** local filesystem storage.

The repository contains two related but distinct local persistence elements:

1. `prototype/cin-core/src/storage/` contains a filesystem document repository and a `TransactionalStore` prototype. The transactional implementation stores JSON documents, stages writes, calculates SHA-256 over the exact serialized bytes, uses commit markers and supports read/recovery inspection.
2. `prototype/linux-runtime/src/main.rs` contains a separate runtime persistence probe that writes `runtime-probe.record` to the resolved local data directory and reads it back.

These are prototype capabilities. The runtime persistence probe is not the production CIN record store, and the presence of the storage implementation does not mean Genesis, node-birth or other production records are already being persisted through it.

| Setting | Baseline |
|---|---|
| Provider type | Local filesystem |
| Document format | JSON |
| Core storage implementation | `prototype/cin-core/src/storage/TransactionalStore` |
| Runtime persistence probe | `runtime-probe.record` |
| Production record provider | Not yet designated |
| Cloud/remote storage provider | Not configured |

### 3.2 Data root

The core data-root resolver defines this precedence:

1. Explicit application configuration.
2. Environment variable `CIN_DATA_DIR`.
3. Operating-system user data directory.

Platform defaults declared by the resolver:

| Platform | Default |
|---|---|
| Windows | `%APPDATA%/CIN` |
| macOS | `~/Library/Application Support/CIN` |
| Linux / Unix | `$XDG_DATA_HOME/CIN`, otherwise `~/.local/share/CIN` |

The data root is separate from the executable and extracted package directory. This preserves local records when the portable application folder is moved or updated.

**Integration discrepancy requiring resolution:** the core resolver and its specification use `CIN_DATA_DIR`, while the Linux runtime prototype currently reads `CIN_DATA_ROOT` and uses lowercase `cin` in its fallback paths. The selected canonical variable for CIN is `CIN_DATA_DIR`, matching `prototype/cin-core/src/data_root.rs` and `specifications/CIN_DATA_ROOT_RESOLVER_SPECIFICATION_V1.md`. The Linux runtime must be aligned with that contract before both components are treated as one integrated environment.

### 3.3 Authentication provider

**Status: not configured.**

The inspected static GitHub Pages Lobby does not authenticate an operator against a CIN backend. The local Linux runtime prototype currently exposes its local HTTP interface and does not declare an authentication provider.

No identity provider, credential provider, session provider or external authentication service is selected in this baseline.

Authentication and operation authorization must remain separate configuration domains. A future authentication provider establishes the caller/session context; a separate authorization mechanism determines whether a particular operation is permitted. No provider is to be inferred from GitHub Pages hosting or repository ownership.

### 3.4 Backend address

CIN currently has two different delivery/runtime contexts:

**A. Published Genesis Lobby**

- Hosting: GitHub Pages.
- Address: `https://lerryalexanderelizondo.github.io/CIN-Core-Identification-Nodes-byLAEV/`
- Mode: static web publication.
- Backend API: none configured for the published Pages site.

The existing README explicitly describes this page as a static interface and states that it cannot inspect the host operating system, execute a local certificate or write a manifest to local storage by itself.

**B. Local Linux runtime prototype**

- Bind address: `127.0.0.1` only.
- Port selection: first available of `1221`, `2112`, then an operating-system-assigned ephemeral port.
- Runtime output: `CIN_URL=http://127.0.0.1:<selected-port>`.
- Runtime health route: `GET /health`.
- Runtime status route: `GET /api/status`.
- Lifecycle route: `GET /api/lifecycle`.
- Persistence probe routes: `POST /api/probe/write` and `GET /api/probe/read`.
- Shutdown route: `POST /api/runtime/shutdown`.

The local address is dynamic and must be discovered from the runtime's `CIN_URL` output; it must not be hardcoded as a permanent backend URL.

**Runtime scope:** Linux x86_64 prototype. It is not yet a production backend and does not implement the full CIN Node Lobby or Global Lobby communication contract.

### 3.5 Connection state

The configuration baseline distinguishes these states:

| Context | Initial state | Meaning |
|---|---|---|
| GitHub repository | Available | Repository and `main` branch are accessible |
| GitHub Pages | Published URL declared | Static Lobby publication target exists |
| Pages-to-backend connection | Not configured | No backend endpoint is connected to the public static page |
| Local Linux runtime | Prototype | Can expose a loopback HTTP server when launched |
| Local storage | Prototype | Filesystem persistence components exist in the Rust prototype |
| Remote node communication | Not configured | No operational Global Lobby-to-node administration transport found |
| Authentication | Not configured | No active authentication provider found |

Connection status must be measured at runtime. A repository URL or a published static page is not proof that a local backend or CIN node is online.

## 4. Component structure

### 4.1 Current repository layout relevant to the environment

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
│   │   ├── Cargo.toml
│   │   └── src/
│   │       ├── data_root.rs
│   │       ├── documents/
│   │       ├── storage/
│   │       ├── schema.rs
│   │       ├── lifecycle.rs
│   │       └── recovery.rs
│   │
│   ├── linux-runtime/
│   │   ├── Cargo.toml
│   │   ├── run-cin.sh
│   │   └── src/
│   │       ├── main.rs
│   │       ├── browser.rs
│   │       └── runtime_lifecycle.rs
│   │
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

This is a relevant component map, not a complete recursive inventory of every repository file.

### 4.2 Main directory

The repository has two important roots with different purposes:

- Repository root: source code, prototypes, specifications, CI and development documentation.
- `Core Identification Node Github/`: current static Genesis Lobby publication and the designated location for its related node-facing assets and documentation.

The local runtime is currently maintained under `prototype/linux-runtime/`; the domain library is under `prototype/cin-core/`.

### 4.3 Central engines

The current Rust core library is `prototype/cin-core/`. Its modules include:

| Module | Current repository location | Observed responsibility |
|---|---|---|
| Data Root Resolver | `src/data_root.rs` | Resolve the local user-data directory |
| Documents | `src/documents/` | Common document model and validation |
| Storage | `src/storage/` | Filesystem repository and transactional record prototype |
| Schema | `src/schema.rs` | JSON Schema validation |
| Lifecycle | `src/lifecycle.rs` | Explicit lifecycle transition model |
| Recovery | `src/recovery.rs` | Recovery-related core functionality |

These are existing core modules, not a complete set of production engines. The current library does not yet contain the full Configuration Engine described by the evolutionary configuration specification.

### 4.4 Services

There is no separate top-level `services/` directory in the inspected repository. The current responsibilities are implemented as modules inside `prototype/cin-core/` and runtime behavior inside `prototype/linux-runtime/`.

The future architecture may introduce explicit application services, but they should be created when a functional service contract and implementation slice are defined. Empty directories must not be presented as implemented services.

### 4.5 Lobby interface

Two interface artifacts currently exist:

1. **Published Genesis Lobby:** `Core Identification Node Github/index.html`, served as a static GitHub Pages site.
2. **Local runtime web interface:** `prototype/dist/index.html`, embedded and served by the Linux local runtime.

Neither artifact currently implements the full target architecture of a Global Lobby selector plus a separate Node Lobby inside each CIN node.

### 4.6 Guest

No implemented `Guest/` directory, Guest service or Guest module was found in the inspected component paths.

For this initial configuration, Guest is recorded as a **planned component / not yet mapped to an implementation**. Its purpose, permissions, relationship to the Global Lobby and relationship to a node-specific Lobby must be specified before creating its runtime directory or assigning it an authentication role.

### 4.7 Configuration

Configuration-related artifacts currently include:

- `prototype/cin-core/src/data_root.rs`: local data-root resolution.
- `specifications/CIN_DATA_ROOT_RESOLVER_SPECIFICATION_V1.md`: data-root contract.
- `specifications/CIN_LOCAL_DOCUMENT_STORAGE_SPECIFICATION_V1.md`: local JSON document storage contract.
- `prototype/cin-core/src/schema.rs`: JSON Schema validation.
- `Core Identification Node Github/manifest.webmanifest`: PWA publication metadata.
- `CIN Configuration Engine — Evolutionary Configuration Specification v1.0`: multi-scope configuration architecture.

The last item defines the target evolutionary Configuration Engine architecture; it does not mean that engine has already been implemented.

## 5. Multi-node configuration scope

The target configuration architecture has one central scope and one independent scope per CIN node:

| Scope | Owner | Configuration authority |
|---|---|---|
| Global Lobby | `Core Identification Node Github/Lobby Core/` (target structure) | Global Configuration Engine/context |
| CIN 001 | `Core Identification Node Github/CIN 001/` | CIN 001 local Configuration Engine |
| CIN 002 | `Core Identification Node Github/CIN 002/` | CIN 002 local Configuration Engine |
| CIN N | Its own node directory | Its own local Configuration Engine |

The current repository only establishes the CIN 001 directory with a README. The Global Lobby and per-node local Configuration Engine folders are target architecture elements and must be introduced through their own implementation work.

The environment configuration itself must therefore support scoped values. A global repository reference does not imply shared node configuration, and adding CIN 002 must not reuse CIN 001's state or local data root.

## 6. Initial configuration record

The machine-readable companion file is:

`cin-initial-environment.v1.json`

It records repository settings, deployment context, runtime address strategy, storage provider status, data-root contract, authentication status and component paths.

The JSON is an initial configuration descriptor. It does not provision a backend, create credentials, start a service or activate an authentication provider.

## 7. Required alignment work

The following work is required before this baseline can be considered an integrated operational environment:

1. Align the Linux runtime data-root variable and fallback path with the canonical `CIN_DATA_DIR` resolver.
2. Connect the local runtime to the shared `cin-core` storage API instead of treating the runtime probe as the record store.
3. Decide and implement the authentication provider, if the operational Lobby requires authenticated sessions.
4. Define the local backend API contract and how the Lobby discovers its dynamic loopback address.
5. Implement the Global Lobby node selector and node registry.
6. Implement a local Node Lobby and Configuration Engine inside CIN 001.
7. Define Guest as a functional role/component before implementing it.
8. Extend the same provisioning model to CIN 002 and later nodes without sharing local configuration state.

## 8. Acceptance criteria

The initial environment configuration is accepted as a documented baseline when:

- repository owner, name, branch and Pages root are explicitly recorded;
- static Pages hosting is distinguished from the local runtime backend;
- storage provider and maturity are accurately represented;
- data-root precedence and the environment-variable discrepancy are documented;
- authentication is explicitly marked unconfigured rather than assumed;
- backend binding and dynamic port behavior are recorded;
- existing engines, runtime, Lobby assets, services and Guest status are mapped without claiming absent components exist;
- Global Lobby and node configuration scopes are clearly distinguished.

**Current completion status:** documentation baseline can be established now. Runtime integration, authentication, full Lobby topology and production record storage remain implementation work.

---

*End of document — CIN Initial Environment Configuration v1.0.*
