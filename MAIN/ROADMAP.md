# CIN Main — Delivery Roadmap

The immediate goal is a downloadable Debian application payload and a user-space installer for the first functional two-screen CIN Main Lobby. The application is installed and managed by the normal desktop user, without root privileges.

## Milestone 1 — First user-installable release: `CIN.deb`

**Deliverable:** a GitHub Actions-built `CIN.deb` payload plus user installer and uninstaller scripts.

### M1.1 — Native application
- Implement the Lobby in Python with GTK 4.
- Implement the distinct informational Settings screen.
- Implement Settings and Back navigation.
- Keep Create honest about its unimplemented node/certificate workflows.
- Keep Enter and Import disabled.
- Use native widgets, system typography and no embedded browser engine.

### M1.2 — User-space Debian payload
- Build the architecture-independent `CIN.deb` with `dpkg-deb`.
- Keep application payload under `/opt/cin-main-lobby` inside the archive.
- Extract the archive without registering it as a system package.
- Install application files under `~/.local/opt/cin-main-lobby`.
- Create the launcher under `~/.local/bin` and desktop entry under `~/.local/share/applications`.
- Do not write to system directories or modify the system package database.
- Require Python 3, PyGObject and GTK 4 to be already available; check these prerequisites without attempting privileged installation.

### M1.3 — Continuous integration
- Run source-contract tests.
- Build the Debian payload and user install/uninstall scripts.
- On x86_64 and ARM64 runners, provision CI test dependencies, then install CIN as the unprivileged runner user.
- Launch it under Xvfb and execute the two-screen navigation smoke test.
- Uninstall as the same user and verify removal.
- Upload the complete installer bundle only after all required checks pass.

### M1.4 — Operator installation and qualification
- Download the successful workflow artifact.
- Run `bash install-user.sh ./CIN.deb` as a normal user.
- Launch the Lobby from the user's application menu or `~/.local/bin/cin-main`.
- Open Settings and return with Back.
- Repeat navigation, restart and test offline startup.
- Remove with `bash uninstall-user.sh`.
- Record actual compatibility, display behavior and resource measurements.

**Milestone 1 acceptance:** a successful downloadable bundle plus successful no-root manual installation and screen-navigation test on the operator's target environment. CI x86_64 success alone does not qualify ARM64 compatibility.

## Technology baseline

- Python 3 application code.
- GTK 4 native interface via Python GObject Introspection.
- Debian `.deb` payload, initially `CIN.deb`.
- Package architecture `all`; native GTK/Python prerequisites are supplied by the target distribution and must already be available to the user.
- No Electron, Chromium, WebKit, remote resources or network requirement for application startup.
- The CIN installer and uninstaller execute as the logged-in user and do not require root.

## Milestone 2 — Main Lobby foundation

After the first installer has been manually qualified:
- Establish private local storage.
- Load installation and lifecycle records.
- Reconstruct actual process state after restart.
- Present pre-birth and incomplete states accurately.

## Milestone 3 — Genesis Environment Certificate
- Implement environment collection and provenance labels.
- Build and validate the Genesis Environment Manifest.
- Register it as the first logical CIN record.

## Milestone 4 — CIN Node Birth Certificate
- Import the complete registered Genesis Manifest.
- Finalize the approved identifier derivation profile and conformance vectors.
- Integrate separate Node Birth Authorization.
- Commit and independently verify the Node Birth Record and applicable technical node identifiers.

## Milestone 5 — CIN Global Personal Document and Node Marriage
- Implement deterministic document identifier derivation.
- Integrate an external wallet/signer.
- Verify the signed association and persist both artifacts separately.

## Phase 2 — CIN Package Engine Installer

A separate installer for the engine of engines, following the founding node and node-document association prerequisites. It will manage specialized packages, engines, dependencies, configuration, permissions, signing connectors and lifecycle.

## Release discipline

A workflow contract check is not an application runtime test. An x86_64 CI test is not ARM64 device qualification. A generated Debian payload is not considered delivered until the operator can download it, install it as a normal user and verify the planned behavior.
