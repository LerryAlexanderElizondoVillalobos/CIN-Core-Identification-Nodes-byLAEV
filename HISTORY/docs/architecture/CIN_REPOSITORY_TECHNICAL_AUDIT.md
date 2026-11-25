# CIN Repository Technical Audit — M0

**Project:** CIN — Core Identification Nodes byLAEV  
**Audit scope:** Complete tracked-file inventory, current implementation evidence and portable ZIP runtime strategy  
**Audit date:** 2026-11-15  
**Status:** Repository inventory completed; runtime prototype and technology decision pending  
**Reviewed default-branch commit:** `b55a5eacb5c6be621ff9222d46bf04e71d42a146`  
**Related work:** M0 Issue #4; [Architecture Baseline](CIN_ARCHITECTURE_BASELINE_V1.md); [ADR-0002](../decisions/0002-portable-runtime-and-zip-packaging-model.md)

## 1. Governing product architecture

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

## 3. Complete repository inventory

The default branch was inspected through its recursive Git tree. The snapshot contains **25 tracked files**:

| File type | Count | Actual role |
|---|---:|---|
| Markdown (`.md`) | 20 | Project overview, architecture, decisions, workflow, specifications and policies |
| YAML (`.yml`) | 4 | Two GitHub Actions workflows, two Issue templates |
| Python (`.py`) | 1 | Documentation/reference validation script |
| **Total** | **25** | **No application runtime source is present** |

### 3.1 Tracked files at the audit snapshot

```text
.github/ISSUE_TEMPLATE/implementation.yml
.github/ISSUE_TEMPLATE/specification.yml
.github/PULL_REQUEST_TEMPLATE.md
.github/workflows/ci.yml
.github/workflows/specification-validation.yml
CONTRIBUTING.md
LICENSE.md
README.md
SECURITY.md
docs/architecture/CIN_ARCHITECTURE_BASELINE_V1.md
docs/architecture/CIN_COMPONENT_DEPENDENCY_MAP.md
docs/architecture/CIN_REPOSITORY_TECHNICAL_AUDIT.md
docs/architecture/GENESIS_PREPARATION_ARCHITECTURE.md
docs/architecture/NODE_LIFECYCLE_ARCHITECTURE.md
docs/architecture/PACKAGE_ORIGIN_VERIFICATION.md
docs/decisions/0001-genesis-manifest-and-node-birth-separation.md
docs/decisions/0002-portable-runtime-and-zip-packaging-model.md
docs/decisions/README.md
docs/foundations/CIN_FOUNDATIONAL_PRINCIPLES.md
docs/project/DEVELOPMENT_BACKLOG.md
docs/project/GITHUB_DEVELOPMENT_WORKFLOW.md
docs/project/PROJECT_STATUS_AND_ROADMAP.md
scripts/ci/validate_repository.py
specifications/CIN_NODE_LIFECYCLE_SPECIFICATION_V1.md
specifications/PACKAGE_MANIFEST_SPECIFICATION_V1.md
```

### 3.2 Reproducible inventory procedure

Run from a fresh clone or checkout of the audited commit:

```bash
git ls-files | sort
git ls-files | awk -F. 'NF > 1 { print tolower($NF) }' | sort | uniq -c
```

To locate common application manifests and build entry points:

```bash
git ls-files | grep -E '(^|/)(package\.json|Cargo\.toml|pyproject\.toml|requirements[^/]*\.txt|go\.mod|CMakeLists\.txt|.*\.csproj|.*\.sln|index\.html|Makefile)$' || true
```

This procedure inventories tracked repository files. It does not claim to inventory untracked local files, external services or dependencies that are not declared in the repository.

## 4. Actual implementation maturity

The current repository is a **documentation and architecture baseline**, not a launchable CIN application.

The complete tracked-file inventory establishes:

- No application source tree or launchable runtime entry point is present.
- No `package.json`, `Cargo.toml`, `pyproject.toml`, `requirements.txt`, `go.mod`, `CMakeLists.txt`, `.csproj`, `.sln` or `index.html` is tracked.
- No application dependency lockfile, runtime build script, desktop packaging configuration or release ZIP build workflow is present.
- No application test suite or test directory is present.
- The only Python file is `scripts/ci/validate_repository.py`; it validates Markdown references and required documentation files. It is not a CIN application engine.
- The two GitHub Actions workflows validate repository/documentation references and YAML syntax, and report the specification maturity boundary. They do not compile or execute a CIN runtime.
- Package Manifest v1 is a specification document, not an implemented package builder or cryptographic verifier.

Therefore, no existing application language, framework, frontend, backend, cryptographic dependency or local database can be claimed as already selected or implemented.

## 5. Existing automation and its limits

The current CI workflows provide useful repository governance:

- `.github/workflows/ci.yml`: repository baseline checks, Markdown reference validation and workflow YAML syntax parsing.
- `.github/workflows/specification-validation.yml`: specification/reference validation and an explicit report that runtime tests are not yet available.

