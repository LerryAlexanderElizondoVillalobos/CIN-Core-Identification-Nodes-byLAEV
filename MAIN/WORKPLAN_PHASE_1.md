# Phase 1 Workplan — CIN Main Lobby Application

## Immediate milestone: Installable Lobby shell

**Objective:** deliver a Linux-installable application that opens the CIN Main Lobby with the welcome text and three visible actions. Only **Create** is functional.

### User-facing first screen

- Heading: `Welcome to Core Identification Nodes`
- Application label: `CIN Main Lobby`
- Actions: `Create`, `Enter`, `Import`
- Create: enabled; opens the initial creation flow.
- Enter: visible but inactive / marked as forthcoming.
- Import: visible but inactive / marked as forthcoming.

## Work breakdown

| ID | Work item | Deliverable | Acceptance criteria |
|---|---|---|---|
| M1-01 | Linux application baseline | Runnable application skeleton | Starts in a supported Linux desktop session and exits cleanly. |
| M1-02 | Lobby window | Main Lobby screen | Displays the exact welcome heading and CIN Main Lobby label. |
| M1-03 | Lobby actions | Three visible action controls | Create is enabled; Enter and Import are visibly present but do not launch unfinished workflows. |
| M1-04 | Create entry point | Initial Create screen / flow shell | Clicking Create opens a dedicated creation view; returning to Lobby works. No certificate claims or records are fabricated. |
| M1-05 | Linux packaging | Installable Linux package | Package installs, creates launcher and starts the Lobby. Target package format and supported architectures are documented and tested. |
| M1-06 | GitHub Actions | Build and smoke-test workflow | CI builds the application/package, checks package metadata and runs available automated startup/UI tests. |
| M1-07 | First milestone release | Downloadable application artifact | Artifact is attached to a successful workflow run and tested on at least one target Linux desktop environment. |

## Deferred work after the first milestone

The following are not part of the initial Lobby shell and must not be represented as implemented:

- Full Genesis Environment Certificate and Manifest process.
- CIN Node Birth Certificate and authoritative Node Birth Record.
- CIN Global Personal Document and Node Marriage Certificate.
- Enter existing node workflow.
- Import node/package workflow.
- CIN Package Engine (Phase 2).

These are future work items. The three founding certificate processes will be integrated into the Create flow in a later milestone.

## GitHub Actions progression

1. Validate repository structure and application metadata.
2. Install build dependencies and build the application.
3. Run unit tests for the Lobby state and Create navigation.
4. Build the Linux package for the selected target architecture.
5. Inspect package metadata and payload.
6. Run install/launch smoke tests in a compatible Linux CI environment.
7. Upload the generated package only after all required jobs pass.

CI smoke tests do not replace testing on LinDesk or a real desktop session. A LinDesk compatibility claim requires an actual device test.

## Completion criteria

The first milestone is complete when a user can install the Linux application, launch it, see the welcome screen and all three actions, activate Create to open the initial creation view, and return to the Lobby. Enter and Import remain intentionally inactive. No certificate process is claimed complete at this milestone.
