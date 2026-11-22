# Repository inventory snapshot

Snapshot source: default branch `main`, audited during the Linux-first Main migration.
Tracked tree entries at snapshot: **233** (includes directories and files).
This is a path inventory, not a claim that each source file has been audited line-by-line.

## Root classification
- `.github/`: retain; CI, issue templates and GitHub Pages/runtime workflows.
- `Core Identification Node Github/`: retain; published GitHub Pages application source and its certificates/documentation.
- `certificates/`: retain; genesis certificate source.
- `docs/`: retain; canonical architecture, foundations, project plans, audits and test guidance.
- `e2e/`: retain; E2E tests, now targeting migrated Main runtime.
- `examples/`: retain; schema/document examples.
- `prototype/`: transitional archive source; portable runtime and CIN core copied into Main.
- `research/`: retain; research and dialogue documents.
- `schemas/` and `specifications/`: retain; versioned contract and schema sources.
- `scripts/`: retain/transition; repository validation and legacy package tooling.
- `services/`: transitional source; local backend copied into Main/services.
- `termux-cin/`: transitional source; Android integration copied into Main/installation/android-termux.
- `tests/`: retain; legacy test suite until consolidated into Main.
- Root Markdown/config files: retain as repository governance and project overview.

## Entry counts by root
```
.github: 15 entries
CONTRIBUTING.md: 1 entries
Core Identification Node Github: 40 entries
LICENSE.md: 1 entries
README.md: 1 entries
ROADMAP.md: 1 entries
SECURITY.md: 1 entries
certificates: 2 entries
docs: 60 entries
e2e: 4 entries
examples: 2 entries
prototype: 33 entries
requirements-ci.txt: 1 entries
research: 4 entries
schemas: 2 entries
scripts: 5 entries
services: 17 entries
specifications: 24 entries
termux-cin: 16 entries
tests: 3 entries
```

