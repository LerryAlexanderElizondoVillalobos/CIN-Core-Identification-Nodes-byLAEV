# CIN Main Lobby

## First-screen specification

The application opens directly into a minimal Main Lobby with a single flat background color and text-only content.

**Title:** `Welcome to the Main Lobby`

**Subtitle:** `Core Identification Nodes`

**Actions:**
- **Create** — enabled; opens the initial node-creation flow.
- **Enter** — visible but inactive in the first milestone.
- **Import** — visible but inactive in the first milestone.

A subtle **Settings** icon is placed in one corner. Activating it opens the dedicated Settings screen described below.

## Settings screen

Settings is a distinct application screen, not a modal placeholder or tooltip. Its first milestone is informational and read-only.

### Information displayed

**Application Information**
- Application: `CIN Main Lobby`
- Project: `Core Identification Nodes byLAEV`
- Application phase: `Phase 1 — Main Lobby`
- Milestone: `Milestone 1 — Lobby and Settings Navigation`
- Target platform: `Linux ARM64 / AArch64`
- Network requirement: `Not required to open the application`

**Current Capabilities**
- Create: available entry point; the creation workflow must report its actual implementation state.
- Enter: not available in this milestone.
- Import: not available in this milestone.

**Project Repository**
- Display the full repository URL:
  `https://github.com/LerryAlexanderElizondoVillalobos/CIN-Core-Identification-Nodes-byLAEV`
- Make the URL clickable where supported by the selected toolkit.

Do not display fabricated version numbers, unmeasured performance figures, pretend toggles or nonfunctional preference controls.

## Screen navigation

1. The application launches into the Main Lobby.
2. Selecting the Settings icon navigates to the Settings screen.
3. Settings displays a small Back icon (left arrow) in its top navigation area.
4. The Back icon returns to the Main Lobby.
5. The navigation cycle can be repeated without restarting the application.
6. The Back control has an accessible name or tooltip: `Back to Main Lobby`.
7. Resizing or changing orientation must not reset the active screen.

## Visual and resource constraints

- One solid background color; no image or video backgrounds.
- Text and basic controls only.
- No decorative illustrations, gradients, blur, heavy shadows or animation.
- Avoid loading remote assets or requiring network access to render either screen.
- Prefer a small native UI toolkit and minimal runtime dependencies.
- Keep the interface visually restrained and fast to render.

## Adaptive layout

The Lobby and Settings screens must support both landscape and portrait orientations and must reflow to the available window dimensions. They must not enforce a single aspect ratio.

The title, subtitle, actions, Settings control, Settings sections, Back control and footer must remain accessible. Avoid clipping and unnecessary horizontal scrolling. On very small screens, vertical scrolling is acceptable. Window resizing and orientation changes must update the layout without restarting the application.

## Professional footer

Display:
- `© 2026 Core Identification Nodes byLAEV. All rights reserved.`
- Project attribution: `Core Identification Nodes`
- Repository: `https://github.com/LerryAlexanderElizondoVillalobos/CIN-Core-Identification-Nodes-byLAEV`

The repository reference should be a clickable link where supported by the selected toolkit.

## Create action — first increment

Create opens a dedicated initial creation view and provides a return path to the Lobby. It must not invent node identifiers, certificates, authorization, signatures or completed records.

Subsequent increments will implement the three founding processes inside this Create flow:
1. Genesis Environment Certificate and Genesis Environment Manifest.
2. CIN Node Birth Certificate and authoritative Node Birth Record.
3. CIN Global Personal Document and Node Marriage Certificate.

## Lifecycle boundary

Launching or installing the Lobby does not create a node. Clicking Create enters the creation flow; node birth is only complete after the relevant certificate process is implemented and its authoritative record is persisted and verified.

The CIN Package Engine is Phase 2 and is not part of the Main Lobby.
