# CIN Main Lobby — Linux Application Installer

## First milestone

Build and distribute a lightweight Linux-installable desktop application whose first screen is the CIN Main Lobby.

The application opens directly to a flat-color, text-only screen:
- Title: **Welcome to the Main Lobby**
- Subtitle: **Core Identification Nodes**
- Three plain-text actions: **Create**, **Enter**, **Import**
- A subtle **Settings** icon in one corner
- A professional footer with copyright, byLAEV attribution and repository reference

Only Create is active in this milestone. Enter and Import remain visible but inactive. Settings must not expose controls that are not implemented.

## Resource strategy

Prefer a small native UI toolkit and minimal runtime dependencies. Avoid bundling a browser engine or large application framework unless a measured technical requirement justifies it. No decorative images, videos, animations, gradients, blur or shadow effects. The Lobby must render without network access. Measure package size and idle memory during qualification; do not assert unmeasured performance figures.

## Adaptive display

Support landscape and portrait orientations, variable aspect ratios, window resizing and display scaling. The layout must reflow based on available dimensions; no fixed-aspect canvas. Prevent clipped text and inaccessible controls. Vertical scrolling may be used on very small displays.

## Platform strategy

The initial package target is Linux ARM64 / AArch64, including Debian-compatible Linux userspaces used by Android environments such as LinDesk. The package format and dependency list must match the selected application technology and target distributions. Do not assume every Linux distribution is Debian-based or supports .deb.

The application must not require virtualization as a product feature. Validate separately in Android-hosted Linux userspace and virtualized ARM64 Linux. Desktop display integration is a runtime requirement and must be tested in the actual environment.

## Installer responsibilities

1. Install application files and declared runtime dependencies.
2. Register a launchable application entry where supported.
3. Launch the CIN Main Lobby directly.
4. Keep application files separate from future persistent CIN node data.
5. Support upgrade and removal without silently deleting user-created node data.

## Out of scope

- Genesis Environment Certificate.
- CIN Node Birth Certificate.
- CIN Global Personal Document and Node Marriage Certificate.
- Enter and Import workflows.
- CIN Package Engine (Phase 2).
