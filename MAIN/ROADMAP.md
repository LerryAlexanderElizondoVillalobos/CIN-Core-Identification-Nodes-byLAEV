# CIN Main — Delivery Roadmap

The immediate goal is a downloadable and manually installable Debian package for the first functional two-screen CIN Main Lobby.

## Milestone 1 — First installable release: `CIN.deb`

**Deliverable:** a GitHub Actions-built Debian package containing the native GTK 4 CIN Main Lobby application.

### M1.1 — Native application
- Implement the Lobby in Python with GTK 4.
- Implement the distinct informational Settings screen.
- Implement Settings and Back navigation.
- Keep Create honest about its unimplemented node/certificate workflows.
- Keep Enter and Import disabled.
- Use native widgets, system typography and no embedded browser engine.

### M1.2 — Debian packaging
- Define package metadata and runtime dependencies.
- Include the application launcher and desktop entry.
- Build `CIN.deb` with `dpkg-deb`.
- Keep future node data separate from replaceable application files.
- Document installation and removal behavior.

### M1.3 — Continuous integration
- Run source-contract tests.
- Build the Debian package on GitHub-hosted Linux.
- Inspect package metadata and contents.
- Install the package in the CI runner.
- Launch it under Xvfb and execute the two-screen navigation smoke test.
- Upload `CIN.deb` as a workflow artifact only after all required checks pass.

### M1.4 — Operator installation and qualification
- Download the successful workflow artifact.
- Install the package on a Debian-compatible Linux ARM64 / AArch64 target.
- Launch the Lobby from desktop integration or terminal.
- Open Settings and return with Back.
- Repeat navigation, restart and test offline startup.
- Record actual compatibility, display behavior and resource measurements.

**Milestone 1 acceptance:** a successful downloadable package plus a successful manual installation and screen-navigation test on the operator's target environment. CI x86_64 success alone does not qualify ARM64 compatibility.

## Technology baseline

- Python 3 application code.
- GTK 4 native interface via Python GObject Introspection.
- Debian `.deb` package, initially `CIN.deb`.
- Package architecture `all` because the Python application is architecture-independent; native GTK/Python dependencies are resolved by the target distribution.
- No Electron, Chromium, WebKit, remote resources or network requirement for application startup.

The package manager may require administrator authorization to install system-managed files. The running Lobby operates as the logged-in user and must not require root privileges.

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

A workflow contract check is not an application runtime test. An x86_64 CI test is not ARM64 device qualification. A generated Debian package is not considered delivered until the operator can download and install it and verify the planned behavior.
