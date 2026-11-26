# CIN Main — First Installable Release

The immediate objective is to produce a downloadable Debian package named **CIN.deb** through GitHub Actions and manually qualify it on a Linux ARM64 / AArch64 environment.

## First milestone — Install, launch and navigate

The first installable release contains a native GTK 4 application with two working screens:

1. **Main Lobby** — the initial application screen.
2. **Settings** — an informational screen opened from the Lobby and equipped with a Back icon that returns to the Lobby.

Create opens an informational entry point and does not claim that node creation or certificate issuance is implemented. Enter and Import remain disabled.

## Technology

- Python 3 and GTK 4 native UI.
- Debian `.deb` package, initially named `CIN.deb`.
- Package architecture `all`; GTK and Python dependencies are supplied by the target Linux distribution.
- Intended operator qualification: Debian-compatible Linux ARM64 / AArch64.
- No Electron, Chromium, WebKit, remote resources or network requirement to open the application.

Package installation is managed by the Debian package manager and may require administrator authorization. The running application operates as the logged-in user.

## Build and download

GitHub Actions runs source tests, builds the package, installs it in CI, launches it under a virtual display and tests Lobby → Settings → Lobby navigation. A successful non-PR run uploads a downloadable artifact named **CIN-deb-installer**, containing `CIN.deb`.

See:
- [First Installable Release Workplan](WORKPLAN_PHASE_1.md)
- [Development Roadmap](ROADMAP.md)
- [Linux Debian Installer](installer/linux/README.md)
- [Operator Installation and Acceptance Test](installer/linux/INSTALLATION_TEST_PLAN.md)
- [Lobby and Settings](lobby/README.md)
- [Settings Screen Specification](lobby/SETTINGS.md)

## Operator test

Download the `CIN-deb-installer` artifact from a successful workflow run, extract `CIN.deb`, and install it on the target:

```bash
sudo apt install ./CIN.deb
cin-main
```

Open Settings, inspect the information, use Back, repeat the navigation and test offline startup. ARM64 compatibility is only confirmed after this manual target test; CI success on another architecture is not sufficient.

## Longer-term Phase 1

After the installer milestone is qualified, continue with local storage and the three founding processes:
1. Genesis Environment Certificate → Genesis Environment Manifest.
2. CIN Node Birth Certificate → authoritative Node Birth Record and technical node identifiers.
3. CIN Global Personal Document and Node Marriage Certificate → deterministic document identifier and separately verified association.

## Phase 2 — CIN Package Engine

A separate installer and product layer for the engine of engines. It is not included in the first Lobby package.

## Current maturity

The GTK4 application source and Debian packaging scaffold are present. The first CI build, package installation, automated UI smoke test and operator ARM64 installation remain to be executed and verified. Do not describe the release as tested until those checks have passed.
