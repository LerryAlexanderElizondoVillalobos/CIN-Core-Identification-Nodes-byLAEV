# Phase 2 — CIN Package Engine Installer

The CIN Package Engine is the **engine of engines**. Its separate installer is the deliverable of Phase 2, after Phase 1 has installed the Main Lobby and the three founding certificate processes have established the node's technical identifiers and CIN Global Personal Document association.

## Separation from Phase 1

- Phase 1 installer installs the CIN Main Lobby and its required runtime.
- The Main Lobby executes the three founding certificate processes.
- Phase 2 installer installs the CIN Package Engine.
- The Package Engine then installs and manages specialized engines and packages.

The Package Engine is not bundled into or installed by the Phase 1 Main Lobby installer.

## Core responsibilities

1. Discover and catalogue packages.
2. Verify package manifests, integrity, publisher signatures and trust.
3. Resolve engine and package dependencies.
4. Stage and install packages.
5. Register and load engines through a versioned contract.
6. Configure, enable, disable and update engines.
7. Process operation requests and permissions.
8. Connect external signing providers without storing their private keys.
9. Remove package-owned components while preserving node records.
10. Record package lifecycle events.

## Initial engine families

Certificate engines, dedicated Ledgers, binary Merkle Tree and Enterprise Merkle Tree engines, request/permission engines, external signer connectors, configurable one-time resource/UTXO-style engines, storage and evidence engines, and application-specific engines.

## Engine package contract

Every package must declare its stable identifiers, version, compatibility, dependencies, capabilities, permissions, entry point, configuration schema, persistent-data boundaries, publisher/signature references and lifecycle operations.

The Phase 2 installer deploys the Package Engine itself. The Package Engine's package installer then deploys the specialized engines that it manages.

This document defines the intended scope. The executable installer and Package Engine implementation remain to be built.
