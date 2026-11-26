# CIN Main — Component Map V1

## Layer 1 — Linux User Installer

`Release Source → Package Origin Verifier → Extractor → User-Level Integrator → CIN Launcher`

- **Package Origin Verifier:** validates archive size and digest, manifest schema/canonicalization, detached signature and independently provisioned publisher trust.
- **Extractor:** expands only the verified release into its versioned directory.
- **User-Level Integrator:** creates the launcher and desktop entry in the current user's environment.
- **CIN Launcher:** starts the installed runtime and hands control to Main Lobby.

The installer does not create node records or issue certificates.

## Layer 2 — Main Lobby and founding records

`Lobby UI → Lifecycle Coordinator → Certificate Module → Core Services → Private Local Storage → Profile Assembly → Lobby UI`

| Certificate module | Main input | Main output |
|---|---|---|
| Genesis Environment | Accessible environment observations and operator declarations | Genesis Environment Manifest |
| Node Birth | Complete registered Genesis Manifest and birth authorization | Node identifiers and Node Birth Record |
| Global Personal Document and Node Marriage | Authoritative Node Birth Record and explicit external signer approval | Global Personal Document record and signed association agreement |

Shared Core Services:

- Document schemas and canonicalization.
- Identifier profiles and deterministic derivation.
- Raw and canonical integrity calculations.
- Local storage and record references.
- Trust and certificate verification.
- Operation authorization.
- External signer interfaces.
- Profile assembly and lifecycle state reconstruction.

The Lobby coordinates these services. It does not replace their validation or authority responsibilities.

## Layer 3 — Package Engine

`Package Catalog → Manifest Verifier → Dependency Resolver → Installer → Engine Registry → Engine Loader → Configuration and Lifecycle Services`

Cross-cutting Package Engine services:

- Request and Permission Engine.
- External Signing Connector Manager.
- Package Lifecycle Ledger.
- Update and Removal Managers.

The Package Engine installs dedicated engines after the founding Lobby workflow. The Linux User Installer installs CIN Main itself; these are different responsibilities.

## Persistent data boundaries

- Release installation directory: replaceable versioned software.
- Configuration directory: user preferences and engine configuration.
- Cache directory: disposable download and processing data.
- CIN local data directory: persistent Genesis, birth, personal-document, association and later operational records.
- Package Engine data: package registry, engine configuration and lifecycle records, with explicit references to the CIN node records.

Application updates must not overwrite persistent CIN records.
