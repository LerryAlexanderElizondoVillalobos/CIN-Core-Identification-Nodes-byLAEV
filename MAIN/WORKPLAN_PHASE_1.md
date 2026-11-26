# Phase 1 Workplan — CIN Main Lobby Application

## Immediate milestone: Minimal, adaptive two-screen application

**Objective:** deliver a lightweight Linux-installable application that opens the CIN Main Lobby and provides a working navigation path to a read-only Settings screen and back. The first screen uses a single flat background color, text-only content and minimal controls. Avoid decorative images, video, animation, gradients, blur, shadows and expensive visual effects.

### Lobby screen content

- Main title: `Welcome to the Main Lobby`
- Subtitle: `Core Identification Nodes`
- Three plain-text actions: `Create`, `Enter`, `Import`
- A subtle Settings icon in one corner.
- Professional footer:
  `© 2026 Core Identification Nodes byLAEV. All rights reserved.`
- Clickable project repository:
  `https://github.com/LerryAlexanderElizondoVillalobos/CIN-Core-Identification-Nodes-byLAEV`

### Lobby behavior

- **Create:** the only active primary action; opens the initial creation flow.
- **Enter:** visible and inactive until its milestone.
- **Import:** visible and inactive until its milestone.
- **Settings:** opens the Settings screen defined below.

## Settings screen — first increment

Settings must be a real, separately rendered application screen, not a tooltip, modal placeholder or static illustration.

### Required content

- Screen title: `Settings`
- Section: `Application Information`
  - Application: `CIN Main Lobby`
  - Project: `Core Identification Nodes byLAEV`
  - Application phase: `Phase 1 — Main Lobby`
  - Milestone: `Milestone 1 — Lobby and Settings Navigation`
  - Target platform: `Linux ARM64 / AArch64`
  - Network requirement: `Not required to open the application`
- Section: `Current Capabilities`
  - `Create` — available entry point; the creation workflow must accurately show its actual implementation state.
  - `Enter` — not available in this milestone.
  - `Import` — not available in this milestone.
- Section: `Project Repository`
  - Display the full repository URL as a clickable link where supported.

This first Settings screen is informational. Do not add pretend toggles, nonfunctional preferences, fabricated version numbers, unmeasured resource figures or configuration controls without implemented behavior.

### Settings navigation

- The Lobby Settings icon opens the Settings screen.
- Settings displays a small, recognizable Back icon (left arrow) in the top navigation area.
- Activating Back returns to the Lobby.
- The return path must work repeatedly without restarting the application.
- Window resizing and orientation changes must preserve the current screen and keep its controls accessible.
- The Back icon must have an accessible name or tooltip: `Back to Main Lobby`.

## Adaptive display requirement

Both screens must adapt to landscape and portrait orientations and differing aspect ratios. Layout must use available width and height rather than a fixed aspect ratio or fixed-size canvas.

Acceptance requirements:
- Landscape and portrait both supported.
- Layout reflows when available width/height changes.
- No clipped title, section, action, navigation control or footer.
- No unnecessary horizontal scrolling.
- Text and action hit areas remain legible and usable at supported display scaling.
- Reorientation and window resizing do not require restarting the application.
- The active screen remains the active screen after a resize.

## Work breakdown

| ID | Work item | Deliverable | Acceptance criteria |
|---|---|---|---|
| M1-01 | Lightweight Linux application baseline | Runnable application skeleton | Starts in supported Linux desktop session; clean exit. |
| M1-02 | Minimal Lobby screen | Flat-color, text-only Lobby | Exact title/subtitle/actions and professional footer. |
| M1-03 | Adaptive layout | Landscape/portrait responsive layout | Passes orientation, aspect-ratio, resizing and small-window checks. |
| M1-04 | Lobby actions | Create, Enter, Import and Settings | Create opens its initial flow; Enter/Import remain inactive; Settings navigates to its own screen. |
| M1-05 | Settings information screen | Read-only application information | Required information is displayed accurately; no fake controls or invented values. |
| M1-06 | Two-screen navigation | Lobby → Settings → Lobby | Settings icon and Back icon work repeatedly without restarting. |
| M1-07 | Professional footer | Copyright and repository attribution | Displays copyright, byLAEV attribution and clickable repository URL. |
| M1-08 | Linux packaging | Installable Linux package | Installs, creates launcher and opens Lobby; target format and architecture documented. |
| M1-09 | GitHub Actions | Build and specification workflow | CI checks both screen contracts and navigation requirements; runtime tests added with implementation. |
| M1-10 | First milestone release | Downloadable artifact | Artifact attached to successful workflow and tested on at least one target Linux environment. |

## Resource and implementation principles

- Prefer a small native toolkit/runtime over a bundled browser engine or large framework.
- Prefer native text and basic controls.
- Use one solid background color; avoid background images, SVG decoration, video, animation, gradients, blur and drop shadows.
- Load no remote resources and require no network connection to open either screen.
- Keep dependencies explicit and minimal; measure actual package size and idle memory instead of claiming savings without measurements.

## Deferred work

- Full Genesis Environment Certificate and Manifest process.
- CIN Node Birth Certificate and authoritative Node Birth Record.
- CIN Global Personal Document and Node Marriage Certificate.
- Enter existing node workflow.
- Import node/package workflow.
- Editable application preferences until each preference has a defined and implemented behavior.
- CIN Package Engine (Phase 2).

These are not represented as implemented in this milestone. The three founding certificate processes are planned for later integration into the Create flow.

## GitHub Actions progression

1. Validate source, project metadata and both screen-content contracts.
2. Build the application on the selected Linux architecture.
3. Run unit tests for screen navigation and enabled/disabled actions.
4. Run layout tests at landscape, portrait, compact and expanded viewport sizes.
5. Build and inspect the Linux package.
6. Run package installation and launch smoke tests.
7. Upload the artifact only after required checks pass.

CI specification checks do not replace runtime UI tests. A LinDesk compatibility claim requires an actual device test.

## Completion criteria

The first milestone is complete when the user can install and launch the lightweight application, see the Lobby, open a distinct informational Settings screen, return using its Back icon, and use both screens in landscape and portrait orientations without clipped or inaccessible content. Create is the only active primary Lobby action. No certificate process is claimed complete.
