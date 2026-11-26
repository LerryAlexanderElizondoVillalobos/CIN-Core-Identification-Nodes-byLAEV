# Core Identification Nodes — Linux Installer

**Official package:** `Core_Identification_Nodes.deb`  
**Version:** 0.3.0  
**Model:** per-user installation, no root privileges.

## Install

Run as the normal desktop user:

```bash
tmp="$(mktemp -d)"
dpkg-deb --extract ./Core_Identification_Nodes.deb "$tmp"
bash "$tmp/opt/cin-installer/install-user.sh" "$PWD/Core_Identification_Nodes.deb"
result=$?
rm -rf "$tmp"
exit "$result"
```

The installer checks Python 3, PyGObject, GTK 4, OpenSSL, `dpkg-deb`, and the systemd user manager. It refuses root execution and refuses a partial installation when the dedicated CIN network-scope service cannot be launched.

## Launch

```bash
~/.local/bin/cin-main
```

CIN runs inside `cin-main-lobby.scope`, the dedicated systemd user scope used by the network ON/OFF controller.

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

The switch affects only the CIN systemd user scope through `IPAddressDeny=any`. ON clears that scope's runtime denial. It does not disable the host network, NetworkManager, browsers or other Linux applications.

The switch requires a running systemd user manager and systemd/cgroup support for IP address filtering. CIN does not silently fall back to an unisolated launch.

## Uninstall

```bash
bash ~/.local/opt/cin-main-lobby/uninstall-user.sh
```

Application files and the launcher are removed. User data and publisher configuration are intentionally preserved.