## Full tracked path snapshot
```
.github
.github/ISSUE_TEMPLATE
.github/ISSUE_TEMPLATE/implementation.yml
.github/ISSUE_TEMPLATE/specification.yml
.github/PULL_REQUEST_TEMPLATE.md
.github/workflows
.github/workflows/ci.yml
.github/workflows/cin-certificate-runner-e2e.yml
.github/workflows/cin-core.yml
.github/workflows/cin-genesis-lobby-pages.yml
.github/workflows/cin-local-backend-spec.yml
.github/workflows/cin-local-backend.yml
.github/workflows/linux-desktop-e2e.yml
.github/workflows/linux-portable-prototype.yml
.github/workflows/specification-validation.yml
CONTRIBUTING.md
Core Identification Node Github
Core Identification Node Github/CIN 001
Core Identification Node Github/CIN 001/README.md
Core Identification Node Github/CIN Lobby.url
Core Identification Node Github/CIN-GENESIS-ENVIRONMENT.cincert
Core Identification Node Github/CIN-GLOBAL-PERSONAL-DOCUMENT.cincert
Core Identification Node Github/CIN-NODE-BIRTH.cincert
Core Identification Node Github/CIN-PERSONAL-REGISTRATION.cincert
Core Identification Node Github/Documentation
Core Identification Node Github/Documentation/Architecture
Core Identification Node Github/Documentation/Architecture/CIN_GITHUB_LINKED_NODE_CREATION_WORKFLOW_SPECIFICATION_v1.0.md
Core Identification Node Github/Documentation/Architecture/CIN_GLOBAL_PERSONAL_DOCUMENT_AND_NODE_MARRIAGE_CERTIFICATE_v1.0.0.md
Core Identification Node Github/Documentation/Architecture/README.md
Core Identification Node Github/Documentation/Architecture/examples
Core Identification Node Github/Documentation/Architecture/examples/CIN-GLOBAL-PERSONAL-DOCUMENT-IDENTIFIER-TEST-VECTORS.json
Core Identification Node Github/Documentation/Architecture/schemas
Core Identification Node Github/Documentation/Architecture/schemas/CIN-GLOBAL-PERSONAL-DOCUMENT.schema.json
Core Identification Node Github/Documentation/Architecture/schemas/CIN-NODE-PERSONAL-DOCUMENT-MARRIAGE.schema.json
Core Identification Node Github/Documentation/Configuration
Core Identification Node Github/Documentation/Configuration/CIN_CONFIGURATION_ENGINE_EVOLUTION_SPECIFICATION_v1.0.md
Core Identification Node Github/Documentation/Configuration/CIN_INITIAL_ENVIRONMENT_CONFIGURATION_v1.0.md
Core Identification Node Github/Documentation/Configuration/README.md
Core Identification Node Github/Documentation/Configuration/cin-initial-environment.v1.json
Core Identification Node Github/Documentation/Decisions
Core Identification Node Github/Documentation/Decisions/README.md
Core Identification Node Github/Documentation/Implementation
Core Identification Node Github/Documentation/Implementation/README.md
Core Identification Node Github/Documentation/README.md
Core Identification Node Github/Documentation/Testing
Core Identification Node Github/Documentation/Testing/CIN_GLOBAL_PERSONAL_DOCUMENT_METAMASK_ACCEPTANCE_v1.0.md
Core Identification Node Github/Documentation/Testing/README.md
Core Identification Node Github/Install Genesis Manifest Certificate.url
Core Identification Node Github/README.md
Core Identification Node Github/cin-github-config.js
Core Identification Node Github/cin-github-lobby.js
Core Identification Node Github/cin-icon.svg
Core Identification Node Github/cin-local-runtime-test.js
Core Identification Node Github/index.html
Core Identification Node Github/manifest.webmanifest
Core Identification Node Github/service-worker.js
LICENSE.md
README.md
ROADMAP.md
SECURITY.md
certificates
certificates/CIN-GENESIS-ENVIRONMENT.cincert
docs
docs/architecture
docs/architecture/CIN_ARCHITECTURE_BASELINE_V1.md
docs/architecture/CIN_COMPONENT_DEPENDENCY_MAP.md
docs/architecture/CIN_DOMAIN_PRESENTATION_NODE_ADDRESSING_AND_BLOCK_EXPLORER_v1.0.md
docs/architecture/CIN_ENGINE_MANAGER_SPECIFICATION_V1.md
docs/architecture/CIN_ENTERPRISE_IDENTIFICATION_AND_PRIVATE_STORAGE.md
docs/architecture/CIN_IMPLEMENTATION_DIRECTORY_MAP.md
docs/architecture/CIN_MASTER_ARCHITECTURE_V1.md
docs/architecture/CIN_NETWORKS_NATIVE_ADDRESSING_AND_DOMAIN_REGISTRY_v1.2.md
docs/architecture/CIN_RECORD_STORAGE_LAYOUT.md
docs/architecture/CIN_REPOSITORY_TECHNICAL_AUDIT.md
docs/architecture/GENESIS_PREPARATION_ARCHITECTURE.md
docs/architecture/INDIVIDUAL_LIFECYCLE_AND_INITIAL_REGISTRATION.md
docs/architecture/LAYERED_PARTICIPATION_AND_INTEROPERABILITY.md
docs/architecture/NODE_LIFECYCLE_ARCHITECTURE.md
docs/architecture/PACKAGE_ORIGIN_VERIFICATION.md
docs/architecture/README.md
docs/assets
docs/assets/.gitkeep
docs/assets/cin-original-architecture.png
docs/decisions
docs/decisions/0001-genesis-manifest-and-node-birth-separation.md
docs/decisions/0002-portable-runtime-and-zip-packaging-model.md
docs/decisions/0003-document-serialization-and-signature-profile.md
docs/decisions/0005-zero-cost-node-operation.md
docs/decisions/README.md
docs/foundations
docs/foundations/CIN_FOUNDATIONAL_PRINCIPLES.md
docs/foundations/CIVILIZATIONAL_NEED_FOR_INDIVIDUAL_RECOGNITION.md
docs/foundations/INDIVIDUAL_PARTICIPATION_AND_NODE_ASSOCIATION.md
docs/foundations/PROFESSIONAL_DESIGN_AND_EDUCATIONAL_POSITION.md
docs/foundations/PROFESSIONAL_DESIGN_AND_EDUCATIONAL_POSITION_EN.md
docs/foundations/README.md
docs/foundations/RECOGNITION_PRIVACY_AND_PARTICIPATION.md
docs/project
docs/project/CIN_AUDIT_REPORT_2026-11-15.md
docs/project/CIN_MASTER_IMPLEMENTATION_WORKPLAN.md
docs/project/CIN_NODE_BIRTH_CERTIFICATE_DEVELOPMENT_PLAN_V1.md
docs/project/CIN_WORKFLOW_CATALOG.md
docs/project/DEVELOPMENT_BACKLOG.md
docs/project/GITHUB_DEVELOPMENT_WORKFLOW.md
docs/project/PROJECT_STATUS_AND_ROADMAP.md
docs/termux-local-backend
docs/termux-local-backend/API-SPECIFICATION.md
docs/termux-local-backend/ARCHITECTURE.md
docs/termux-local-backend/AUTHENTICATION.md
docs/termux-local-backend/GITHUB-ACTIONS.md
docs/termux-local-backend/IMPLEMENTATION-ROADMAP.md
docs/termux-local-backend/LOCAL-STATE-MANAGER.md
docs/termux-local-backend/PAIRING-ENGINE-IMPLEMENTATION.md
docs/termux-local-backend/PERMISSIONS-AND-STORAGE.md
docs/termux-local-backend/README.md
docs/termux-local-backend/RUNTIME-CONFIGURATION-MANAGER.md
docs/termux-local-backend/SPECIFICATION.json
docs/termux-local-backend/TERMUX-INSTALLATION.md
docs/termux-local-backend/TEST-PLAN.md
docs/testing
docs/testing/CIN_DESKTOP_E2E_TEST_PLAN.md
docs/testing/CIN_IMPLEMENTATION_TEST_STRATEGY.md
e2e
e2e/package.json
e2e/specs
e2e/specs/local-web-runtime.test.cjs
examples
examples/cin-genesis-environment-manifest-v1.example.json
prototype
prototype/cin-core
prototype/cin-core/Cargo.toml
prototype/cin-core/src
prototype/cin-core/src/bin
prototype/cin-core/src/bin/cin-certificate-runner.rs
prototype/cin-core/src/bin/cin-genesis-manifest.rs
prototype/cin-core/src/data_root.rs
prototype/cin-core/src/documents
prototype/cin-core/src/documents/mod.rs
prototype/cin-core/src/documents/model.rs
prototype/cin-core/src/documents/validation.rs
prototype/cin-core/src/error.rs
prototype/cin-core/src/genesis
prototype/cin-core/src/genesis/environment.rs
prototype/cin-core/src/genesis/mod.rs
prototype/cin-core/src/lib.rs
prototype/cin-core/src/lifecycle.rs
prototype/cin-core/src/recovery.rs
prototype/cin-core/src/schema.rs
prototype/cin-core/src/storage
prototype/cin-core/src/storage/mod.rs
prototype/cin-core/src/storage/repository.rs
prototype/cin-core/src/storage/transactional.rs
prototype/dist
prototype/dist/index.html
prototype/linux-runtime
prototype/linux-runtime/Cargo.toml
prototype/linux-runtime/README.md
prototype/linux-runtime/src
prototype/linux-runtime/src/browser.rs
prototype/linux-runtime/src/main.rs
prototype/linux-runtime/src/runtime_lifecycle.rs
requirements-ci.txt
research
research/dialogues
research/dialogues/CIVILIZATIONAL_RECOGNITION_MARS_EARTH_DIALOGUE.md
research/dialogues/README.md
schemas
schemas/cin-genesis-environment-manifest-v1.schema.json
scripts
scripts/ci
scripts/ci/validate_repository.py
scripts/ci/validate_schemas.py
scripts/package-linux-zip.sh
services
services/cin-github-oauth-worker
services/cin-github-oauth-worker/README.md
services/cin-github-oauth-worker/src
services/cin-github-oauth-worker/src/index.js
services/cin-github-oauth-worker/wrangler.toml
services/cin-local-backend
services/cin-local-backend/manager
services/cin-local-backend/manager/index.html
services/cin-local-backend/package.json
services/cin-local-backend/src
services/cin-local-backend/src/local-state-manager.js
services/cin-local-backend/src/pairing-engine.js
services/cin-local-backend/src/persistent-store.js
services/cin-local-backend/src/server.js
services/cin-local-backend/test
services/cin-local-backend/test/server.test.mjs
specifications
specifications/CIN_ANDROID_PWA_V1.md
specifications/CIN_CERTIFICATE_RUNNER_V1.md
specifications/CIN_COMMON_DOCUMENT_MODEL_V1.md
specifications/CIN_DATA_ROOT_RESOLVER_SPECIFICATION_V1.md
specifications/CIN_DOCUMENT_ENVELOPE_SPECIFICATION_V1.md
specifications/CIN_GENESIS_ENVIRONMENT_MANIFEST_V1.md
specifications/CIN_LOCAL_DOCUMENT_STORAGE_SPECIFICATION_V1.md
specifications/CIN_NODE_BIRTH_CERTIFICATE_SPEC_V1.md
specifications/CIN_NODE_IDENTIFIER_DERIVATION_PROFILE_V1_CANDIDATE.md
specifications/CIN_NODE_LIFECYCLE_SPECIFICATION_V1.md
specifications/CIN_PRIVATE_STORAGE_SPECIFICATION_V1.md
specifications/CIN_SCHEMA_VALIDATION_ENGINE_SPECIFICATION_V1.md
specifications/CIN_STORAGE_RECOVERY_SPECIFICATION_V1.md
specifications/CIN_TRANSACTIONAL_STORAGE_IMPLEMENTATION_V1.md
specifications/CIN_VERIFICATION_RESULT_MODEL_V1.md
specifications/PACKAGE_MANIFEST_SPECIFICATION_V1.md
specifications/examples
specifications/examples/cin-common-document-v1.example.json
specifications/examples/cin-verification-result-v1.example.json
specifications/schemas
specifications/schemas/cin-common-document-v1.schema.json
specifications/schemas/cin-node-birth-record-v1.schema.json
specifications/schemas/cin-verification-result-v1.schema.json
termux-cin
termux-cin/.env.example
termux-cin/.gitignore
termux-cin/README.md
termux-cin/package.json
termux-cin/src
termux-cin/src/authorization
termux-cin/src/authorization/permission-engine.js
termux-cin/src/github
termux-cin/src/github/connector.js
termux-cin/src/github/oauth.js
termux-cin/src/server.js
termux-cin/src/signatures
termux-cin/src/signatures/signature-interface.js
termux-cin/src/workspace
termux-cin/src/workspace/local-directory.js
tests
tests/termux-backend
tests/termux-backend/specification.test.mjs
```

