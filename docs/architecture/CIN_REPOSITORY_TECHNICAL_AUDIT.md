# CIN Repository Technical Audit — M0

**Project:** CIN — Core Identification Nodes byLAEV  
**Audit scope:** Repository baseline and portable desktop runtime strategy  
**Audit date:** 2026-11-15  
**Status:** Evidence-based initial audit; stack recommendation is provisional and requires an architecture decision review  
**Related work:** M0 Issue #4

## 1. Executive finding

The default branch is currently a research, architecture and specification repository, not an application codebase. The reviewed source files do not establish an existing desktop runtime, application framework, build system, executable entry point, or test suite for a CIN runtime.

Therefore, the correct next step is to select a stack deliberately and then create a small, testable portable bootstrap. It would be inaccurate to describe the current repository as an existing application that merely needs packaging.

## 2. Repository evidence reviewed

The audit inspected the following files on `main`:

- `README.md`: project vision, modular architecture, research and development areas, and package provenance principles.
- `docs/project/PROJECT_STATUS_AND_ROADMAP.md`: explicit maturity statement and recommended development phases.
- `docs/architecture/GENESIS_PREPARATION_ARCHITECTURE.md`: proposed Environment Auditor, Genesis Manifest Builder and Private Local Storage Registrar responsibilities.
- `docs/architecture/NODE_LIFECYCLE_ARCHITECTURE.md`: proposed lifecycle from package verification through extraction, Genesis, birth and Lobby activation.
- `specifications/PACKAGE_MANIFEST_SPECIFICATION_V1.md`: proposed package manifest profile.

The roadmap explicitly says the baseline does not contain a complete CIN runtime, Environment Audit Engine, Genesis Manifest implementation, Node Birth Engine, human-registration implementation or decentralized consensus implementation. It also states that Package Manifest v1 is proposed and that implementation, publisher-key trust lifecycle and interoperability testing remain pending.

### Build and runtime probes

The following conventional application entry/build files were checked at repository root and were not found:

- `package.json`
- `Cargo.toml`
- `pyproject.toml`
- `requirements.txt`
- `index.html`

This is a bounded probe, not a claim that no file of any language exists anywhere in the repository. It is consistent with the roadmap's explicit maturity statement. A complete inventory of every tracked path and dependency remains part of this Issue's remaining acceptance work.

## 3. Architectural requirements used for comparison

The candidate runtime must support:

1. A portable desktop application and a locally opened Main Lobby.
2. Offline operation for local preparation, persistence and reading.
3. A backend boundary for filesystem operations, cryptography and future external-signer adapters.
4. A UI that can evolve independently from core lifecycle and document logic.
5. Automated unit, integration and end-to-end testing.
6. Packaging for the operating systems CIN explicitly chooses to support.
7. A clean separation between application code, user records, trust configuration and external signing devices.
8. A practical route to inspect USB/HID or other external signer interfaces without putting private keys in the application package.

The architecture must not assume that a USB device can be tested on ordinary hosted CI runners. Protocol-level test doubles and controlled physical-device compatibility tests are separate.

## 4. Candidate comparison

| Candidate | Strengths relevant to CIN | Costs and constraints | Assessment |
|---|---|---|---|
| **Tauri 2 + Rust backend + web frontend** | Desktop-focused framework; supports a web frontend with native backend logic; system WebView avoids bundling a separate browser engine; capability/permission model; official distribution guidance for Windows, macOS and Linux | Requires Rust and frontend toolchain; system WebView availability and platform-specific packaging must be tested; developers must define narrow commands and permission boundaries | **Preferred candidate for a prototype** |
| **Electron + TypeScript/JavaScript** | Mature web application model; Chromium and Node.js packaged with app; broad web ecosystem and established distribution tooling | Larger distribution footprint because browser runtime is bundled; more runtime components to maintain; privileged main-process/preload boundaries require disciplined design | Viable alternative if web-team velocity and browser consistency outweigh package size |
| **Qt 6 + PySide6** | Native desktop UI toolkit; official deployment documentation describes ZIP, frozen binary/directory and native installer distribution; PySide6 deployment tooling targets Windows, Linux and macOS | Python runtime and Qt deployment packaging must be managed; UI implementation model differs from a web-first Lobby; native plugin and cryptographic integration still require engineering | Viable alternative for a native-widget-first application |

## 5. Provisional recommendation

**Recommend a Tauri 2 prototype with Rust as the application/backend boundary and a web frontend for the Lobby.**

This is a recommendation for a small feasibility prototype, not approval to begin the full application implementation or a claim that Tauri is already adopted.

Reasons:

- CIN requires a local desktop shell and a UI that can evolve independently of the record and cryptographic engines.
- Rust provides a typed native backend boundary suitable for local storage, package verification and cryptographic operations.
- Tauri supports a web frontend with backend logic in Rust and other bindings where needed.
- Tauri's capabilities model can express which permissions are granted to which application windows/webviews; this can support a deliberate permission surface for local operations.
- Its use of the system WebView can reduce application bundle size compared with packaging a full browser engine, at the cost of validating platform WebView availability and behavior.

Electron remains the fallback if WebView consistency, existing frontend dependencies or contributor experience make Tauri materially more expensive. PySide6 remains the alternative if the Lobby should be primarily native-widget-based rather than web-rendered.

## 6. Proposed proof-of-feasibility before final stack approval

Create a minimal, disposable prototype on a dedicated branch. It must demonstrate only:

1. Launch the desktop shell.
2. Render a static Main Lobby placeholder.
3. Read and write a harmless test record in a selected local data directory.
4. Close and relaunch the process, then recover the same test record.
5. Invoke one backend operation from the UI through an explicit interface.
6. Build the application on the chosen CI operating-system runner.
7. Document the resulting package format, external runtime requirements, and platform-specific constraints.

Do not implement personal registration, production certificates, authority issuance, global uniqueness, USB production signing, consensus or future application ledgers in this prototype.

The prototype should compare actual build and restart behavior, not merely compare framework marketing claims.

## 7. Decision gates

The stack becomes **Accepted** only after:

- The complete repository inventory and dependency audit is recorded.
- The supported initial desktop OS targets are chosen.
- The prototype passes launch, local persistence, restart recovery and CI build checks.
- The team records package size/build time and platform prerequisites.
- The architecture review accepts the result and updates this ADR.

Until then, mark the stack as **Proposed**, not selected or implemented.

## 8. Remaining audit work

- Complete tracked-file inventory and identify any existing scripts, test fixtures or hidden application subprojects.
- Review licenses and maintenance status of proposed framework dependencies.
- Verify the actual OS targets and available build runners.
- Prototype external signer discovery as a separate adapter feasibility test; no physical USB compatibility claim from simulation.
- Record the accepted stack and CI matrix after the feasibility evidence exists.

## 9. External technical references

- [Tauri — What is Tauri?](https://v2.tauri.app/start/)
- [Tauri — Capabilities and permissions](https://v2.tauri.app/security/capabilities/)
- [Electron — Distribution overview](https://www.electronjs.org/docs/latest/tutorial/distribution-overview)
- [Qt for Python — Deployment](https://doc.qt.io/qtforpython-6/deployment/index.html)

These references support the framework capability comparison. They do not prove CIN compatibility; that requires the prototype and project-specific tests.

---

**Audit conclusion:** proceed with a Tauri 2 proof-of-feasibility as the leading candidate, retain Electron and PySide6 as documented alternatives, and defer final stack adoption until the prototype and complete inventory pass review.
