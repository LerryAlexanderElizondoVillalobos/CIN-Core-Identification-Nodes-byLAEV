# Core Identification Nodes — Official Debian Acceptance Test

## Artifact

The sole official downloadable package is `Core_Identification_Nodes.deb`. The Debian package metadata must identify package `core-identification-nodes`, version `0.3.0`, architecture `all`. The Python application is architecture-independent and must be qualified on ARM64/AArch64.

## 1. Inspect package contents

```bash
dpkg-deb --field Core_Identification_Nodes.deb Package Version Architecture
dpkg-deb --contents Core_Identification_Nodes.deb
```

The payload must include:
- `opt/cin-main-lobby/cin_main.py`
- `opt/cin-main-lobby/settings/deployment/engine.py`
- `opt/cin-main-lobby/settings/network_access.py`

## 2. Install as a normal user

Do not use root, sudo, apt install or dpkg -i.

```bash
tmp="$(mktemp -d)"
dpkg-deb --extract ./Core_Identification_Nodes.deb "$tmp"
bash "$tmp/opt/cin-installer/install-user.sh" "$PWD/Core_Identification_Nodes.deb"
result=$?
rm -rf "$tmp"
exit "$result"
```

Expected application paths:
- `~/.local/opt/cin-main-lobby/`
- `~/.local/bin/cin-main`
- `~/.local/share/applications/cin-main.desktop`

## 3. Lindesk-like environment qualification

Use a normal non-root account on ARM64 with Debian-compatible dpkg, Python 3, PyGObject, GTK 4 and OpenSSL. The test environment may have no systemd user manager, no visible cgroup mount, restricted PID 1 information, and no active GUI session.

Expected:
- Installation succeeds without sudo or system-wide writes.
- The installer does not call systemctl, systemd-run, apt, or dpkg -i.
- Installed files remain under the user's home directory.
- GUI launch is attempted only from an available graphical session.
- Network isolation is reported unavailable when its backend is absent; no false enforcement claim is made.

## 4. Launch and navigation

From a graphical session:

```bash
~/.local/bin/cin-main
```

Verify Main Lobby opens first, Settings opens from its control, and Back returns to Main Lobby.

## 5. Deploy

Generate the local manifest and verify that component hashes and build fingerprint are stable. Provision the genuine publisher Ed25519 public key independently and publish a signed official manifest before attempting remote deployment. Without those trust materials, the application must report Deploy as not configured and must not apply remote code.

## 6. Network isolation

On hosts with a supported systemd user manager and cgroup IP filtering:
- Confirm CIN runs in `cin-main-lobby.scope`.
- Turn CIN network access OFF and verify that a process in the CIN scope cannot reach IP endpoints.
- Verify a process outside the CIN scope retains connectivity.
- Turn CIN network access ON and verify connectivity is restored for CIN.
- Confirm the switch does not invoke NetworkManager or alter host-wide networking.

On hosts without that backend, confirm the control is disabled and its state is explicitly unavailable.

## 7. Upgrade and uninstall

Verify an application replacement preserves `~/.local/share/cin-main-lobby` and `~/.config/cin-main-lobby`. Uninstall using:

```bash
bash ~/.local/opt/cin-main-lobby/uninstall-user.sh
```

Verify application files and launcher are removed while user data and publisher configuration remain.

## 8. Release acceptance

A release requires passing source tests, ARM64 package inspection, normal-user installation on a systemd-free environment, GUI launch where available, network backend positive/negative qualification, and uninstall/data-preservation tests.
