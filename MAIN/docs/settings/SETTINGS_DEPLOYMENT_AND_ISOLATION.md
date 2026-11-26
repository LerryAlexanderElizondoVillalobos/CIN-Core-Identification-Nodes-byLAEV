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

## CIN Application Network Access — implemented in this branch

The application has a master ON/OFF control in both Main Lobby and Settings. It controls only CIN's Internet/network access. OFF applies systemd's `IPAddressDeny=any` policy to the dedicated `cin-main-lobby.scope` cgroup; ON clears that CIN-scope override. It does not disable NetworkManager, host networking, or connectivity for browsers and other Linux applications.

The installer launches CIN inside that dedicated systemd user scope. The control uses the user's systemd manager and cgroup network filtering; it does not require root or change host-wide network configuration. If the desktop session has no usable systemd user manager or the kernel/systemd cannot apply the policy, the UI reports the control as unavailable rather than claiming isolation is active.

The official-channel check and Deploy engine both require CIN network access to be ON. The setting is enforced at the CIN process scope, not merely by hiding buttons or disabling the UI.

The previous NetworkManager-wide switch and its tests have been removed. The new automated tests cover scope status, ON/OFF policy changes, missing systemd support, and the absence of any NetworkManager command invocation.

Qualification still required before merge includes running the actual ON/OFF behavior on supported Linux environments and confirming another application retains connectivity while CIN is OFF.

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
