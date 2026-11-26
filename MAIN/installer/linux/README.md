# Core Identification Nodes — Linux Installer

**Official package:** `Core_Identification_Nodes.deb`  
**Version:** 0.3.0  
**Model:** per-user installation, no root privileges.

## Install

Run as the normal user. Do not use sudo, apt install, or dpkg -i:

```bash
tmp="$(mktemp -d)"
dpkg-deb --extract ./Core_Identification_Nodes.deb "$tmp"
bash "$tmp/opt/cin-installer/install-user.sh" "$PWD/Core_Identification_Nodes.deb"
result=$?
rm -rf "$tmp"
exit "$result"
```

The installer checks Python 3, PyGObject, GTK 4, OpenSSL and dpkg-deb. It refuses root execution. It does not require systemd, a systemd user manager, cgroup visibility, or an active graphical session to copy the application into the user's home directory.

## Launch

From an active graphical session:

```bash
~/.local/bin/cin-main
```

The launcher runs the application directly in the current user's session. No system service or privileged helper is created.

## Installed paths

- Application: `~/.local/opt/cin-main-lobby/`
- Launcher: `~/.local/bin/cin-main`
- Desktop entry: `~/.local/share/applications/cin-main.desktop`
- Deployment trust key: `~/.config/cin-main-lobby/deploy.pub`
- Deployment result record: `~/.local/share/cin-main-lobby/deployment-record.json`

## Deploy engine

The component deployment engine is included in the application. It creates a local component manifest, verifies official manifests with the independently provisioned Ed25519 key, compares additions/replacements/removals, downloads components over HTTPS, verifies SHA-256 hashes, requests explicit operator authorization, and rolls back if post-deployment verification fails.

The publisher key is not embedded in the package and cannot be accepted from the downloaded manifest. Remote deployment remains unavailable until the real publisher key and signed official channel manifest are provisioned.

## Network ON/OFF switch

When the host provides a running systemd user manager and systemd/cgroup support for IP address filtering, the switch controls only CIN's dedicated user scope through `IPAddressDeny=any`. It does not disable the host network, NetworkManager, browsers or other Linux applications.

On Lindesk installations where the systemd user manager or cgroup policy is unavailable, CIN still runs normally and the UI explicitly reports network isolation as unavailable. It does not claim that network traffic is blocked, and it does not attempt a host-wide workaround.

## Uninstall

```bash
bash ~/.local/opt/cin-main-lobby/uninstall-user.sh
```

Application files and the launcher are removed. User data and publisher configuration are intentionally preserved.
