# CIN Main — Two-Phase Development Roadmap

The project has two installation phases. The immediate and exclusive implementation target is Phase 1.

## Phase 1 — ARM64 Debian package for CIN Main Lobby

**Deliverable:** one Debian package (.deb), architecture arm64 / AArch64, that installs and launches the CIN Main Lobby, including its required runtime and three founding certificate processes. The package targets Debian-compatible ARM64 userspaces on Android (including LinDesk) and conventional ARM64 Linux; virtualization is optional.

### Phase 1A — Installer foundation
- Define Debian package metadata, versioning, dependencies and publisher trust input.
- Build and inspect the arm64 .deb using dpkg-deb.
- Install into a Debian-compatible ARM64 userspace and validate package lifecycle.
- Create the Lobby launcher and desktop entry using available user-space integration.
- Keep application files separate from persistent node data and user configuration.
- Launch the Main Lobby.

### Phase 1B — Lobby foundation
- Initialize private local storage.
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
Phase 1 is complete when a user can install and launch the arm64 .deb in a qualified Debian-compatible ARM64 userspace (including the Android LinDesk target) and execute the three founding processes through their defined outputs and persisted verification states. The Package Engine is not part of this deliverable.

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
