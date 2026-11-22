# Main migration status

## Direction
Linux-first installation and runtime. Lindesk Android is the intended installation/control entry point. Its concrete transport remains specification-only until the actual Lindesk capability surface is verified.

## Functional source migrated into Main
- Portable Linux Rust runtime migrated to `Main/runtime/linux-portable` and renamed to binary `cin-linux-main`.
- Embedded local web UI moved into `Main/interfaces/local-web`.
- CIN domain-core Rust crate migrated into `Main/core/domain`; all original source modules and CLI binaries copied, with crate name `cin-core` preserved.
- Android/Termux integration copied into `Main/installation/android-termux`, including OAuth, scoped GitHub connector, permission engine, signer interface, workspace and installer.
- Local pairing/state backend and tests copied into `Main/services/cin-local-backend`.
- Declarative module registry and CLI implemented under `Main/core/module-manager`, including descriptors, dependency enablement, platform checks, configuration persistence and unit tests.
- Linux installer/uninstaller and portable package builder are Main-owned.
- CI/E2E workflows and browser E2E target moved to Main paths; Node 22 setup and module-manager validation added.
- Full 233-entry repository path inventory captured.
- Root README restored in full with migration notice; Main architecture, installation and migration documentation updated.

## Transitional duplicates
Original source trees remain under `prototype/`, `termux-cin/`, and `services/` while validation runs. Published Pages source remains at its existing path to preserve its deployment workflow.

## Validation state
- GitHub API tree confirms complete source copies for the Rust runtime and CIN core.
- GitHub API confirms Main path organization, migrated test target and workflows.
- CI is triggered for the migration branch, but tests/builds must finish successfully before this branch is merge-ready.
- Local clone/build could not be performed in this environment because github.com DNS resolution failed.

## Remaining work
1. Review Main Linux install/build paths and execute clean-install acceptance tests.
2. Integrate service enablement into actual module lifecycle (registry currently manages declarative enablement only).
3. Migrate Pages application and certificate assets without breaking publishing.
4. Implement runtime loading/start/stop of modules and specialized engines.
5. Confirm Lindesk transport and implement the actual bridge.
6. Remove duplicate legacy sources only after Main acceptance and reference cleanup.
