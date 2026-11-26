# CIN Main — Debian Installer

## Objective

Build a downloadable Debian package named `CIN.deb` that installs the first functional CIN Main Lobby application, including its informational Settings screen and return navigation.

## Application technology

- Python 3.
- GTK 4 native desktop interface through `python3-gi`.
- System GTK 4 runtime; no bundled browser engine.
- No Electron, Chromium, WebKit, remote assets or network dependency for application startup.

The Python application is architecture-independent and the initial package declares `Architecture: all`. The intended manual qualification target is Debian-compatible Linux ARM64 / AArch64. GTK 4 and Python runtime dependencies are supplied by the target distribution.

## Package contents

- CIN Main Lobby application source.
- `cin-main` command launcher.
- Desktop application entry.
- Debian package metadata and declared dependencies.
- No node records, personal data, private signing keys or publisher secrets.

## Installation model

The `.deb` is installed and managed by the system package manager. Installing a Debian package that writes under system directories normally requires administrator authorization. This is an installation-time package-manager operation; the running CIN application must run as the logged-in user and must not request root privileges.

The application must keep future persistent node data separate from replaceable application files. Package upgrades and removal must not silently delete user node data.

## Build pipeline

The GitHub Actions workflow:
1. Runs source-contract tests.
2. Installs GTK 4 and Debian packaging tools on the runner.
3. Stages the application and launcher.
4. Builds `dist/CIN.deb`.
5. Inspects package metadata and contents.
6. Validates the desktop entry.
7. Installs the package in the CI environment.
8. Launches the installed application under Xvfb.
9. Runs the Lobby → Settings → Lobby smoke test.
10. Uploads the package as the `CIN-deb-installer` artifact on successful non-PR runs.

## Operator installation

After downloading and extracting the workflow artifact:

```bash
sudo apt install ./CIN.deb
cin-main
```

The application should also appear in the desktop application menu where the desktop environment supports the installed desktop entry.

To remove the application package:

```bash
sudo apt remove cin-main-lobby
```

Package removal must not remove user node data. Do not run `purge` as the normal user uninstall instruction if future persistent records may exist.

## Manual qualification

Use the [Operator Installation and Acceptance Test](INSTALLATION_TEST_PLAN.md) to record the actual target-device result.

- Install on the intended Debian-compatible Linux ARM64 / AArch64 environment.
- Launch the application.
- Open Settings from the Lobby.
- Review application information and capability status.
- Use Back to return to the Lobby.
- Repeat the navigation.
- Close and relaunch the application.
- Test application startup with network disconnected.
- Record distribution version, desktop environment, architecture, package result and any display/runtime issue.

## Current milestone limitations

Create displays an informational entry point only. The founding certificate workflows and node creation are not implemented by this milestone. Enter and Import remain disabled. The CIN Package Engine belongs to Phase 2.
