# CIN Main — Component Map V1

## Phase 1 — Main Lobby Installer

`GitHub Actions Artifact → Debian Package Manager → System Launcher → GTK 4 CIN Main Lobby`

- **Debian package:** contains the Python GTK 4 application, launcher and desktop entry; the first package is architecture-independent Python code.
- **Package manager:** installs the package and resolves Python/GTK 4 dependencies from the target distribution.
- **System launcher:** starts the GTK application as the logged-in user; the running application does not require root.
- **GitHub Actions:** runs source tests, builds the .deb, installs it in CI, performs the two-screen smoke test and uploads the downloadable artifact.

The first CI pipeline does not yet authenticate public release artifacts with a detached publisher signature. A versioned Debian release-signing profile is required before authenticated production distribution.

This installer deploys the Main Lobby and its required runtime. The installer itself does not create node records or issue certificates; those processes execute inside the installed Lobby. The Phase 1 deliverable includes all three founding certificate processes.

## Phase 1 — Main Lobby and its three founding processes

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

## Phase 2 — CIN Package Engine Installer

`Package Catalog → Manifest Verifier → Dependency Resolver → Installer → Engine Registry → Engine Loader → Configuration and Lifecycle Services`

Cross-cutting Package Engine services:

- Request and Permission Engine.
- External Signing Connector Manager.
- Package Lifecycle Ledger.
- Update and Removal Managers.

The Phase 2 installer deploys the Package Engine, which then installs dedicated engines. It is a separate installer from the Phase 1 Main Lobby installer.

## Persistent data boundaries

- Release installation directory: replaceable versioned software.
- Configuration directory: user preferences and engine configuration.
- Cache directory: disposable download and processing data.
- CIN local data directory: persistent Genesis, birth, personal-document, association and later operational records.
- Package Engine data: package registry, engine configuration and lifecycle records, with explicit references to the CIN node records.

Application updates must not overwrite persistent CIN records.
