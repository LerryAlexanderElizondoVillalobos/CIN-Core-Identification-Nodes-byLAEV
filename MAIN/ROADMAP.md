# CIN Main — Development Roadmap

## M1 — Linux User Installer
- Define release input and trust provisioning.
- Implement ZIP and Package Manifest verification.
- Implement per-user extraction, versioned releases, launcher and desktop entry.
- Launch the Main Lobby without root privileges.

## M2 — Main Lobby foundation
- Initialize private local storage.
- Load installation and lifecycle receipts.
- Reconstruct state from persisted records.
- Present pre-birth and incomplete states accurately.

## M3 — Genesis Environment Certificate
- Implement environment collection and provenance labels.
- Build and validate the Genesis Environment Manifest.
- Commit it as the first logical CIN record.

## M4 — CIN Node Birth Certificate
- Import the complete registered Genesis Manifest.
- Finalize and approve the identifier derivation profile and conformance vectors.
- Integrate separate Node Birth Authorization.
- Commit and independently verify the Node Birth Record.

## M5 — CIN Global Personal Document and Node Marriage
- Implement deterministic document identifier derivation.
- Integrate an external wallet/signer.
- Verify the signed agreement and persist both artifacts.
- Preserve the actual authority and issuance status.

## M6 — CIN Package Engine
- Specify package and engine contracts.
- Implement registry, manifest verifier, dependency resolver and installer.
- Implement engine registry, loader, configuration and lifecycle.
- Connect request/permission and signer interfaces.

## M7 — First installable engine
Select one specialized engine as the first end-to-end package and demonstrate discovery, verification, dependency resolution, installation, configuration, activation, update and removal.

## Deferred personal issuance phase

Implement the separate CIN Personal Registration and Credential certificate after the founding node and node-document association prerequisites, authorization and issuer model have been defined.

## Release discipline

The archived test workflows remain historical. New checks will be designed for the actual implementation as each phase becomes functional. Do not reactivate old workflows merely because similarly named folders or components reappear.
