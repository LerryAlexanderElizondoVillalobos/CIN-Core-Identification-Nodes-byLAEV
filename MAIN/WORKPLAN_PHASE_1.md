# Phase 1 Workplan — CIN Main Lobby Application

## Immediate milestone: Minimal, adaptive Lobby shell

**Objective:** deliver a lightweight Linux-installable application that opens the CIN Main Lobby. The first screen uses a single flat background color, text-only content and minimal controls. Avoid decorative images, video, animation, gradients, blur, shadows and expensive visual effects.

### Exact first-screen content

- Main title: `Welcome to the Main Lobby`
- Subtitle: `Core Identification Nodes`
- Three plain-text actions: `Create`, `Enter`, `Import`
- A subtle Settings icon in one corner.
- Professional footer: copyright notice, project attribution and direct repository reference.

### Functional behavior

- **Create:** the only active action; opens the initial creation flow.
- **Enter:** visible, inactive until its milestone.
- **Import:** visible, inactive until its milestone.
- **Settings:** opens only settings implemented for this milestone; do not expose nonfunctional controls.

## Adaptive display requirement

The same interface must adapt to landscape and portrait orientations and to differing aspect ratios. Layout must use available width and height rather than a fixed aspect ratio or fixed-size canvas.

Acceptance requirements:
- Landscape and portrait both supported.
- Layout reflows when available width/height changes.
- No clipped title, subtitle, action or footer.
- No unnecessary horizontal scrolling.
- Vertical scrolling is permitted on very small displays if required to keep all content reachable.
- Text and action hit areas remain legible and usable at supported display scaling.
- Reorientation and window resizing do not require restarting the application.

## Work breakdown

| ID | Work item | Deliverable | Acceptance criteria |
|---|---|---|---|
| M1-01 | Lightweight Linux application baseline | Runnable application skeleton | Starts in supported Linux desktop session; low idle resource use; clean exit. |
| M1-02 | Minimal Lobby screen | Flat-color, text-only Lobby | Exact title/subtitle/actions; no decorative media or costly effects. |
| M1-03 | Adaptive layout | Landscape/portrait responsive layout | Passes orientation, aspect-ratio, resizing and small-window checks. |
| M1-04 | Lobby actions | Create, Enter, Import and Settings | Create opens initial creation view; Enter/Import remain visibly inactive; Settings only exposes working options. |
| M1-05 | Professional footer | Copyright and repository attribution | Displays copyright, byLAEV attribution and repository URL. |
| M1-06 | Linux packaging | Installable Linux package | Installs, creates launcher and opens Lobby; target format and architecture documented. |
| M1-07 | GitHub Actions | Build and smoke-test workflow | CI builds package and runs layout/behavior tests where supported. |
| M1-08 | First milestone release | Downloadable artifact | Artifact attached to successful workflow and tested on at least one target Linux environment. |

## Resource and implementation principles

- Prefer a small native toolkit/runtime over a bundled browser engine or large framework.
- Prefer native text and basic controls.
- Use one solid background color; avoid background images, SVG decoration, video, animation, gradients, blur and drop shadows.
- Load no remote resources and require no network connection to open the Lobby.
- Keep dependencies explicit and minimal; measure actual package size and idle memory instead of claiming savings without measurements.

## Deferred work

- Full Genesis Environment Certificate and Manifest process.
- CIN Node Birth Certificate and authoritative Node Birth Record.
- CIN Global Personal Document and Node Marriage Certificate.
- Enter existing node workflow.
- Import node/package workflow.
- CIN Package Engine (Phase 2).

These are not represented as implemented in this milestone. The three founding certificate processes are planned for later integration into the Create flow.

## GitHub Actions progression

1. Validate source, project metadata and screen-content contract.
2. Build the application on the selected Linux architecture.
3. Run unit tests for navigation and enabled/disabled actions.
4. Run layout tests at landscape, portrait, compact and expanded viewport sizes.
5. Build and inspect the Linux package.
6. Run package installation and launch smoke tests.
7. Upload the artifact only after required checks pass.

CI tests do not replace testing on LinDesk or a real desktop session. A LinDesk compatibility claim requires an actual device test.

## Completion criteria

The first milestone is complete when the user can install and launch the lightweight application, see the exact title and subtitle, access Create/Enter/Import and Settings as specified, read the professional footer and use the Lobby in landscape and portrait orientations without clipped or inaccessible content. Only Create is active. No certificate process is claimed complete.
