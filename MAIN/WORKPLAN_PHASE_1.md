# Phase 1 Workplan — First Installable CIN Main Release

## Milestone objective

Deliver one downloadable `CIN-Linux-Installer.zip` artifact. It contains the `CIN.deb` application payload, user-space installer, uninstaller, instructions and checksums. The inner `.deb` is not a separate operator download. A normal desktop user must be able to install, launch, navigate, update and remove CIN without root privileges, `sudo`, system package-manager installation or writes to system directories.

The installed application must open the native CIN Main Lobby and demonstrate navigation to the informational Settings screen and back.

This milestone is an installer and application-bootstrap milestone. It does not claim that the founding certificate engines, node creation, Enter, Import or the CIN Package Engine are implemented.

## Technology decision

- **UI:** GTK 4 native desktop interface through Python GObject Introspection (`python3-gi`).
- **Application language:** Python 3.
- **Package:** Debian `.deb` application payload named `CIN.deb`.
- **Package architecture:** `all`, because the application code is architecture-independent Python.
- **Runtime prerequisites:** Python 3, PyGObject and GTK 4 must already be available to the user from the target Linux distribution. The installer checks these prerequisites and does not install system dependencies.
- **Installation model:** extract the Debian archive with `dpkg-deb --extract` and copy the application into the current user's XDG home-directory space. Do not use `apt install`, `dpkg -i`, root shells or `sudo`.
- **User paths:** application under `~/.local/opt/cin-main-lobby`, launcher under `~/.local/bin`, desktop entry under `~/.local/share/applications`.
- **Runtime:** system Python 3 and GTK 4; no Electron, Chromium, WebKit, embedded browser, remote assets or application network dependency.
- **User data:** future persistent node data belongs under the user's XDG data directory and must not be removed by application upgrades or application uninstall.

The `.deb` is used as a portable payload container, not registered as a system package. This is intentional: standard system-wide Debian package installation normally requires administrator authorization and is not the CIN user installation model.

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
| CIN-INS-05 | Debian payload | Architecture-independent `CIN.deb` containing application files under `/opt/cin-main-lobby` | `dpkg-deb` builds and extracts the payload |
| CIN-INS-06 | User-space installer | Installer and uninstaller scripts | Installs only under the current user's home directory and refuses root execution |
| CIN-INS-07 | GitHub Actions CI | Source, package and UI smoke-test workflow | Runs the user installer as an unprivileged account and launches under Xvfb |
| CIN-INS-08 | Single downloadable artifact | `CIN-Linux-Installer.zip` containing the payload, scripts, instructions and checksums | Uploaded only after successful x86_64 and ARM64 runtime tests |
| CIN-INS-09 | ARM64 operator qualification | Manual installation and launch test | Operator installs on target Linux ARM64 / AArch64 without root and reports results |

## GitHub Actions pipeline

1. Check out the repository.
2. Run Python source-contract tests.
3. Provision GTK 4, Python GI bindings, Xvfb and Debian packaging tools on disposable CI runners. CI provisioning may use runner administrator permissions; this is not part of the user installer.
4. Build `dist/CIN-Linux-Installer.zip` as the sole distributable artifact; keep `CIN.deb` inside it as the payload.
5. Inspect package metadata and payload.
6. Download the artifact on x86_64 and ARM64 runners.
7. Provision CI runtime prerequisites.
8. Run `install-user.sh` as the unprivileged CI user.
9. Verify all installed application paths are under that user's home directory.
10. Launch the installed executable under a virtual X display.
11. Execute the application smoke test, traversing Lobby → Settings → Lobby.
12. Run the user-space uninstaller and verify application files are removed.
13. Upload the bundle as a downloadable workflow artifact on successful non-PR runs.

The workflow must not use `apt install ./CIN.deb` or `dpkg -i` to install CIN. The CI runner may use privileged package installation only to provision its own test dependencies.

## Download and installation test

After a successful workflow run:
1. Open the repository's Actions tab.
2. Open the successful `CIN Main — Build, Test and Package Linux Installer` run.
3. Download the `CIN-deb-installer` artifact.
4. Extract the artifact ZIP to obtain `CIN.deb`, `install-user.sh` and `uninstall-user.sh`.
5. As the normal desktop user, run `bash install-user.sh ./CIN.deb`.
6. Launch `~/.local/bin/cin-main` or select CIN Main Lobby from the user's application menu.
7. Open Settings, inspect the information and use Back to return.
8. Repeat navigation and restart the application.
9. Test offline startup.
10. Remove CIN with `bash uninstall-user.sh`, as the same user.

No step in the user installation or removal procedure requires root privileges or `sudo`.

## Definition of done

The milestone is complete only when:
- GitHub Actions produces the downloadable user installer bundle.
- The installer runs as a normal user and refuses root execution.
- All installed application files remain under the user's home directory.
- No system package database or system directories are modified by CIN's installer.
- The installed application opens the Lobby.
- Settings opens as a distinct screen.
- Back returns to the Lobby repeatedly.
- The application starts without an Internet connection.
- Enter and Import remain visibly unavailable.
- The Create entry accurately reports that node/certificate workflows are not yet implemented.
- The uninstaller removes application files without deleting future CIN user data.
- The operator confirms the manual installation and screen test on the ARM64 target.

## Deferred scope

The three founding certificate processes, authoritative node records, external signing connectors, full Create workflow, Enter, Import and Phase 2 Package Engine remain later work. No success message or UI text may imply they already exist.
