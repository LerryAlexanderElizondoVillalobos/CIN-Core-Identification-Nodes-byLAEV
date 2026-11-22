# Main migration status

## Direction
Linux-first installation and runtime. Lindesk Android is the intended installation/control entry point. Integration is documented as a contract; no unsupported Lindesk transport/API is assumed.

## Functional source migration completed in this branch
- Portable Linux Rust runtime migrated to `Main/runtime/linux-portable`; package renamed `cin-linux-main`.
- Local web interface moved into `Main/interfaces/local-web` and embedded by the runtime.
- CIN domain-core Rust crate migrated into `Main/core/domain`; source modules and binaries copied with crate name `cin-core` preserved.
- Android/Termux integration source copied into `Main/installation/android-termux`, including OAuth, GitHub connector, authorization engine, signer interface, workspace adapter and setup.
- Local pairing/state backend copied into `Main/services/cin-local-backend`, including its manager UI, persistence, pairing engine and test.
- Linux installer, uninstaller and portable package builder are Main-owned.
- Linux CI/E2E workflows and test binary path redirected to Main; domain-core test stage added.
- Root README and Main architecture/migration docs updated.
- Full 233-entry root/path inventory created.

## Transitional duplicates
Original sources remain at `prototype/`, `termux-cin/`, and `services/`. They are preserved until CI validation and references are reconciled.

## Validation state
Repository-side changes and path migration have been confirmed through GitHub API. CI has been updated, but the migrated Rust builds, service tests, packaging, and Playwright E2E have **not yet completed** on GitHub Actions. Do not treat the migration as release-ready until these checks pass.

## Remaining migration work
1. Inspect and migrate the published Pages application/certificate assets without breaking the Pages publish workflow.
2. Integrate the Android backend and local backend into Main's service/module lifecycle.
3. Implement the Main module manager and engine installer/lifecycle beyond current documentation boundaries.
4. Verify installer on clean Linux, including no-Cargo and Cargo-present paths.
5. Review CI results; fix failures and update compatibility links.
6. Remove legacy duplicates only after acceptance and explicit path-reference review.
