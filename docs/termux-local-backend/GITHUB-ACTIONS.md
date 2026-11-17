# GitHub Actions Plan

**Version:** 1.3.0 · **Status:** Initial specification workflow implemented on feature branch

## Existing automation

The repository already has:
- `.github/workflows/ci.yml` — repository/documentation checks, workflow YAML parsing and existing Lobby/Worker validation.
- `.github/workflows/specification-validation.yml` — documentation references and schema examples.
- Additional CIN runtime/prototype workflows.

The Termux work adds a focused workflow rather than replacing existing CI.

## Initial workflow

`.github/workflows/cin-local-backend-spec.yml` runs for:
- pushes to `feat/termux-local-backend` affecting the package/tests/workflow;
- pull requests to `main` affecting the same paths;
- manual dispatch.

It uses read-only repository permissions, pinned checkout action, Node's built-in test runner and no production credentials.

## Current tests

The initial suite validates specification constants, file presence, loopback/port settings, authentication boundaries, path/publication boundaries and the absence of Actions permissions in the backend contract. It does not claim to test a server that has not yet been implemented.

## Next CI expansion

As functional modules land, add:
- Node syntax/lint checks and unit tests;
- Device Flow response-state tests using fixtures;
- path-policy and repository adapter tests;
- mocked GitHub Contents API tests, including SHA conflicts;
- secret-redaction tests;
- API integration tests.

No live personal token or private record may be used in public CI. No workflow should deploy to Pages or write to the default branch as a side effect of tests. Third-party actions must be pinned to full commit SHAs.
