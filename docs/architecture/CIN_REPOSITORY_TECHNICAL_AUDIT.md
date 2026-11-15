# CIN Repository Technical Audit — M0

**Project:** CIN — Core Identification Nodes byLAEV  
**Audit scope:** Repository baseline and portable ZIP runtime  
**Audit date:** 2026-11-15  
**Status:** Initial audit; runtime implementation and full inventory remain pending  
**Related work:** M0 Issue #4

## 1. Correct product architecture

CIN's defined delivery model is a **portable ZIP package**. The user downloads the ZIP, verifies its origin and integrity, extracts it into a directory, and runs CIN locally from that extracted directory.

CIN is not defined as a conventional installed desktop application. An installer, system-wide installation, app-store deployment or mandatory installation wizard is not part of the foundational plan.

The extracted directory is the operational package boundary. CIN's application, local engines, schemas, verifiers, interface assets and package configuration are distributed within the portable package according to the package manifest. User-generated records and private local data must persist in the designated local storage location and remain available after closing and reopening CIN.

The exact launch mechanism, runtime packaging format and supported operating systems must be established by inspecting the existing repository and validating the selected implementation. These details must not be guessed or used to change the portable ZIP model.

## 2. User journey that governs implementation

1. Download the original CIN ZIP package.
2. Verify the package HASH and publisher signature using the defined origin-verification process.
3. Extract the verified ZIP to a directory.
4. Launch CIN locally from the extracted directory.
5. Run the environment audit and review its results.
6. Prepare and register the Genesis Manifest locally.
7. Continue through the defined node-birth and personal-registration authorization processes.
8. Persist documents and records locally.
9. Open the Main Lobby from the records actually stored.
10. Close and relaunch CIN; recover and validate the same records and reconstruct the Lobby header.

The first-release acceptance target remains the first successful Main Lobby with persistent, recoverable local state. Network consensus, complete decentralized communication, future application Ledgers and global institutional coordination remain outside this release boundary.

## 3. Repository evidence

The reviewed default-branch materials include:

- `README.md`
- `docs/project/PROJECT_STATUS_AND_ROADMAP.md`
- `docs/architecture/GENESIS_PREPARATION_ARCHITECTURE.md`
- `docs/architecture/NODE_LIFECYCLE_ARCHITECTURE.md`
- `specifications/PACKAGE_MANIFEST_SPECIFICATION_V1.md`

The roadmap describes the repository as an architecture/specification baseline and identifies major runtime engines as not yet implemented.

Conventional root-level application manifests checked during the initial probe included `package.json`, `Cargo.toml`, `pyproject.toml`, `requirements.txt` and `index.html`; these were not found at the root. This bounded probe is not a complete inventory of all tracked files, nested application projects or build scripts. A complete inventory remains required by Issue #4.

The development workflow and initial GitHub Actions baseline have now been merged to main through PR #1. The active checks validate repository documentation references and workflow YAML syntax; they do not validate a CIN runtime, cryptographic engine, storage engine or Main Lobby.

## 4. Architecture constraints for implementation

- Preserve the ZIP → verify → extract → run-local sequence.
- Do not require a traditional installation step.
- Keep local operation possible without permanent Internet connectivity for functions that do not require external authorities or services.
- Keep the user's records persistent across process restarts.
- Separate package contents from user-generated records and private data.
- Keep production private keys out of the repository and portable package.
- External signing must be provided through a defined signer interface or separately connected signing component; the package does not contain production private keys.
- Treat package publisher signature, document issuer signature and operation authorization as distinct mechanisms.
- Distinguish locally generated personal numbers from globally coordinated uniqueness.
- The Main Lobby is a presentation/read model, not the authoritative source of records.

## 5. Runtime and technology assessment

The portable ZIP requirement does not, by itself, determine a programming language or UI framework. A runtime can be packaged inside the ZIP or rely on a documented platform runtime, but the choice must preserve the extracted-folder execution model.

A framework comparison is useful only insofar as it answers:
- Can the built application be distributed inside the ZIP?
- Can the user launch it from the extracted directory without a conventional installation?
- Can it persist and recover data locally?
- Can it operate offline for the local lifecycle?
- Can it provide a maintainable UI/backend boundary and testable engines?
- What runtime prerequisites must be present or included?
- Can the package be built reproducibly for the supported operating systems?

Any Tauri, Electron, Qt or other proposal is therefore only a possible implementation technology. It must not redefine CIN as an installed application. No framework is accepted by this audit.

## 6. Next technical work

1. Complete the tracked-file, language, dependency, build-script and license inventory.
2. Identify any existing launchable components and reuse them where appropriate.
3. Define the portable package directory layout and launch entry point.
4. Define where user data is stored relative to the extracted directory, including the intended behavior when the package directory is moved or replaced.
5. Prototype the smallest viable local launch and persistence cycle using the existing project direction.
6. Verify clean extraction, local launch, write/read, full process restart and recovery.
7. Record platform prerequisites and package reproducibility.
8. Only then finalize the technology decision and CI build matrix.

## 7. Acceptance evidence for Issue #4

Issue #4 is not complete until the repository inventory is reproducible, the existing implementation status is accurately recorded, the portable ZIP execution model is reflected in the technical design, and the chosen runtime approach has demonstrated extraction, local launch and persistence/recovery without requiring a conventional installation.

**Audit conclusion:** CIN is a locally operated portable-folder application distributed as a verified ZIP. All technology and packaging decisions must serve that model, not replace it.
