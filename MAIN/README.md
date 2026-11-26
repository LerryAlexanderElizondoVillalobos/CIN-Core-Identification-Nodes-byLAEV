# CIN Main — First Installable Release

The immediate objective is to produce a downloadable **CIN.deb** payload and a user-space installer bundle through GitHub Actions, then manually qualify it on Linux ARM64 / AArch64.

## First milestone — Install, launch and navigate

The first installable release contains a native GTK 4 application with two working screens:

1. **Main Lobby** — the initial application screen.
2. **Settings** — an informational screen opened from the Lobby and equipped with a Back icon that returns to the Lobby.

Create opens an informational entry point and does not claim that node creation or certificate issuance is implemented. Enter and Import remain disabled.

## User-first installation model

CIN is installed by the current desktop user, not by root.

- No `sudo`, root shell, `apt install ./CIN.deb` or `dpkg -i` for CIN.
- Application files: `~/.local/opt/cin-main-lobby/`
- Launcher: `~/.local/bin/cin-main`
- Desktop entry: `~/.local/share/applications/cin-main.desktop`
- The installer extracts the `.deb` payload with `dpkg-deb --extract` and writes only inside the user's home directory.
- Python 3, PyGObject and GTK 4 must already be available to the user. The installer checks them and does not attempt privileged dependency installation.
- The running application operates as the logged-in user.

## Technology

- Python 3 and GTK 4 native UI.
- Debian `.deb` payload named `CIN.deb`, architecture `all`.
- Intended operator qualification: Debian-compatible Linux ARM64 / AArch64.
- No Electron, Chromium, WebKit, remote resources or network requirement to open the application.

## Build and download

GitHub Actions runs source tests, builds the payload and user installer scripts, installs CIN into the CI user's home directory on x86_64 and ARM64 runners, launches it under a virtual display and tests Lobby → Settings → Lobby navigation. A successful non-PR run uploads **CIN-deb-installer**, containing `CIN.deb`, `install-user.sh` and `uninstall-user.sh`.

See:
- [First Installable Release Workplan](WORKPLAN_PHASE_1.md)
- [Development Roadmap](ROADMAP.md)
- [Linux User-Space Installer](installer/linux/README.md)
- [Operator Installation and Acceptance Test](installer/linux/INSTALLATION_TEST_PLAN.md)
- [Lobby and Settings](lobby/README.md)
- [Settings Screen Specification](lobby/SETTINGS.md)

## Operator installation

Extract the downloaded artifact ZIP. From that directory, run as the normal desktop user:

```bash
bash install-user.sh ./CIN.deb
```

Launch:

```bash
~/.local/bin/cin-main
```

Remove:

```bash
bash uninstall-user.sh
```

None of these user operations requires root privileges or `sudo`. ARM64 compatibility is only confirmed after manual qualification on the actual target; CI success alone is not sufficient.

## Longer-term Phase 1

After the installer milestone is qualified, continue with local storage and the three founding processes:
1. Genesis Environment Certificate → Genesis Environment Manifest.
2. CIN Node Birth Certificate → authoritative Node Birth Record and technical node identifiers.
3. CIN Global Personal Document and Node Marriage Certificate → deterministic document identifier and separately verified association.

## Phase 2 — CIN Package Engine

A separate installer and product layer for the engine of engines. It is not included in the first Lobby package.

## Current maturity

The GTK4 application source and Debian user-space packaging scaffold are present. The first no-root CI installation, automated UI smoke test and operator ARM64 installation remain to be executed and verified. Do not describe the release as tested until those checks have passed.