## Main-owned directory snapshot

Branch Main path entries at this migration checkpoint: 137.

```text
Main/README.md
Main/applications
Main/applications/README.md
Main/architecture
Main/architecture/README.md
Main/build.sh
Main/core
Main/core/configuration
Main/core/configuration/README.md
Main/core/configuration/config.example.json
Main/core/domain
Main/core/domain/Cargo.toml
Main/core/domain/README.md
Main/core/domain/src
Main/core/domain/src/bin
Main/core/domain/src/bin/cin-certificate-runner.rs
Main/core/domain/src/bin/cin-genesis-manifest.rs
Main/core/domain/src/data_root.rs
Main/core/domain/src/documents
Main/core/domain/src/documents/mod.rs
Main/core/domain/src/documents/model.rs
Main/core/domain/src/documents/validation.rs
Main/core/domain/src/error.rs
Main/core/domain/src/genesis
Main/core/domain/src/genesis/environment.rs
Main/core/domain/src/genesis/mod.rs
Main/core/domain/src/lib.rs
Main/core/domain/src/lifecycle.rs
Main/core/domain/src/recovery.rs
Main/core/domain/src/schema.rs
Main/core/domain/src/storage
Main/core/domain/src/storage/mod.rs
Main/core/domain/src/storage/repository.rs
Main/core/domain/src/storage/transactional.rs
Main/core/lifecycle
Main/core/lifecycle/README.md
Main/core/module-manager
Main/core/module-manager/README.md
Main/core/module-manager/cin_module.py
Main/core/module-manager/modules
Main/core/module-manager/modules/cin-domain-core.json
Main/core/module-manager/modules/cin-local-backend.json
Main/core/module-manager/modules/cin-main-runtime.json
Main/core/module-manager/modules/cin-merkle-engine.json
Main/core/module-manager/modules/lindesk-android-bridge.json
Main/core/module-manager/test-module-manager.py
Main/core/runtime
Main/core/runtime/README.md
Main/core/runtime/cin_main.py
Main/core/service-manager
Main/core/service-manager/README.md
Main/engines
Main/engines/README.md
Main/engines/certificate
Main/engines/certificate/README.md
Main/engines/certificate/assets
Main/engines/certificate/assets/local
Main/engines/certificate/assets/local/CIN-GENESIS-ENVIRONMENT.cincert
Main/engines/certificate/assets/pages
Main/engines/certificate/assets/pages/CIN-GENESIS-ENVIRONMENT.cincert
Main/engines/certificate/assets/pages/CIN-GLOBAL-PERSONAL-DOCUMENT.cincert
Main/engines/certificate/assets/pages/CIN-NODE-BIRTH.cincert
Main/engines/certificate/assets/pages/CIN-PERSONAL-REGISTRATION.cincert
Main/engines/merkle-tree
Main/engines/merkle-tree/Cargo.toml
Main/engines/merkle-tree/README.md
Main/engines/merkle-tree/src
Main/engines/merkle-tree/src/lib.rs
Main/installation
Main/installation/android-termux
Main/installation/android-termux/.env.example
Main/installation/android-termux/.gitignore
Main/installation/android-termux/README-MAIN.md
Main/installation/android-termux/README.md
Main/installation/android-termux/install.sh
Main/installation/android-termux/package.json
Main/installation/android-termux/src
Main/installation/android-termux/src/authorization
Main/installation/android-termux/src/authorization/permission-engine.js
Main/installation/android-termux/src/github
Main/installation/android-termux/src/github/connector.js
Main/installation/android-termux/src/github/oauth.js
Main/installation/android-termux/src/server.js
Main/installation/android-termux/src/signatures
Main/installation/android-termux/src/signatures/signature-interface.js
Main/installation/android-termux/src/workspace
Main/installation/android-termux/src/workspace/local-directory.js
Main/installation/bootstrap
Main/installation/bootstrap/README.md
Main/installation/bridge
Main/installation/bridge/REQUEST-CONTRACT.md
Main/installation/deployment
Main/installation/deployment/README.md
Main/installation/lindesk
Main/installation/lindesk/README.md
Main/installation/linux
Main/installation/linux/INSTALLATION-MANIFEST.json
Main/installation/linux/README.md
Main/installation/linux/install.sh
Main/installation/linux/package-portable.sh
Main/installation/linux/uninstall.sh
Main/interfaces
Main/interfaces/local-web
Main/interfaces/local-web/index.html
Main/migration
Main/migration/FILE-MAPPING-PLAN.md
Main/migration/REPOSITORY-INVENTORY.md
Main/migration/STATUS.md
Main/runtime
Main/runtime/linux-portable
Main/runtime/linux-portable/Cargo.toml
Main/runtime/linux-portable/README.md
Main/runtime/linux-portable/src
Main/runtime/linux-portable/src/browser.rs
Main/runtime/linux-portable/src/main.rs
Main/runtime/linux-portable/src/runtime_lifecycle.rs
Main/services
Main/services/README.md
Main/services/cin-local-backend
Main/services/cin-local-backend/README.md
Main/services/cin-local-backend/manager
Main/services/cin-local-backend/manager/index.html
Main/services/cin-local-backend/package.json
Main/services/cin-local-backend/src
Main/services/cin-local-backend/src/local-state-manager.js
Main/services/cin-local-backend/src/pairing-engine.js
Main/services/cin-local-backend/src/persistent-store.js
Main/services/cin-local-backend/src/server.js
Main/services/cin-local-backend/test
Main/services/cin-local-backend/test/server.test.mjs
Main/storage
Main/storage/README.md
Main/system
Main/system/linux
Main/system/linux/README.md
Main/tests
Main/tests/smoke-test.sh
```

## Migration register
Main-owned copies are tracked in `FILE-MAPPING-PLAN.md`. The original source paths remain until compatibility checks, CI, and reference updates permit safe removal.
