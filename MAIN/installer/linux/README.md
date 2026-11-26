# CIN Main Lobby — Linux Application Installer

## First milestone

Build and distribute a Linux-installable desktop application whose first screen is the CIN Main Lobby.

Visible interface:

- **Welcome to Core Identification Nodes**
- **Create** — active; opens the initial creation flow.
- **Enter** — visible, inactive until its milestone.
- **Import** — visible, inactive until its milestone.

The installer must install the application and provide a launcher in the target Linux desktop environment. This milestone is about getting the Lobby application installed and opened; it does not yet create a fully registered CIN node.

## Platform strategy

The initial package target is Linux ARM64 / AArch64, including Debian-compatible Linux userspaces used by Android environments such as LinDesk. The package format and dependency list must match the selected application technology and target distributions. Do not assume that every Linux distribution is Debian-based or supports .deb.

The application should not require virtualization as a product feature. Validate separately in Android-hosted Linux userspace and virtualized ARM64 Linux. Desktop display integration is a runtime requirement and must be tested in the actual environment.

## Installer responsibilities

1. Install the application files and runtime dependencies.
2. Register a launchable application entry where the desktop environment supports it.
3. Start the CIN Main Lobby.
4. Keep application files separate from future persistent CIN node data.
5. Support upgrade and removal without silently deleting user-created node data.

## Out of scope for this milestone

- Genesis Environment Certificate.
- CIN Node Birth Certificate.
- CIN Global Personal Document and Node Marriage Certificate.
- Enter and Import workflows.
- CIN Package Engine (Phase 2).

The three founding certificate processes are planned for later integration into the Create flow.