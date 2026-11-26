# Phase 1 Workplan — CIN Main Lobby Installer

**Scope:** deliver a Debian package (.deb) for CIN Main Lobby targeting arm64 / AArch64, including its runtime, persistent local records and the three founding certificate processes. The package is intended for Debian-compatible ARM64 userspaces on Android (including LinDesk) and conventional ARM64 Linux. Virtualization is optional, not a product requirement.

**Out of scope:** CIN Package Engine implementation or installation (Phase 2), and the later CIN Personal Registration and Credential issuance process.

## Delivery principle

Each milestone must produce a reviewable artifact and pass its acceptance criteria before the next milestone is treated as complete. GitHub Actions initially validates the documented architecture and repository contract. As executable modules are added, the workflow will gain unit, integration and end-to-end tests. A green documentation check is not evidence that a certificate process is implemented.

## Work breakdown

| ID | Workstream | Deliverable | Acceptance criteria |
|---|---|---|---|
| P1-00 | Baseline and scope | Approved Phase 1 contract | Scope is Lobby installer only; Phase 2 and later credential issuance remain deferred. |
| P1-01 | Debian package foundation | arm64 .deb package skeleton | Valid Debian control metadata, package architecture arm64, explicit runtime dependencies, install/remove lifecycle and no assumption of systemd or rootful host access. |
| P1-02 | Release verification | ZIP + Package Manifest v1 verification | Validates ZIP size and SHA-256, JCS manifest, detached Ed25519 signature and independently provisioned publisher trust. |
| P1-03 | User installation | .deb installation and launcher | Installs into a Debian-compatible ARM64 userspace; separates app, config, cache and persistent node data; validates package install, launch, upgrade and removal without deleting node records by default. |
| P1-04 | Lobby runtime | Launchable Main Lobby | Loads local records and reconstructs lifecycle state after restart. |
| P1-05 | Local record foundation | Persistent record store | Supports commit, read-back and independent verification of records; Genesis Manifest is the first logical CIN record. |
| P1-06 | Genesis Environment Certificate | Genesis Environment Manifest | Collects permitted environment facts with provenance labels; validates and registers the manifest. |
| P1-07 | CIN Node Birth Certificate | Node Birth Record and technical identifiers | Imports the registered Genesis Manifest; derives identifiers using an approved versioned profile; requires separate authorization; commits, reads back and verifies the distinct birth record. |
| P1-08 | Global Personal Document and Node Marriage Certificate | Global personal-document identifier and marriage agreement | Consumes authoritative birth record; obtains explicit external signing; verifies signature and signer; persists document record and association separately. No private signing keys are held by CIN Main. |
| P1-09 | Lobby header and lifecycle | Rebuildable header/read model | Shows all applicable identifiers only from persisted authoritative records and clearly distinguishes candidate, authorized, registered, signed and verified states. |
| P1-10 | Phase 1 release gate | Installable release and evidence | Clean-user install, all three processes, restart/recovery and record-verification tests pass. Phase 1 may be closed only after this gate. |

## GitHub Actions validation ladder

1. **Current baseline:** validate required Phase 1 documentation, required process definitions and explicit Phase 2 boundary.
2. **Package tests:** build .deb on an ARM64 runner or cross-build environment; inspect metadata with dpkg-deb; validate dependencies, file layout, install/upgrade/remove and XDG path behavior.
3. **Record tests:** serialization, canonicalization, hashing, persistence, read-back and tamper-detection tests.
4. **Certificate tests:** isolated fixtures for Genesis, Node Birth authorization and external signing/association verification.
5. **End-to-end tests:** clean install → Genesis → Node Birth → Global Personal Document and Node Marriage → restart → header reconstruction.
6. **Environment matrix:** validate the same arm64 package in a Debian-based Android userspace (LinDesk/PRoot-style) and a Debian ARM64 virtual machine. Record host/kernel, userspace and display integration limitations separately.
7. **Release gate:** publish an artifact only after the relevant workflow checks pass; test fixtures and CI keys must never be mistaken for production authorization or publisher trust.

## Definition of done — Phase 1

- The user can install the arm64 .deb in a supported Debian-compatible ARM64 userspace, including the qualified Android Linux environment.
- The Lobby launches and preserves local node records across restarts.
- The three founding processes execute and produce their distinct outputs.
- The applicable technical identifiers and Global Personal Document identifier are visible in the header, sourced from persisted and verified records.
- The node-document association has a verified external signature and separately persisted agreement.
- End-to-end evidence is available from GitHub Actions.
- No Package Engine is bundled into Phase 1.

## Current status

**Planning/documentation baseline.** The initial GitHub Actions workflow validates the architecture contract only. Functional implementation and functional tests remain pending.
