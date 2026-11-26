# CIN Package Engine — Engine of Engines

The Package Engine is the post-foundation subsystem that installs and manages specialized CIN packages and engines.

It becomes the next major development phase after the Main Lobby has completed the three founding certificate processes and persisted the required node and CIN Global Personal Document association records.

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

The Package Engine is not the Linux bootstrap installer. The bootstrap installer installs CIN Main itself; the Package Engine installs the engines that CIN Main can operate.

## Engine package contract

Every package must declare its stable identifiers, version, compatibility, dependencies, capabilities, permissions, entry point, configuration schema, persistent-data boundaries, publisher/signature references and lifecycle operations.

This document defines the intended scope. The executable package contract and implementation remain to be specified.
