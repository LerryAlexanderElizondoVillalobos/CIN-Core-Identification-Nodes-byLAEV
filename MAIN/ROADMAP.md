# CIN Main — Two-Phase Development Roadmap

CIN Main has two installation phases. The immediate implementation target is the first milestone of Phase 1: a lightweight two-screen Main Lobby application.

## Phase 1 — CIN Main Lobby Application

**First milestone deliverable:** a Linux-installable application that opens the Main Lobby, navigates to an informational Settings screen and returns to the Lobby through a Back icon.

### Phase 1A — Application and navigation foundation

- Select a lightweight native UI toolkit/runtime based on actual Linux ARM64 support, orientation handling, scaling and packaging.
- Establish a launchable application baseline.
- Implement the Main Lobby screen with its defined title, subtitle, Create/Enter/Import actions and professional footer.
- Implement the separate informational Settings screen.
- Display basic application, project, phase, milestone, platform, offline-startup and capability information.
- Implement Lobby → Settings and Settings → Lobby navigation.
- Keep both screens usable in landscape, portrait, compact and expanded windows.
- Keep startup and both screens independent of network access.
- Package and test the application on a qualified Linux ARM64 environment.

### Phase 1B — Lobby foundation and local state

- Initialize private local storage when required by the actual creation workflow.
- Load installation and lifecycle records.
- Reconstruct actual process state after restart.
- Present pre-birth and incomplete states accurately.

### Phase 1C — Genesis Environment Certificate

- Implement environment collection and provenance labels.
- Build and validate the Genesis Environment Manifest.
- Register it as the first logical CIN record.

### Phase 1D — CIN Node Birth Certificate

- Import the complete registered Genesis Manifest.
- Finalize and approve the identifier derivation profile and conformance vectors.
- Integrate separate Node Birth Authorization.
- Commit and independently verify the Node Birth Record and applicable technical node identifiers.

### Phase 1E — CIN Global Personal Document and Node Marriage

- Implement deterministic document identifier derivation.
- Integrate an external wallet/signer.
- Verify the signed association and persist both artifacts separately.
- Preserve actual authority, association and issuance status.

### Phase 1 acceptance

The first UI milestone is complete when the user can launch the application, open Settings, read the required information and return to the Lobby, with both screens adapting to orientation and window size. The broader Phase 1 node-foundation acceptance remains separate and requires the three defined founding processes and their persisted verification states. The Package Engine is not part of Phase 1.

## Phase 2 — CIN Package Engine Installer

**Deliverable:** a separate installer for the CIN Package Engine — the engine of engines.

This phase follows the establishment of the node's technical identifiers and CIN Global Personal Document association in Phase 1.

- Specify package and engine contracts.
- Implement package registry and manifest verifier.
- Implement dependency resolver and package installer.
- Implement engine registry and loader.
- Implement configuration and lifecycle management.
- Connect request/permission and external signer interfaces.
- Preserve node records when installing, updating or removing engines.

### Phase 2 acceptance

The Package Engine installer installs the engine-of-engines subsystem, which can discover, verify, resolve, install, configure, activate, update, disable and remove a specialized engine package.

## Subsequent package validation

Select one specialized engine as the first end-to-end package and demonstrate the full package lifecycle through the Phase 2 Package Engine.

## Deferred personal issuance phase

The separate CIN Personal Registration and Credential process remains a later issuance stage, after the founding node and node-document association prerequisites, authorization and issuer model have been defined.

## Release discipline

The archived test workflows remain historical. New checks will be designed for the actual implementation as each phase becomes functional. Do not reactivate old workflows merely because similarly named folders or components reappear.
