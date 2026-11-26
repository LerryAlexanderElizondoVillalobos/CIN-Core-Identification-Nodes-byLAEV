# CIN Main — First Installable Release

The first Linux distribution is delivered as **one downloadable artifact: `CIN-Linux-Installer.zip`**. It contains the `CIN.deb` application payload, user-space installer and uninstaller, usage instructions and SHA-256 checksums. The inner `.deb` is not a separate operator download.

## First milestone — Install, launch and navigate

The native GTK 4 application has two screens:

1. **Main Lobby** — the initial application screen.
2. **Settings** — an informational screen opened from the Lobby and equipped with a Back control.

Create opens an informational entry point. Node creation and certificate issuance are not yet implemented. Enter and Import remain disabled.

## User-first installation

CIN is installed by the current desktop user, not by root. The installer does not invoke `sudo`, `apt install`, `dpkg -i` or system package scripts.

- Application: `~/.local/opt/cin-main-lobby/`
- Launcher: `~/.local/bin/cin-main`
- Desktop entry: `~/.local/share/applications/cin-main.desktop`
- Python 3, PyGObject, GTK 4, OpenSSL and dpkg-deb must already be available.

## Build and download

GitHub Actions runs source tests, builds one ZIP installer, verifies its checksums and Debian payload, then installs and launches CIN as an unprivileged user on x86_64 and ARM64 runners. It tests Lobby → Settings → Lobby and uninstalls the application. Only after all gates pass does the workflow publish the **CIN-Linux-Installer** artifact.

The single operator download is `CIN-Linux-Installer.zip`. Do not use earlier `CIN-deb-installer` artifacts or standalone legacy package files.

See:
- [First Installable Release Workplan](WORKPLAN_PHASE_1.md)
- [Development Roadmap](ROADMAP.md)
- [Single Linux Installer](installer/linux/README.md)
- [Installation and Acceptance Test](installer/linux/INSTALLATION_TEST_PLAN.md)
- [Lobby and Settings](lobby/README.md)
- [Settings Screen Specification](lobby/SETTINGS.md)

## Install, launch and remove

Extract `CIN-Linux-Installer.zip`, enter the extracted `CIN-Linux-Installer` directory and run as the normal desktop user:

```bash
sha256sum -c SHA256SUMS
bash install-user.sh ./CIN.deb
~/.local/bin/cin-main
```

Remove:

```bash
bash uninstall-user.sh
```

No user installation or removal step requires root privileges. CI success does not replace manual qualification on the actual target Linux desktop.

## Longer-term scope

The founding certificate processes, local storage and Phase 2 CIN Package Engine remain subsequent implementation work. The first installer does not claim these future capabilities are already operational.

## Current maturity

The single-installer build pipeline has been committed and is awaiting its first successful CI execution. Do not treat the new installer as released until source tests, package validation and both runtime qualification jobs pass.
