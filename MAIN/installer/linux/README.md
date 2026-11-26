# CIN Main — User-Space Debian Installer

## Objective

Build a downloadable Debian archive named `CIN.deb` that carries the first functional CIN Main Lobby application. A normal desktop user installs it into their own home directory without root privileges, `sudo`, system package-manager installation or writes to system directories.

## Application technology

- Python 3.
- GTK 4 native desktop interface through PyGObject (`python3-gi`).
- System GTK 4 runtime; no bundled browser engine.
- No Electron, Chromium, WebKit, remote assets or network dependency for application startup.

The Python application is architecture-independent and the archive declares `Architecture: all`. Python 3, PyGObject and GTK 4 must already be available to the user from the target Linux distribution. The installer checks these prerequisites and does not attempt privileged dependency installation.

## User-space installation model

The `.deb` is a payload container, not a system package installation request. The included script uses `dpkg-deb --extract` and copies files only into the current user's home directory:

- Application: `~/.local/opt/cin-main-lobby/`
- Launcher: `~/.local/bin/cin-main`
- Desktop entry: `~/.local/share/applications/cin-main.desktop`

The installer refuses to run as root. It does not invoke `apt install`, `dpkg -i`, `sudo` or system package scripts. The running Lobby also operates as the logged-in user.

## Download bundle

A successful GitHub Actions run publishes the `CIN-deb-installer` artifact containing:
- `CIN.deb` — architecture-independent application payload.
- `install-user.sh` — per-user installer.
- `uninstall-user.sh` — per-user uninstaller.

## Install

Extract the downloaded artifact ZIP, open a terminal in the extracted directory and run as the normal desktop user:

```bash
bash install-user.sh ./CIN.deb
```

Launch:

```bash
~/.local/bin/cin-main
```

The desktop entry is registered under the user's local applications directory. Some desktop environments may need their application menu refreshed or the user session restarted before showing a newly created entry.

## Remove

Run as the same normal desktop user:

```bash
bash uninstall-user.sh
```

This removes only CIN application files and its per-user launcher/desktop entry. It does not use `sudo`, alter system package databases or remove future CIN user data stored outside the application directory.

## Build and CI

GitHub Actions may use administrator privileges on disposable hosted runners to provision GTK/Python test dependencies. This is CI infrastructure setup only and is not part of the CIN user installation process.

The CI runtime qualification:
1. Builds `CIN.deb` and the two user-space scripts.
2. Runs the installer as the unprivileged CI user.
3. Confirms installed paths are under that user's home directory.
4. Launches the installed application under Xvfb and executes the Lobby → Settings → Lobby smoke test.
5. Runs the uninstaller as the same user.
6. Confirms the application files and desktop entry are removed.

The user-space installation steps must never invoke `sudo`, `apt install`, `dpkg -i`, `dpkg --install` or write outside the user's home directory.

## Qualification target

The workflow tests x86_64 and ARM64 Linux runners. Manual qualification is still required on the operator's actual Debian-compatible Linux ARM64 / AArch64 environment, especially for desktop-menu integration, display scaling and portrait/landscape behavior.

## Current milestone limitations

Create remains informational; node creation and certificate issuance are not implemented. Enter and Import remain disabled. The founding certificate processes and CIN Package Engine are outside this installer milestone.
