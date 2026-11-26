# CIN.deb — Operator Installation and Acceptance Test

## Purpose

This checklist records the first manual installation of the CIN Main Lobby package on the operator's actual Linux environment. CI validation and device qualification are separate results.

## 1. Record the target environment

Before installation, record:

- Distribution and release:
- CPU architecture (`uname -m`):
- Debian package architecture (`dpkg --print-architecture`):
- Desktop environment or Android-hosted Linux environment:
- Display session (`echo "$XDG_SESSION_TYPE"`):
- GTK 4 availability:
- Test date:

The intended ARM64 target reports `aarch64` from `uname -m` and `arm64` from `dpkg --print-architecture`.

## 2. Obtain the package

1. Open the repository's GitHub Actions page.
2. Select the latest successful run of **CIN Main — Build, Test and Package Debian Installer**.
3. Confirm that source tests, package build, x86_64 runtime qualification and ARM64 runtime qualification succeeded.
4. Download the **CIN-deb-installer** artifact.
5. Extract the artifact ZIP and locate `CIN.deb`.

Do not install a candidate artifact from a failed or incomplete workflow run.

## 3. Inspect and install

Inspect the package:

```bash
dpkg-deb --info CIN.deb
dpkg-deb --field CIN.deb Package Version Architecture Depends
```

Expected package metadata:
- Package: `cin-main-lobby`
- Version: `0.1.0`
- Architecture: `all`
- GTK 4 and Python GI dependencies declared.

Install using the Debian package manager:

```bash
sudo apt install ./CIN.deb
```

Confirm installation:

```bash
dpkg-query -W cin-main-lobby
command -v cin-main
```

## 4. Launch and test the Lobby

Launch from the desktop application menu or run:

```bash
cin-main
```

Verify:
- The application opens a native desktop window.
- The Lobby displays **Welcome to the Main Lobby**.
- The subtitle displays **Core Identification Nodes**.
- Create, Enter and Import are visible.
- Enter and Import are disabled.
- Create opens an informational message that accurately states node creation and certificate issuance are not implemented in this milestone.
- The repository link is clickable.
- The copyright footer is visible.

## 5. Test Settings navigation

1. Select the Settings icon.
2. Confirm that a distinct Settings screen appears.
3. Confirm Application Information, Current Capabilities and Project Repository sections are visible.
4. Confirm the target platform and offline startup information are displayed.
5. Select the Back arrow.
6. Confirm that the Main Lobby returns.
7. Repeat the Settings → Back cycle at least five times.
8. Resize the window and repeat the navigation in landscape and portrait layouts where the environment permits.

## 6. Restart and offline test

1. Close the application normally.
2. Disconnect the network.
3. Launch `cin-main` again.
4. Confirm that the Lobby opens without network access.
5. Open Settings and return to the Lobby.
6. Restore network connectivity after the test.

The repository link requires connectivity when activated; the two application screens must not require network access to render.

## 7. Removal test

If this is a disposable test installation, remove the application:

```bash
sudo apt remove cin-main-lobby
```

Do not use package purge as the normal uninstall instruction once persistent CIN user records exist. Application removal must not delete user node data.

## 8. Acceptance record

| Test | Result | Notes |
|---|---|---|
| Package metadata inspection | Pending | |
| Package installation | Pending | |
| Native Lobby launch | Pending | |
| Settings screen opens | Pending | |
| Back returns to Lobby | Pending | |
| Five navigation cycles | Pending | |
| Landscape/portrait layout | Pending | |
| Application restart | Pending | |
| Offline startup | Pending | |
| Application removal | Pending | |

**Overall result:** Pending operator test.

A successful CI run does not fill this acceptance record automatically. The operator must record the result from the actual target device.
