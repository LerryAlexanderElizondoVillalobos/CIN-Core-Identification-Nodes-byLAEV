# Core Identification Nodes — Official Linux Package

**Package:** `Core_Identification_Nodes.deb`  
**Package version:** 0.3.0  
**Debian package name:** `core-identification-nodes`  
**Architecture:** `all` (architecture-independent Python application)

## Included capabilities

- CIN Main Lobby, opening as the initial screen.
- Settings with Lobby navigation.
- Component-aware Deploy engine.
- Local component manifest and SHA-256 build fingerprint.
- Official manifest verification using a separately provisioned Ed25519 publisher public key.
- Component comparison, HTTPS staging, explicit operator authorization and rollback on failed post-deployment verification.
- CIN-only network ON/OFF control enforced on the dedicated `cin-main-lobby.scope` systemd user scope.
- User-space installer and uninstaller; no system-wide installation or root privileges.

## Download

The only official distributable is **`Core_Identification_Nodes.deb`**, published by the GitHub Actions workflow named **CIN — Official Core Identification Nodes Debian Package**, after source tests, network runtime qualification, package inspection and installation qualification pass.

The previous ZIP installer workflow is retired. Do not use its historical artifacts.

## Installation

Requirements: a Debian-compatible Linux desktop with Python 3, PyGObject, GTK 4, OpenSSL, `dpkg-deb`, `systemd --user`, and a systemd/cgroup environment that supports `IPAddressDeny`.

Run as the normal desktop user, never as root. The single `.deb` contains both bootstrap scripts; extract its embedded installer into a temporary directory:

```bash
tmp="$(mktemp -d)"
dpkg-deb --extract ./Core_Identification_Nodes.deb "$tmp"
bash "$tmp/opt/cin-installer/install-user.sh" "$PWD/Core_Identification_Nodes.deb"
result=$?
rm -rf "$tmp"
exit "$result"
```

Launch:

```bash
~/.local/bin/cin-main
```

Uninstall:

```bash
bash MAIN/installer/linux/uninstall-user.sh
```

The Debian archive is a portable application payload. Do not install it with `sudo dpkg -i` or `apt install`.

## Deployment trust setup

The Deploy engine is included, but it will not trust an unverified update source. The publisher's Ed25519 public key must be provisioned independently at:

`~/.config/cin-main-lobby/deploy.pub`

The signed official manifest and its signature must also be published at the configured official channel. Until both are correctly provisioned, Settings reports that publisher trust is not configured and no remote code is applied.

## Network switch

The ON/OFF control applies only to CIN's dedicated systemd user scope. OFF denies IP networking for CIN; ON restores it. It does not disable NetworkManager or change connectivity for the host or other applications. If the required systemd/cgroup support is unavailable, the application reports the policy as unavailable rather than claiming it is enforced.

## Validation status

The official workflow must pass:
1. Source and Deploy tests.
2. x86_64 and ARM64 network-scope runtime qualification.
3. Debian payload inspection.
4. Unprivileged installation and application launch.
5. In-app network OFF/ON smoke test.
6. Uninstallation while preserving user data and publisher configuration.

A package is not considered released until the workflow publishes its single `.deb` artifact successfully.
