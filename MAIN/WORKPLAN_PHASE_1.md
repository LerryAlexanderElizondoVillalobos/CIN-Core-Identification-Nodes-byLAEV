# Phase 1 Workplan — First Installable CIN Main Release

## Milestone objective

Deliver a real, downloadable Debian package named `CIN.deb` that can be installed by the project operator in a Debian-compatible Linux ARM64 environment. The installed application must open the native CIN Main Lobby and demonstrate navigation to the informational Settings screen and back.

This milestone is an installer and application-bootstrap milestone. It does not claim that the founding certificate engines, node creation, Enter, Import or the CIN Package Engine are implemented.

## Technology decision

- **UI:** GTK 4 native desktop interface through Python GObject Introspection (`python3-gi`).
- **Application language:** Python 3.
- **Package:** Debian `.deb`, initially named `CIN.deb`.
- **Package architecture:** `all`, because the application code is architecture-independent Python. GTK 4 and Python are installed from the target distribution's native package repositories. The intended qualification target remains Linux ARM64 / AArch64.
- **Runtime:** system Python 3 and GTK 4; no Electron, Chromium, WebKit, embedded browser, remote assets or application network dependency.
- **Installation:** Debian package manager installs application files and desktop integration. The application itself runs as the logged-in user and does not request root privileges.
- **User data:** future persistent node data belongs under the user's XDG data directory and must not be removed by application upgrades or package removal.

The Debian package is a system-managed installation artifact; this is distinct from the privilege model of the running application. A `.deb` installation normally requires administrator authorization through the package manager.

## Screen behavior included in this milestone

### Main Lobby

- `Welcome to the Main Lobby`
- `Core Identification Nodes`
- `Create` — opens an honest informational entry dialog; it does not claim node creation or certificate issuance is implemented.
- `Enter` — visible and disabled.
- `Import` — visible and disabled.
- Settings icon — opens the separate Settings screen.
- Professional copyright footer and clickable project repository link.

### Settings

Display the application name, project, Phase 1 milestone, Linux ARM64 / AArch64 target, offline startup requirement, current capabilities and clickable repository URL. Display a Back icon with accessible name `Back to Main Lobby`. Back returns to the Lobby. The navigation cycle must work repeatedly without restarting.

Both screens must support resizing and reflow. The Settings content may scroll vertically on compact windows. The interface uses native GTK widgets and system typography.

## Implementation work packages

| ID | Work package | Deliverable | Acceptance |
|---|---|---|---|
| CIN-INS-01 | Native application shell | GTK 4 Python application | Launches a native window without browser runtime |
| CIN-INS-02 | Lobby screen | Lobby UI and actions | Required content appears; Enter and Import disabled |
| CIN-INS-03 | Settings screen | Informational Settings UI | All required information appears accurately |
| CIN-INS-04 | Navigation | Settings and Back handlers | Repeated Lobby → Settings → Lobby navigation succeeds |
| CIN-INS-05 | Debian package layout | Package control, launcher and desktop entry | `dpkg-deb` builds and inspects `CIN.deb` |
| CIN-INS-06 | Dependency declaration | GTK4 and Python runtime dependencies | Package manager resolves dependencies from distribution repositories |
| CIN-INS-07 | GitHub Actions CI | Source, package and UI smoke-test workflow | Workflow installs package in a clean Ubuntu environment and launches it under Xvfb |
| CIN-INS-08 | Downloadable artifact | Workflow artifact named `CIN-deb-installer` containing `CIN.deb` | Artifact uploaded only after successful build, installation and navigation smoke test |
| CIN-INS-09 | ARM64 operator qualification | Manual installation and launch test | Operator installs on target Linux ARM64 / AArch64 environment and reports results |

## GitHub Actions pipeline

1. Check out the repository.
2. Run Python source-contract tests.
3. Install GTK 4, Python GI bindings, Xvfb and Debian packaging tools on the CI runner.
4. Stage the application into the Debian package tree.
5. Build `dist/CIN.deb` with `dpkg-deb`.
6. Inspect package metadata, file list, architecture and dependencies.
7. Validate the desktop entry.
8. Install the package in the clean CI environment.
9. Launch the installed executable under a virtual X display.
10. Execute the application smoke test, which traverses Lobby → Settings → Lobby repeatedly.
11. Purge the package in CI.
12. Upload `CIN.deb` as a downloadable workflow artifact on successful non-PR runs.

A successful CI run proves the package builds, installs and passes the automated UI navigation smoke test on the CI host. It does not prove execution on every ARM64 Linux distribution or Android-hosted Linux environment. Those require operator/device qualification.

## Download and installation test

After a successful workflow run:
1. Open the repository's Actions tab.
2. Open the successful `CIN Main — Build, Test and Package Debian Installer` run.
3. Download the `CIN-deb-installer` artifact.
4. Extract the artifact to obtain `CIN.deb`.
5. On a Debian-compatible ARM64 system, install with the system package manager, for example `sudo apt install ./CIN.deb`.
6. Launch `cin-main` from the application menu or terminal.
7. Open Settings, inspect the information and use Back to return.
8. Repeat the navigation and restart the application.
9. Test offline startup after installation.

The package's architecture is currently `all`; the ARM64 qualification concerns the target system's ability to provide the declared Python and GTK4 dependencies.

## Definition of done

The milestone is complete only when:
- GitHub Actions produces a downloadable `CIN.deb`.
- The package installs cleanly on the qualified target.
- The installed application opens the Lobby.
- Settings opens as a distinct screen.
- Back returns to the Lobby repeatedly.
- The application starts without an Internet connection.
- Enter and Import remain visibly unavailable.
- The Create entry accurately reports that node/certificate workflows are not yet implemented.
- The operator confirms the manual installation and screen test.

## Deferred scope

The three founding certificate processes, authoritative node records, external signing connectors, full Create workflow, Enter, Import and Phase 2 Package Engine remain later work. No success message or UI text may imply they already exist.
