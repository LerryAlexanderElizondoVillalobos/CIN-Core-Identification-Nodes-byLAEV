# CIN Engine Manager — Technical Specification v1.0

**Project:** Core Identification Nodes (CIN) byLAEV  
**Roadmap phase:** Phase 1  
**Status:** Proposed specification for implementation

## 1. Purpose

The CIN Engine Manager (Motor of Motors) is the local package installer and lifecycle manager for independent CIN engines. It allows the foundational node to acquire capabilities progressively without embedding engine implementations in CIN Core.

The manager is an administrative component. It does not implement the specialized functions of the engines it manages.

**Architectural rule:** each engine is installed as an independent package. Its source and runtime files remain within its own package directory.

The manager must operate locally and must not depend on Networks Engine. This prevents a circular dependency in which the manager would need the network engine to install that same engine.

## 2. Position in the CIN environment

~~~text
CIN/
├── core/
│   ├── certificates/
│   ├── cin-document/
│   └── core-runtime/
├── engine-manager/
│   ├── manager/
│   ├── installer/
│   ├── registry/
│   ├── configuration/
│   ├── dependencies/
│   ├── lifecycle/
│   └── certificates/
├── engines/
│   └── <engine-id>/
│       ├── manifest.json
│       ├── engine/
│       ├── configuration/
│       └── metadata/
├── applications/
└── data/
    └── engine-manager/
        ├── registry.json
        ├── installations/
        └── logs/
~~~

