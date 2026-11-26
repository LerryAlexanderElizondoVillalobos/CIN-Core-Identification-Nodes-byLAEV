# CIN Main — Settings Screen Specification

**Document status:** First milestone specification  
**Application:** CIN Main Lobby  
**Language:** English

## Purpose

Provide a dedicated, lightweight Settings screen so the first milestone demonstrates navigation between two actual application screens. This initial screen is informational; it does not pretend to expose configuration that has not been implemented.

## Screen content

### Application Information

| Field | Display value |
|---|---|
| Application | CIN Main Lobby |
| Project | Core Identification Nodes byLAEV |
| Application phase | Phase 1 — Main Lobby |
| Milestone | Milestone 1 — Lobby and Settings Navigation |
| Target platform | Linux ARM64 / AArch64 |
| Network requirement | Not required to open the application |

### Current Capabilities

- **Create:** available entry point. The creation workflow must describe its real implementation state and must not imply that node creation or certificate issuance is complete when it is not.
- **Enter:** not available in this milestone.
- **Import:** not available in this milestone.

### Project Repository

Display and, where supported by the selected native toolkit, make this URL clickable:

`https://github.com/LerryAlexanderElizondoVillalobos/CIN-Core-Identification-Nodes-byLAEV`

## Navigation contract

- The Lobby Settings icon opens this screen.
- A small left-arrow Back icon is displayed in the Settings top navigation area.
- Its accessible name or tooltip is **Back to Main Lobby**.
- Activating Back returns to the Lobby.
- Opening Settings and returning to the Lobby can be repeated without restarting the application.
- Resizing the window or changing orientation preserves the current screen.

## Presentation constraints

- Reuse the application's solid background and system typography.
- Use native text and a basic Back control.
- No decorative images, remote resources, animations, gradients, blur or shadows.
- Support landscape, portrait and variable window sizes.
- Allow vertical scrolling only when the available height requires it.
- Keep all information readable and all navigation controls reachable.

## Explicit exclusions

Do not add nonfunctional toggles, fake preference controls, fabricated version numbers, invented build metadata or unmeasured CPU/memory figures. Add editable settings only when each setting has a defined behavior and a working implementation.
