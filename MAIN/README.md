# CIN Main — Two-Phase Installation Strategy

CIN Main is built in **two sequential phases**. Phase 1 delivers the Main Lobby application. Phase 2 delivers the CIN Package Engine — the engine of engines.

## Phase 1 — Main Lobby Application

The first milestone delivers a lightweight Linux-installable application with two working screens:

1. **Main Lobby** — the initial application screen.
2. **Settings** — an informational screen opened from the Lobby and equipped with a Back icon that returns to the Lobby.

### Main Lobby

The Lobby displays:
- **Welcome to the Main Lobby**
- **Core Identification Nodes**
- **Create**, **Enter** and **Import** actions.
- A subtle Settings icon.
- A professional copyright footer and clickable repository reference.

Create is the only active primary action. Enter and Import remain visible but inactive until their respective workflows are implemented.

### Settings

Settings is a distinct, read-only information screen. It displays the application name, project attribution, current phase and milestone, target platform, offline startup requirement, current action availability and project repository URL. It must not contain pretend toggles, nonfunctional preferences, invented version numbers or unmeasured performance claims.

The Settings Back icon returns to the Lobby. Both navigation directions must work repeatedly without restarting the application.

See the [Phase 1 Workplan](WORKPLAN_PHASE_1.md), [Lobby and Settings specification](lobby/README.md) and [Linux installer specification](installer/linux/README.md).

## Phase 1 — Longer-term node foundation

The first milestone does not claim that the founding certificate processes are already implemented. Later increments will integrate:

1. **Genesis Environment Certificate** → Genesis Environment Manifest.
2. **CIN Node Birth Certificate** → authoritative Node Birth Record and technical node identifiers.
3. **CIN Global Personal Document and Node Marriage Certificate** → Global Personal Document identifier and separately persisted, cryptographically accepted node-document association.

The CIN Package Engine remains Phase 2 and is not part of the Lobby application milestone.

## Phase 2 — CIN Package Engine Installer

The CIN Package Engine is a separate installer and product layer. It installs, registers, configures, enables, updates, disables and removes specialized CIN engines and packages.

Initial package families include dedicated certificate engines, Ledgers, Binary Merkle Tree, Enterprise Merkle Tree, request and permission engines, external signing connectors, configurable one-time resource/UTXO-style engines and application-specific engines.

## Governing rules

- Phase 1 installs the Main Lobby application only; it does not install the Package Engine.
- Phase 2 installs the Package Engine; it does not replace or reinstall the Main Lobby.
- The initial package target is a Debian-compatible ARM64 userspace; virtualization is optional.
- Application files, configuration, cache and persistent node records remain separate.
- Installation is not node birth; node birth occurs through the Lobby's later certificate process.
- The Genesis Manifest and Node Birth Record remain distinct documents.
- Private signing keys remain outside CIN Main and its packages; signing uses external providers.
- Historical files in `HISTORY/` are references, not automatically active implementation.

## Current maturity

**Specification status:** the two-screen Lobby/Settings milestone is defined. The repository currently has no active application source tree or launchable runtime entry point in the new Main. Runtime implementation and device testing remain pending; documentation and CI contract checks must not be presented as proof of a working executable.
