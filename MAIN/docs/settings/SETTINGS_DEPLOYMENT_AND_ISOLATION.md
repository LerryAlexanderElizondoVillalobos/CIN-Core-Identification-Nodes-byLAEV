# CIN Settings — Component Deploy, Network Isolation and Initial Installer

**Project:** CIN — Core Identification Nodes byLAEV  
**Application:** CIN Main Lobby  
**Scope:** CIN.deb bootstrap installer, Settings → Deploy and Network Isolation  
**Development stage:** Continuous component-level development; no formal application release/update system in this stage.

## Confirmed development model

CIN.deb is the single initial installer for the base CIN Main Lobby and Settings. Deploy is included as a native capability and is used during active development to incorporate code at component/file level without requiring a full application release or reinstall.

Deploy operations are ADD, UPDATE/REPLACE, EXTEND, REMOVE and VERIFY. The local manifest inventories installed components and their SHA-256 hashes; it is not an application release version.

A formal application version/release compatibility and update-management system is deferred until the project enters official distribution.

## Deploy foundation currently present in this branch

- Component-level Local Manifest with SHA-256 hashes and a deterministic build fingerprint.
- Official manifest validation bound to the CIN Main Lobby application and schema.
- Detached Ed25519 signature verification using OpenSSL and a locally provisioned publisher public key.
- Component comparison for additions, replacements and removals.
- HTTPS-only file staging and per-file SHA-256 verification.
- Explicit Deploy authorization in Settings.
- Transactional application with restoration of the previous application tree if post-apply validation fails.
- Local deployment result record under `~/.local/share/cin-main-lobby/deployment-record.json`.
- Initial installer migration that replaces the previous application payload while preserving user data and publisher configuration.

## Network Isolation — required integration still outstanding

Network Isolation is part of the agreed CIN.deb scope for this development stage. It is **not present in the current branch implementation**: there is no installed isolation component, Settings control, integration in the Debian payload, or corresponding automated qualification test yet.

The architectural document `HISTORY/docs/architecture/CIN_NETWORKS_NATIVE_ADDRESSING_AND_DOMAIN_REGISTRY_v1.2.md` specifies the proposed CIN Networks Engine (addressing, resolver, domain registry and node communications). That Networks Engine is not interchangeable with an operating-system/application network-isolation mechanism. The implementation contract for Network Isolation must be defined before selecting the mechanism; do not silently substitute the Networks Engine or claim isolation is active.

Consequently, the existing green CI runs qualify the current Lobby + Deploy installer only. They do not qualify the full agreed installer scope, and PR #49 must remain unmerged until Network Isolation is implemented, packaged and tested.

## Publisher trust and development channel

The publisher public key must be provisioned independently at `~/.config/cin-main-lobby/deploy.pub`. It is not downloaded with the manifest and no placeholder key is trusted.

The intended official channel endpoint is `https://raw.githubusercontent.com/LerryAlexanderElizondoVillalobos/CIN-Core-Identification-Nodes-byLAEV/main/MAIN/deploy/official-manifest.json`. The channel is not live until a signed manifest and its signature are published there. Each component entry includes `path`, `sha256`, `size` and an HTTPS `url`.

## Initial installation / migration

The first installation is a bootstrap operation. The installer replaces the previous application payload and preserves `~/.local/share/cin-main-lobby` and `~/.config/cin-main-lobby`. The uninstaller removes application files but leaves those user data/configuration directories intact.

Run as the normal desktop user: `bash install-user.sh ./CIN.deb`.

## Qualification required before merge

1. Source and unit tests for Deploy and Network Isolation.
2. Main Lobby and Settings runtime qualification on x86-64 and ARM64.
3. Debian payload inspection proving both Deploy and Network Isolation are included.
4. Fresh installation, migration, launch, network-isolation behavior tests, and uninstall.
5. Confirm preservation of user data and configuration.
6. Publish the downloadable installer artifact only from `main`, after all required qualification jobs pass.