- **core/** contains the foundational CIN runtime, certificates and CIN document functions.
- **engine-manager/** contains package administration.
- **engines/** contains only packages installed on this node; it is not a mandatory collection of all engine source code.
- **applications/** contains dedicated applications that consume engine capabilities.
- **data/engine-manager/** contains local operational records.

The exact internal source layout can evolve. The separation between these responsibilities must remain.

## 3. Manager modules

### 3.1 Engine Installer
Reads a package manifest, checks the package structure and CIN compatibility, inspects dependencies, places the package in its engine directory and records the installation. The initial version installs from a local directory or archive. Network distribution can be added later.

### 3.2 Engine Registry
Maintains one local record per installed engine: identifier, name, version, package path, installation timestamp, lifecycle state, manifest version, dependencies and certificate reference where applicable.

### 3.3 Engine Configuration
Stores each engine's configuration separately from its executable package. The engine defines its own configuration schema and defaults; the manager stores and supplies them.

### 3.4 Engine Dependencies
Reads declared dependencies and checks whether the required engines and compatible versions are installed. The initial version supports local dependency inspection and installation-order determination.

### 3.5 Engine Lifecycle
Coordinates installation, registration, configuration, activation, stopping, updating and uninstallation. It invokes the engine's declared interface without embedding the engine's internal functions.

### 3.6 Engine Certificates
Provides the management point for package certificates and verification references. Certificate issuance and cryptographic implementation remain responsibilities of the corresponding certificate or cryptography components. A valid signature can establish package provenance and integrity under its rules; it does not prove functional correctness.

### 3.7 Engine Status
Reports whether an engine is installed, registered, configured, active, stopped or unavailable, together with its version, dependency status and latest lifecycle result. File presence alone must not be reported as operational status.

## 4. Engine package contract

Every installable package must contain a manifest named manifest.json at its root. The manifest identifies the package and describes the requirements the manager needs to administer it.

### 4.1 Example manifest

~~~json
{
  "manifest_version": "1.0",
  "engine_id": "org.cin.networks",
  "name": "CIN Networks Engine",
  "version": "1.0.0",
  "description": "Node discovery, network recognition and communication.",
  "cin_compatibility": {
    "minimum": "1.0.0",
    "maximum": null
  },
  "entrypoint": {
    "type": "process",
    "path": "engine/main"
  },
  "dependencies": [],
  "configuration": {
    "schema": "configuration/schema.json",
    "defaults": "configuration/defaults.json"
  },
  "capabilities": [
    "node-discovery",
    "network-recognition",
    "node-communication"
  ],
  "lifecycle": {
    "install": null,
    "start": "start",
    "stop": "stop",
    "health": "status"
  },
  "certificate": {
    "required": false,
    "reference": null
  }
}
~~~

This is an illustrative contract, not a claim that Networks Engine is implemented. The entrypoint and lifecycle interface must match the runtime selected during implementation.

### 4.2 Manifest fields

| Field | Purpose |
|---|---|
| manifest_version | Version of the manifest contract |
| engine_id | Stable package identifier |
| name, description | Human-readable package information |
| version | Package version |
| cin_compatibility | Supported CIN Core version range |
| entrypoint | Runtime type and startup entrypoint |
| dependencies | Required engine identifiers and version constraints |
| configuration | Paths to schema and default configuration |
| capabilities | Functions exposed by the engine |
| lifecycle | Supported lifecycle operations |
| certificate | Certificate requirement and reference |

The manager must be able to identify and organize a package without understanding its internal implementation.

## 5. Registry record

A representative registry entry:

~~~json
{
  "engine_id": "org.cin.networks",
  "name": "CIN Networks Engine",
  "version": "1.0.0",
  "package_path": "engines/org.cin.networks",
  "manifest_version": "1.0",
  "state": "installed",
  "installed_at": "2026-01-01T12:00:00Z",
  "dependencies": [],
  "certificate_reference": null
}
~~~

The timestamp is an example format, not an actual installation record. The registry must reflect operation results. Failed operations must not be recorded as successful.

## 6. Installation workflow

1. Operator selects a local engine package.
2. Manager reads manifest.json.
3. Manager checks required manifest fields and package structure.
4. Manager checks CIN compatibility.
5. Manager checks declared dependencies against the local registry.
6. Manager evaluates any package-certificate requirement and available verification result.
7. Manager places the package in engines/<engine-id>/.
8. Manager creates the registry entry.
9. Engine appears in the installed-engine list.
10. Operator configures and activates it when requirements are met.

Installation and activation are separate operations. An installed package is not necessarily running or ready.

## 7. Update workflow

1. Read the new package manifest.
2. Confirm that engine_id matches the installed engine.
3. Check CIN compatibility and dependencies.
4. Compare package versions.
5. Stop the engine if required by its lifecycle.
6. Install the new package version.
7. Update the registry.
8. Reactivate the engine when requested and supported.
9. Report the result.

Configuration should remain separate from package files and be preserved when compatible with the new version. Explicit rollback support can be added later; it is not a prerequisite for the first functional installer.

## 8. Uninstallation workflow

1. Identify the engine through the registry.
2. Check whether another installed engine depends on it.
3. If dependents exist, report them and require the operator to resolve the dependency.
4. Stop or deactivate the engine if active.
5. Remove its package directory.
6. Remove its registry entry.
7. Preserve or remove configuration and data according to an explicit operator choice.
8. Report the result.

Uninstallation must not silently remove dependent engines, CIN Core or unrelated application data.

## 9. Lifecycle states

| State | Meaning |
|---|---|
| absent | No package installed |
| installing | Installation in progress |
| installed | Package files present and registered |
| configuring | Configuration being prepared |
| ready | Configuration and declared requirements satisfied |
| starting | Activation in progress |
| active | Engine reports that it is running |
| stopping | Deactivation in progress |
| stopped | Installed but not running |
| updating | Package update in progress |
| uninstalling | Package removal in progress |
| error | Latest operation failed or engine reported an error |

A state transition must reflect the result of the relevant operation, not merely the operator's request.

## 10. Manager-to-engine interface

The initial logical operations are:

- install — optional package-specific setup.
- start — activate the engine.
- stop — stop the engine.
- status — report operational state.
- health — optional diagnostic result.

Their concrete implementation may use process commands, local APIs or another runtime interface selected during implementation.

The manager should provide common administrative operations to list engines, inspect details, install, configure, start, stop, update, uninstall and inspect status. Applications consume documented engine capabilities and must not depend on another engine's private implementation files.

## 11. Local independence and future distribution

The manager must work on a new CIN node before Networks Engine is installed. Local package selection and installation are sufficient for Phase 1.

Later distribution sources may include CIN-authorized repositories, peer-distributed packages, organization-maintained sources and other explicitly configured distribution points. The local registry and lifecycle operations must remain available when no network source is configured.

## 12. Signing and authorization relationship

The manager may request package authorization or signature verification when required by the applicable package policy. It does not need to hold private signing keys. Signing can be provided through an external device, local signing companion or another explicitly integrated service.

Requests & Permissions Engine belongs to Phase 2. Its absence must not prevent the Phase 1 manager from installing the initial local package format. Phase 1 can use a basic local operator flow; later permission workflows can integrate through a defined interface.

## 13. Phase 1 implementation boundary

The minimum functional manager consists of:

1. Local package directory.
2. Readable package manifest.
3. Package installer.
4. Local engine registry.
5. Per-engine configuration storage.
6. Dependency inspection.
7. Basic lifecycle controls.
8. Engine status reporting.
9. Package removal.

Peer-to-peer discovery, distributed repositories, Networks Engine integration, distributed consensus over installation, advanced reputation scoring and mandatory external signing devices are later extensions, not prerequisites for the first functional version.

## 14. Recommended implementation sequence

1. Define and validate the manifest format.
2. Create the local directory structure.
3. Implement manifest reading and package inspection.
4. Implement local installation and registry creation.
5. Implement engine listing and detail views.
6. Implement per-engine configuration storage.
7. Implement dependency checks.
8. Implement start, stop and status integration.
9. Implement update.
10. Implement uninstallation.
11. Test the full lifecycle with a minimal example engine package.

The example package validates the manager; it is not one of the six completed Phase 2 engines.

## 15. Acceptance criteria

The first implementation is functionally complete when:

- CIN Core starts with no optional engines installed.
- Manager works without Networks Engine.
- A valid local package can be inspected and installed.
- The installed package appears in the registry.
- Configuration is stored separately from implementation files.
- Missing dependencies are reported.
- The manager can activate, stop and report the example engine's state.
- An updated version is reflected in the registry.
- An engine can be removed without removing CIN Core or unrelated packages.
- Failed operations are reported accurately.

These criteria validate package management, not the correctness or security of every future engine.

## 16. Architectural decision

- **CIN Core** establishes the foundational node and CIN document environment.
- **CIN Engine Manager** installs, registers, configures and administers independent engine packages.
- **Engines** implement specialized capabilities in their own packages.
- **Applications** consume the capabilities they require.

This separation enables independent installation, maintenance, updating and removal of engines without turning CIN into a monolithic application.

---

**Core Identification Nodes (CIN) byLAEV**  
*Minimal Foundational Core · Independent Engine Packages · Local Lifecycle Management*
