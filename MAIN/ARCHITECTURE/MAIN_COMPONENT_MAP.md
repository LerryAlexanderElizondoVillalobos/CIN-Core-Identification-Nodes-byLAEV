# CIN Main — Component Map V1

## Phase 1 — Main Lobby User-Space Installer

`GitHub Actions Artifact → User-Space Installer → ~/.local/opt/cin-main-lobby → User Launcher → GTK 4 CIN Main Lobby`

- **Debian payload:** contains the architecture-independent Python GTK 4 application under `/opt/cin-main-lobby` inside the archive. It is a payload container and is not installed through the system package manager.
- **User-space installer:** extracts the payload and copies application files into the current user's home directory.
- **User launcher:** starts the GTK application as the logged-in user.
- **Desktop entry:** is created in the user's local applications directory.
- **Runtime prerequisites:** Python 3, PyGObject and GTK 4 must already be available to the user; the installer checks but does not install them.
- **GitHub Actions:** provisions test dependencies on disposable CI runners, builds the archive, runs the user installer as an unprivileged user, performs the two-screen smoke test, uninstalls and uploads the downloadable artifact.

The user installation and removal scripts do not call `sudo`, `apt install`, `dpkg -i` or write to system directories. CI runner provisioning may use administrator permissions solely to prepare the CI environment.

The first CI pipeline does not yet authenticate public release artifacts with a detached publisher signature. A versioned release-signing profile is required before authenticated production distribution.

This installer deploys the Main Lobby and its runtime integration. The installer itself does not create node records or issue certificates; those processes execute inside the installed Lobby. The Phase 1 long-term deliverable includes all three founding certificate processes.

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

- Application files: replaceable software under the user's local application directory.
- Configuration directory: user preferences and engine configuration.
- Cache directory: disposable download and processing data.
- CIN local data directory: persistent Genesis, birth, personal-document, association and later operational records.
- Package Engine data: package registry, engine configuration and lifecycle records, with explicit references to the CIN node records.

Application updates must not overwrite persistent CIN records.
