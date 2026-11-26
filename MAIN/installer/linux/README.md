# CIN Main — Single Linux Installer

The only distributable download is **CIN-Linux-Installer.zip**. It contains the Debian payload, the user-space installer, the uninstaller, usage instructions and SHA-256 checksums. The inner `CIN.deb` is a payload container; it is not a separate operator download.

## Install

Extract the ZIP and run as the normal desktop user:

```bash
cd CIN-Linux-Installer
sha256sum -c SHA256SUMS
bash install-user.sh ./CIN.deb
```

The installer extracts the payload and installs it under `~/.local/opt/cin-main-lobby`; it does not use `sudo`, `apt install`, `dpkg -i` or system package scripts. Python 3, PyGObject, GTK 4, OpenSSL and dpkg-deb must already be available.

## Launch

```bash
~/.local/bin/cin-main
```

The initial screen is Main Lobby. Settings is opened only from the Settings control in the Lobby.

## Bootstrap migration

This package replaces the previous application payload and refreshes the launcher. Operator data and configuration in `~/.local/share/cin-main-lobby` and `~/.config/cin-main-lobby` are preserved.

## Uninstall

```bash
bash uninstall-user.sh
```

Application files and launcher are removed. Operator data and publisher configuration remain in place.
