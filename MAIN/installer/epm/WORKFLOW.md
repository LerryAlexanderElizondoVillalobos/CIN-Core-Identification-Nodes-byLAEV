# CIN EPM — Development and Release Workflow

## Development loop
1. Define one focused capability and acceptance test.
2. Implement functional behavior in the POSIX Shell engine, never independently in the UI.
3. Keep the CLI contract stable; Desktop calls the same `epm` entry point.
4. Add normal, missing-capability and unsupported-environment tests.
5. Run `sh -n` and `sh tests/test-epm.sh`.
6. Run GitHub Actions and inspect every job.
7. Download and manually test both generated editions.
8. Update compatibility claims only after real distribution qualification.

## Shared interface contract
- `epm --report`: environment and compatibility report.
- `epm --system`: environment facts.
- `epm --compatibility`: current Lobby compatibility evaluation.
- `epm --version`, `epm --help`.

Output is line-oriented `key=value`, avoiding a JSON parser requirement in Terminal. Values remain single-line; new keys are additive and existing meanings stable.

## Branch/review
Use a focused branch. Keep changes inside `MAIN/installer/epm/` and its dedicated workflow. Do not change Main Lobby installation behavior as part of EPM. Merge only after required CI jobs pass and artifacts are downloadable.

## CI artifacts
- `cin-epm-terminal-<version>.tar.gz`
- `cin-epm-desktop-<version>.tar.gz`
- SHA-256 checksum file.

Workflow artifacts are for manual testing. A formal public release must additionally follow the project's authenticated signing and provenance policy.
