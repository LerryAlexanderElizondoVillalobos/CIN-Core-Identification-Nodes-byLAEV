# Legacy Component Inventory — CIN Main Migration

**Inventory type:** path and contract review, not yet a complete file-by-file source audit.  
**Baseline:** repository `main` at `e5b758539f05edd937de1b1166a26153940fa96c`.

## A. Rust domain/core prototype

**Source:** `prototype/cin-core/`  
**Observed technology:** Rust 2021; serde, serde_json, jsonschema, sha2.  
**Observed source modules:** typed errors, lifecycle transitions, DataRoot, document envelope/validation, schema validation, filesystem repository, TransactionalStore, recovery inspection, Genesis environment audit/manifest builder/registration, two CLI runners.

**Verified capabilities from source inspection:**
- lifecycle model contains package verification through Main Lobby open/close transitions;
- document envelope and structural validation;
- JSON Schema 2020-12 validator;
- configurable platform data root;
- transactional staging, SHA-256 over serialized bytes, commit markers and read-back;
- Genesis audit with explicit provenance/status values and purpose-limited collection;
- Genesis Manifest candidate generation and separate operator confirmation before registration.

**Known limitations explicitly stated in source/specifications:**
- storage is a single-process, single-writer prototype; no multi-process lock or directory-fsync power-loss guarantee;
- storage digest is over exact JSON bytes, not JCS canonical bytes and not a signature;
- initial Genesis path does not claim production signatures, issuer trust, signature validity or external authorization;
- recovery inspection helper is currently test-gated;
- no complete birth, personal registration, production signing, evidence, profile or Lobby implementation is proven by this crate alone.

**Migration action:** copied the current crate source into `Main/core/` on the reorganization branch. Original source remains unchanged at its prior path. CI acceptance pending.

## B. Linux local runtime prototype

**Source:** `prototype/linux-runtime/`  
**Observed technology:** Rust 2021; local HTTP server bound to loopback, browser-launch helper, runtime lifecycle manager, embedded `dist/index.html`, local persistence probe.

**Verified source behavior:**
- local HTTP listener attempts loopback ports 1221 and 2112, then an ephemeral port;
- exposes local health, status, lifecycle and probe endpoints;
- can launch Chromium or the system browser, or remain in manual mode;
- persistence probe writes a small runtime marker using a staged file and rename, and a separate process can read it;
- ZIP packaging script creates a portable extracted-folder package.

**Important boundary:** the runtime probe is not the CIN authoritative TransactionalStore and does not demonstrate Genesis or node-record persistence. The runtime must remain preserved until a new bootstrap/application integration replaces it.

**Migration action:** keep source in place; inspect all UI/API consumers and run existing Linux E2E/packaging workflows before adapting it into `Main/bootstrap/` and `Main/lobby/`.

## C. GitHub Pages Genesis Lobby

**Source:** `Core Identification Node Github/`  
**Observed role:** GitHub Pages publication source; Pages workflow publishes this directory.

**Verified source behavior and constraints:**
- web UI inspects selected GitHub repository, branch, commit, tree and file inventory under its configured directory;
- this is a GitHub repository context, not a local OS/hardware audit;
- frontend config identifies a repository and node directory;
- local backend API base defaults to loopback port 8787;
- page contains public-repository notice warning that published directory contents are public.

**Migration action:** preserve Pages source and deployment workflow; audit each UI function and API endpoint before porting reusable presentation components into `Main/lobby/`. Do not merge repository inspection with the local Environment Audit.

## D. CI and package workflows

Existing path-scoped workflows include:
- `.github/workflows/cin-core.yml`
- `.github/workflows/cin-certificate-runner-e2e.yml`
- `.github/workflows/linux-desktop-e2e.yml`
- `.github/workflows/linux-portable-prototype.yml`

Package helper:
- `scripts/package-linux-zip.sh`

**Migration action:** keep all existing workflows and package scripts active while adding Main-specific validation. Change path filters only after equivalent Main checks pass and old consumers are migrated.

## E. Architecture and contract sources to retain as governing references

- `docs/architecture/CIN_ARCHITECTURE_BASELINE_V1.md`
- `docs/architecture/CIN_MASTER_ARCHITECTURE_V1.md`
- `docs/architecture/CIN_IMPLEMENTATION_DIRECTORY_MAP.md`
- `docs/architecture/CIN_COMPONENT_DEPENDENCY_MAP.md`
- `docs/architecture/CIN_REPOSITORY_TECHNICAL_AUDIT.md`
- `docs/architecture/GENESIS_PREPARATION_ARCHITECTURE.md`
- `docs/project/CIN_MASTER_IMPLEMENTATION_WORKPLAN.md`
- `docs/project/DEVELOPMENT_BACKLOG.md`
- `docs/project/GITHUB_DEVELOPMENT_WORKFLOW.md`
- `docs/testing/CIN_IMPLEMENTATION_TEST_STRATEGY.md`
- `specifications/CIN_GENESIS_ENVIRONMENT_MANIFEST_V1.md`
- `specifications/CIN_NODE_LIFECYCLE_SPECIFICATION_V1.md`
- `specifications/CIN_LOCAL_DOCUMENT_STORAGE_SPECIFICATION_V1.md`
- `specifications/CIN_NODE_BIRTH_CERTIFICATE_SPEC_V1.md`

These sources must be cross-referenced and reconciled before any superseded-documentation archive operation.
