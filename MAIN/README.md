# Core Identification Nodes — Official Linux Package

**Package:** `Core_Identification_Nodes.deb`  
**Package version:** 0.3.0  
**Debian package name:** `core-identification-nodes`  
**Architecture:** `all` (architecture-independent Python application; includes ARM64/AArch64 Linux)

## Included capabilities

- CIN Main Lobby, opening as the initial screen.
- Settings with Lobby navigation.
- Component-aware Deploy engine.
- Local component manifest and SHA-256 build fingerprint.
- Official manifest verification using a separately provisioned Ed25519 publisher public key.
- Component comparison, HTTPS staging, explicit operator authorization and rollback on failed post-deployment verification.
- Per-user installation under `~/.local`, without root, sudo, apt installation, or system-wide dpkg installation.
- Optional CIN-only network ON/OFF enforcement when a supported systemd user manager and cgroup policy are available. The application remains usable when this optional backend is absent.

## Download

The only official distributable is **`Core_Identification_Nodes.deb`**, published by the GitHub Actions workflow named **CIN — Official Core Identification Nodes Debian Package**, after source tests, package inspection and installation qualification pass.

The previous ZIP installer workflow is retired. Do not use its historical artifacts.

## Lindesk / Debian ARM64 installation

Requirements: Debian-compatible ARM64/AArch64 Linux, Python 3, PyGObject, GTK 4, OpenSSL, and `dpkg-deb`. The installer does not require systemd, a systemd user manager, cgroup visibility, root privileges, or a graphical session to complete the file installation.

Run as the normal user, never as root. The single `.deb` is a portable application payload; do not use `sudo dpkg -i` or `apt install`.

```bash
tmp="$(mktemp -d)"
dpkg-deb --extract ./Core_Identification_Nodes.deb "$tmp"
bash "$tmp/opt/cin-installer/install-user.sh" "$PWD/Core_Identification_Nodes.deb"
result=$?
rm -rf "$tmp"
exit "$result"
```

Launch from a graphical Lindesk session:

```bash
~/.local/bin/cin-main
```

Uninstall:

```bash
bash ~/.local/opt/cin-main-lobby/uninstall-user.sh
```

## Installed paths

- Application: `~/.local/opt/cin-main-lobby/`
- Launcher: `~/.local/bin/cin-main`
- Desktop entry: `~/.local/share/applications/cin-main.desktop`
- Publisher key: `~/.config/cin-main-lobby/deploy.pub`
- Persistent application data: `~/.local/share/cin-main-lobby/`

## Deployment trust setup

The Deploy engine is included, but it will not trust an unverified update source. The publisher's Ed25519 public key must be provisioned independently at:

`~/.config/cin-main-lobby/deploy.pub`

The signed official manifest and its signature must also be published at the configured official channel. Until both are correctly provisioned, Settings reports that publisher trust is not configured and no remote code is applied.

## Network switch and Lindesk compatibility

The CIN-only network switch uses the dedicated `cin-main-lobby.scope` systemd user scope with `IPAddressDeny` when that facility is available. Lindesk environments without a systemd user manager or visible cgroup policy can still install and run the Main Lobby; Settings reports network isolation as unavailable, rather than claiming that traffic is blocked. This capability is not emulated by changing host networking or NetworkManager.

## Validation status

The official workflow must pass:
1. Source and Deploy tests.
2. Debian payload inspection.
3. Unprivileged installation and application launch.
4. Installation qualification on Debian ARM64, including Lindesk-like environments without systemd user services.
5. Network OFF/ON smoke test on hosts that provide the supported systemd/cgroup backend; explicit unavailable-state test where it does not.
6. Uninstallation while preserving user data and publisher configuration.

A package is not considered released until the workflow publishes its single `.deb` artifact successfully.