These checks are successful on the accepted documentation changes. They establish documentation consistency only. They do **not** demonstrate ZIP creation, ZIP signature verification, cryptographic correctness, storage persistence, USB signer integration, a graphical interface or Main Lobby recovery.

## 6. Runtime options — preliminary assessment, not a technology decision

The portable ZIP model does not predetermine a language or UI framework. The following three candidates are reasonable to prototype; none is approved by this audit.

| Candidate | Portable ZIP and offline operation | Local persistence and cryptography | External signer / USB integration | Main trade-off |
|---|---|---|---|---|
| **Tauri (Rust backend + web UI)** | Can package an application runtime and assets for launch from the extracted folder; local operation is feasible | Strong fit for a Rust core, filesystem-backed records and mature cryptographic crates | Requires a defined native plugin/command boundary and device-specific compatibility tests | Smaller native application profile, but introduces Rust and a split frontend/backend toolchain |
| **Electron (Node.js + web UI)** | Can distribute the executable, Chromium runtime and assets together inside the ZIP; offline UI is feasible | Node filesystem APIs and mature JavaScript cryptographic libraries are available | Node/native modules can bridge USB and external signer integrations | Familiar web development model and broad ecosystem, but substantially larger package/runtime footprint |
| **Qt (C++ or Python)** | Can bundle application and required runtime libraries into a portable directory; offline operation is feasible | Strong native filesystem and cryptographic-library integration options | Native USB/device integration is possible through platform-specific libraries | Native application model, but cross-platform packaging and dependency deployment require careful engineering |

### 6.1 Preliminary recommendation

Prototype **Tauri first**, without approving it as the final stack. It offers a plausible separation between a local interface and a Rust-based core for storage, cryptographic verification and controlled external-signer adapters, while preserving a self-contained extracted-folder delivery model.

This is a candidate for a proof of feasibility, not an accepted architecture decision. If a prototype cannot reliably launch from the extracted folder, persist records across process restarts, or support the required operating-system targets, the recommendation must be revisited. Electron and Qt remain valid alternatives.

### 6.2 Required proof before ADR-0004 can be accepted

The prototype must demonstrate:

1. Reproducible build of the application package.
2. ZIP creation and extraction into a clean directory.
3. Launch directly from that extracted directory, without a conventional installer.
4. Offline access to the local interface and local operations.
5. Local record write, close, relaunch, read-back and integrity verification.
6. A clean boundary between application files and user-generated records.
7. A signer interface tested with a simulator; physical USB compatibility tested separately on a controlled host.
8. Supported operating-system targets and their runtime prerequisites.
9. Package update behavior that does not overwrite or lose user records.

Only after this proof should ADR-0004 record an accepted language/framework and rejected alternatives.

## 7. Portable directory and local data boundary

The extracted directory is the application package boundary. The user data root is still an open decision and must not be silently assumed to be inside or outside that directory.

The storage design must explicitly decide and test:

- Whether user data defaults to a sibling/user-profile data directory, a user-selected directory, or an explicit portable-data mode within the extracted folder.
- How a user can move the extracted package without losing the relationship to their local records.
- How package updates replace application files without overwriting authoritative records.
- How backups, export, recovery and storage permissions work.
- How private data and signer secrets remain outside the distributable ZIP.

This decision belongs with Issue #6 and the runtime prototype. The package and user-data boundary must be explicit before the first persistent Genesis record is implemented.

## 8. Architecture constraints for implementation

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

## 9. Next technical work

1. Build a minimal Tauri feasibility prototype on a dedicated branch; do not merge framework-specific application scaffolding until the proof criteria are met.
2. Demonstrate local launch from an extracted ZIP and offline startup.
3. Demonstrate a small local record write/read/restart cycle using temporary development data only.
4. Record the exact OS, toolchain, runtime prerequisites and reproducible build steps.
5. Test the external signer interface with a simulator; schedule physical USB testing separately.
6. Resolve the package/user-data directory boundary with the storage specification in Issue #6.
7. Compare prototype evidence against Electron and Qt trade-offs and finalize ADR-0004 only after review.

## 10. Acceptance evidence for Issue #4

Issue #4 is **partially completed**:

- Complete tracked-file inventory: documented and reproducible.
- Existing implementation status: established; no CIN runtime source is present in the audited tree.
- Portable ZIP architecture: preserved and linked to ADR-0002.
- Three candidate technologies: compared provisionally; Tauri is the first prototype recommendation only.
- Runtime proof, local persistence prototype, OS support matrix and accepted ADR-0004: pending.

Issue #4 must remain open until the prototype demonstrates extraction, local launch, offline behavior and persistence/recovery, and the project owner accepts the evidence-based technology decision.

**Audit conclusion:** CIN is a locally operated portable-folder application distributed as a verified ZIP. The repository currently contains architecture, specifications and documentation CI, but no launchable application. The next implementation experiment should prove the portable local runtime before any framework is treated as selected.

---
*End of audit.*
