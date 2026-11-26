# CIN Main — Delivery Roadmap

The current Phase 1 distribution is a single, self-contained Debian archive named Core_Identification_Nodes.deb. It carries the CIN Main Lobby, Settings, component-aware Deploy engine, CIN-scoped network controller, and embedded user-space installer/uninstaller.

## Milestone 1 — Official user-space Debian package

Package file: Core_Identification_Nodes.deb  
Debian package: core-identification-nodes  
Version: 0.3.0  
Architecture: all

### M1.1 — Main Lobby and Settings
- Launch directly into Main Lobby.
- Open Settings from the Lobby and return with Back.
- Keep Create honest about unimplemented node/certificate workflows.
- Keep Enter and Import disabled.

### M1.2 — Deploy engine
- Build a deterministic local component manifest and SHA-256 fingerprint.
- Verify official manifests with a separately provisioned Ed25519 publisher public key.
- Compare additions, replacements and removals.
- Stage HTTPS components and verify hashes.
- Require explicit operator approval before applying a proposal.
- Verify the resulting application tree and roll back on failure.
- Preserve user data and publisher trust configuration across application replacement.

The engine is installed in the package. Remote deployment is not active until the genuine publisher key and signed official manifest are provisioned.

### M1.3 — Application-scoped network switch
- Launch CIN inside cin-main-lobby.scope through the systemd user manager.
- Apply IPAddressDeny=any to CIN only when the operator switches network access OFF.
- Clear the CIN scope override when switched ON.
- Do not modify host networking, NetworkManager or other applications.
- Qualify the policy on x86_64 and ARM64 and verify that other host processes retain connectivity.

### M1.4 — Single Debian installer
- Build exactly Core_Identification_Nodes.deb.
- Embed the user-space installer and uninstaller inside the package.
- Extract and install as the normal user, without root, sudo, apt install or dpkg -i.
- Place the application in ~/.local/opt/cin-main-lobby, launcher in ~/.local/bin, and desktop entry in ~/.local/share/applications.
- Preserve user data and publisher configuration during replacement and uninstall.

### M1.5 — Continuous integration and release
- Run source, Deploy and application contract tests.
- Run network scope runtime tests on x86_64 and ARM64.
- Build and inspect the Debian payload.
- Install, launch, exercise navigation and network OFF/ON, then uninstall as an unprivileged user.
- Publish only the single .deb artifact after all qualification gates pass.

## Operator installation

Extract the embedded bootstrap script and run it as the normal desktop user:

~~~bash
tmp="$(mktemp -d)"
dpkg-deb --extract ./Core_Identification_Nodes.deb "$tmp"
bash "$tmp/opt/cin-installer/install-user.sh" "$PWD/Core_Identification_Nodes.deb"
result=$?
rm -rf "$tmp"
exit "$result"
~~~

Launch with ~/.local/bin/cin-main. Uninstall with bash ~/.local/opt/cin-main-lobby/uninstall-user.sh.

## Runtime prerequisites

Python 3, PyGObject, GTK 4, OpenSSL, dpkg-deb, a running systemd user manager and systemd/cgroup support for IPAddressDeny must be available. The CIN installer does not install system dependencies or request administrator privileges.

## Milestone 2 — Main Lobby foundation

After the first installer has been qualified:
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

A workflow contract check is not an application runtime test. CI qualification is not a substitute for manual operator qualification on the target desktop. A generated Debian payload is not considered released until all required Actions jobs pass and the operator can install and verify the intended behavior.
