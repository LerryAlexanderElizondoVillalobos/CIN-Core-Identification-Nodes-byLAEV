# Implementation Roadmap

**Version:** 1.3.0 · **Status:** Active planning baseline

## Phase 0 — Repository baseline
- Preserve the existing Pages Lobby, PKCE code and OAuth Worker while the migration is unproven.
- Confirm record contracts and exact writable CIN 001 subdirectories.
- Confirm the selected GitHub App's Device Flow configuration and permissions.
- Confirm supported Android version, Termux and browser targets.

**Exit:** reviewed migration plan and approved path allowlist.

## Phase 1 — Loopback proof of feasibility
- Minimal Node server on 127.0.0.1:2112.
- Health endpoint only.
- Request from deployed Pages origin on target Android browser.
- Test local-network permission, preflight and PWA behavior.
- Test explicit alternative port 1221.

**Exit:** demonstrated actual browser compatibility or approved alternative UX.

## Phase 2 — Backend foundation and Manager
- Node project and pinned dependencies.
- Loopback-only server, status API and Manager dashboard.
- Termux start/stop and diagnostics.

## Phase 2.5 — Persistent state and runtime configuration
- Shared Local State Manager with named state domains and schema migration.
- Persistent configuration for Lobby origin, backend port, pairing/session TTLs and event retention.
- Local-only configuration API and editable Backend Manager panel.
- Immediate application of Lobby origin and lifecycle settings; persisted port changes apply after restart.
- Automated Node.js 22 test workflow for the local backend.

**Exit:** automated backend tests pass; configuration survives restart; target Termux/Android validation is recorded.

## Phase 3 — Pairing
- Lobby pairing request and Manager approval.
- Revocable local sessions.
- Exact Pages origin policy and mutation protections.

## Phase 4 — GitHub Device Flow
- Verify GitHub App settings.
- Implement start, polling, slow_down, denial, expiry and success.
- Private token storage and refresh only when supported.
- Verify account and repository ID/permissions.

## Phase 5 — Repository adapter
- Read tree/file, create and update file.
- Approved path root and operation allowlist.
- GitHub Contents SHA concurrency handling.
- Safe operation history and public disclosure.

## Phase 6 — Lobby migration
- Local backend connector and status UI.
- Replace browser token handling only after full acceptance.
- Keep rollback to existing PKCE/Worker path until approved.

## Phase 7 — CI, Android acceptance and integration
- Unit, mock integration and specification tests.
- Actual Android/Termux/browser tests.
- Security/data disclosure review.
- Migration evidence and PR review.

## Branch strategy

Current implementation branch: `feat/pairing-engine-backend-manager`, based on `feat/termux-local-backend` and tracked in Pull Request #38. Changes remain isolated from `main` and CIN foundational engines until reviewed and merged.

## First-release exclusions

Cloudflare Worker, Actions/Workflows permissions, arbitrary repository proxy, deletion, repository administration, offline write queue, signing key custody, CIN lifecycle issuance and changes to the portable ZIP runtime.
