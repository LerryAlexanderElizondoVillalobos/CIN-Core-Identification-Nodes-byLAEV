# CIN Engine Package Contract — V1 Proposal

**Status:** Interface proposal; implementation and conformance requirements pending.

## 1. Purpose

Define the minimum declaration required for a package to be discovered, verified, resolved, installed, configured and managed by the CIN Package Engine.

## 2. Package descriptor

Each package must declare:

| Field | Purpose |
|---|---|
| `package_id` | Stable package identifier |
| `package_version` | Immutable release version |
| `package_type` | Engine, certificate module, Ledger, connector, service or application |
| `manifest_version` | Descriptor schema version |
| `cin_main_compatibility` | Supported Main interface range |
| `publisher` | Publisher and signing-key reference |
| `artifacts` | Package files and integrity digests |
| `dependencies` | Required packages and version constraints |
| `capabilities` | Functions the package provides |
| `permissions_requested` | Operations and resources it needs |
| `entry_points` | Declared engine startup and integration entry points |
| `configuration_schema` | Configuration contract and defaults |
| `data_boundaries` | Persistent data owned, read or written by the package |
| `lifecycle` | Install, configure, enable, disable, update and remove operations |

## 3. Engine integration

An engine must declare the versioned CIN Main interface it implements. The Package Engine checks compatibility before enabling it. Engine loading occurs through a documented entry point; package presence alone does not make an engine active.

The package contract must define:

- Engine initialization and shutdown.
- Capability registration.
- Request and permission integration.
- Configuration validation.
- Persistent-data ownership and migration.
- Event and result reporting.
- Version compatibility and update behavior.
- Removal behavior and retained records.

## 4. Package lifecycle

1. Discover package metadata.
2. Verify the manifest, package digest, signature and publisher trust.
3. Resolve dependencies and compatibility.
4. Stage the package.
5. Install package-owned files.
6. Register the engine and its capabilities.
7. Apply configuration.
8. Enable only after required permissions and dependencies are satisfied.
9. Record each lifecycle outcome.

## 5. Trust and signing boundary

Package integrity, publisher signature validity, publisher trust and permission to execute an operation are distinct outcomes. A valid signature alone does not authorize every capability.

The Package Engine must not store publisher private keys or user signing private keys. External signer integrations expose signing operations through a defined connector interface.

## 6. Status

This is a proposed contract to guide the first Package Engine implementation. Field serialization, canonicalization, signature profile, dependency semantics and executable entry-point format must be specified before package interoperability is claimed.
