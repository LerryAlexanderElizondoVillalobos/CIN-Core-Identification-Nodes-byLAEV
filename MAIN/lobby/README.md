# CIN Main Lobby

## First-screen specification

The application opens directly into a minimal Main Lobby with a single flat background color and text-only content.

**Title:** `Welcome to the Main Lobby`

**Subtitle:** `Core Identification Nodes`

**Actions:**
- **Create** — enabled; opens the initial node-creation flow.
- **Enter** — visible but inactive in the first milestone.
- **Import** — visible but inactive in the first milestone.

A subtle **Settings** icon is placed in one corner. It must only open settings that are actually implemented.

## Visual and resource constraints

- One solid background color; no image or video backgrounds.
- Text and basic controls only.
- No decorative illustrations, gradients, blur, heavy shadows or animation.
- Avoid loading remote assets or requiring network access to render the Lobby.
- Prefer a small native UI toolkit and minimal runtime dependencies.
- Keep the interface visually restrained and fast to render.

## Adaptive layout

The Lobby must support both landscape and portrait orientations and must reflow to the available window dimensions. It must not enforce a single aspect ratio.

The title, subtitle, actions, Settings control and footer must remain accessible. Avoid clipping and unnecessary horizontal scrolling. On very small screens, vertical scrolling is acceptable. Window resizing and orientation changes must update the layout without restarting the application.

## Professional footer

Display:
- `© 2026 Core Identification Nodes byLAEV`
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
