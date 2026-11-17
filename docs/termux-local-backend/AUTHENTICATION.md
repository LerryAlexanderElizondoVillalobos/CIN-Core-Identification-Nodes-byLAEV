# GitHub Authentication — Device Authorization Flow

**Version:** 1.3.0 · **Status:** Proposed; GitHub App configuration must be verified

## Selected user experience

The Termux backend displays a short GitHub user code and verification URL. The operator opens GitHub's official device verification flow, preferably in the GitHub mobile app where Android offers that option, enters the code and approves the application. Browser verification remains a supported fallback.

Official verification URL: `https://github.com/login/device`

## Current repository behavior

The existing Lobby currently implements GitHub App Authorization Code + PKCE and exchanges the one-time code through `services/cin-github-oauth-worker/`. The Termux Device Flow is a migration target, not current behavior. Do not delete or disable the existing route until the replacement passes acceptance.

## Prerequisites

1. Verify Device Flow is enabled/supported for the selected GitHub App in its current settings.
2. Verify current GitHub App Device Flow API requirements, polling interval, expiration, error states and token response.
3. Confirm Contents read/write and Metadata read-only are sufficient.
4. Confirm the app is installed only on the intended repository where the installation model permits.
5. Test with the actual account and app before removing existing authentication.

Do not infer token lifetime or refresh behavior from assumptions. Read and implement the exact current GitHub response fields. When expiring user tokens are enabled, persist access-token expiry and refresh-token rotation metadata if returned. Handle pending, slow_down, access_denied, expired_token and success according to GitHub's current contract.

## Flow

1. Manager starts Device Flow using the public GitHub App Client ID.
2. GitHub returns device code, user code, verification URI, expiry and polling interval.
3. Backend stores device code only in Termux private storage/memory and displays user code + URL.
4. Operator authorizes at GitHub.
5. Backend polls at the required interval, including slow_down behavior.
6. On success, backend stores token data in Termux private storage.
7. Backend verifies `/user`, repository ID `1458540194` and effective repository permissions.
8. Lobby receives only connection status and operation results.

## Credential handling

No GitHub client secret, device code, access token or refresh token may enter GitHub Pages JavaScript, local pairing responses, logs, public repository files or CI artifacts. A native/local public client must not pretend a distributed client secret is confidential. Follow GitHub's current Device Flow requirements for the selected GitHub App.

## Disconnect and refresh

Refresh only if the GitHub response and current documentation support it. Persist rotated credentials atomically. If refresh fails or is unavailable, clear invalid credentials and require a new Device Flow. Disconnect revokes tokens where supported and clears local token/session state.

## Authority boundary

GitHub account linking authenticates the repository operator. It does not authorize node birth, personal registration, certificate issuance, record signing or other CIN lifecycle events.
