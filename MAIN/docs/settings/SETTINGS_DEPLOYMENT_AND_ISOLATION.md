# CIN Settings — Official Code Deployment

**Project:** CIN — Core Identification Nodes byLAEV  
**Application:** CIN Main Lobby  
**Scope:** Settings → Code Deployment and initial installer bootstrap  
**Status:** Deployment foundation implemented; publisher channel qualification pending

## Delivered in this implementation

- Component-level Local Manifest with SHA-256 hashes and a deterministic build fingerprint.
- Official manifest validation bound to the CIN Main Lobby application and schema.
- Detached Ed25519 signature verification using OpenSSL and a locally provisioned publisher public key.
- Component comparison for additions, replacements and removals.
- HTTPS-only file staging and per-file SHA-256 verification.
- Explicit Deploy authorization in Settings.
- Transactional application with restoration of the previous application tree if post-apply validation fails.
- Local deployment result record under `~/.local/share/cin-main-lobby/deployment-record.json`.
- Initial installer migration that replaces the previous application payload while preserving user data and publisher configuration.

## Publisher trust and release channel

The publisher public key must be provisioned independently at `~/.config/cin-main-lobby/deploy.pub`. It is not downloaded with the manifest and no placeholder key is trusted.

The intended official channel endpoint is `https://raw.githubusercontent.com/LerryAlexanderElizondoVillalobos/CIN-Core-Identification-Nodes-byLAEV/main/MAIN/deploy/official-manifest.json`. The channel is not considered live until a signed manifest and its signature are published there. Each component entry includes `path`, `sha256`, `size` and an HTTPS `url`. The detached Ed25519 signature covers canonical JSON (UTF-8, sorted keys, compact separators). The build fingerprint covers schema, application and sorted component path/hash/size entries.

Only explicitly approved deployable builds should be published. Arbitrary intermediate commits are not a release channel.

## Initial installation / migration

The first installation is a bootstrap operation: it replaces the old application payload with the new application containing Deploy. The old installation cannot deploy itself into this version. The installer preserves `~/.local/share/cin-main-lobby` and `~/.config/cin-main-lobby`, replaces only the application payload and refreshes the per-user launcher. The uninstaller removes application files but leaves those data/configuration directories intact.

Run as the normal desktop user: `bash install-user.sh ./CIN.deb`.

## Current qualification boundary

The deployment engine and Settings controls are implemented, but a live update cannot be trusted/applied until the project publishes a signed official manifest and the operator independently provisions the corresponding publisher public key. The installer must not fabricate this trust material.

Network Isolation is not part of this deploy-only installer deliverable and must not be represented as implemented. GTK runtime and Debian package qualification remain required before publishing a production installer.
