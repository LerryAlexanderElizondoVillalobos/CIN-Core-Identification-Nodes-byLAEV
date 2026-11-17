# CIN GitHub OAuth Exchange Worker

This Worker is the confidential OAuth code-exchange endpoint for the static CIN Genesis Lobby.

## Why a Worker is required

GitHub Pages publishes static files and cannot safely hold a GitHub App client secret. The browser redirects the operator to GitHub; GitHub returns a temporary authorization code to the Pages callback; this Worker exchanges that code using the GitHub App client secret. The client secret never enters the published website.

The page uses Authorization Code + PKCE. The GitHub App user token is restricted to the configured CIN repository by repository_id during exchange. The browser keeps the resulting short-lived token in memory only, not in localStorage, sessionStorage, page files or Git commits.

## Deployment

Deploy src/index.js as a Cloudflare Worker or equivalent HTTPS serverless function. A Wrangler configuration template is included as wrangler.toml.

Configure these Worker variables:

| Name | Type | Value |
|---|---|---|
| CIN_GITHUB_APP_CLIENT_ID | Variable | Client ID from the GitHub App registration |
| CIN_GITHUB_APP_CLIENT_SECRET | Secret | Client secret from the GitHub App registration |
| CIN_TARGET_REPOSITORY_ID | Variable | 1458540194 |
| CIN_ALLOWED_ORIGIN | Variable | https://lerryalexanderelizondovillalobos.github.io |
| CIN_OAUTH_REDIRECT_URI | Variable | https://lerryalexanderelizondovillalobos.github.io/CIN-Core-Identification-Nodes-byLAEV/ |

Expose GET /health and POST /oauth/exchange.

### Wrangler deployment

1. Replace the placeholder client ID in wrangler.toml with the GitHub App Client ID.
2. From this directory, run `npx wrangler secret put CIN_GITHUB_APP_CLIENT_SECRET` and paste the Client Secret into the hidden prompt. Never commit it or send it in chat.
3. Run `npx wrangler deploy`.
4. Confirm `https://<your-worker-host>/health` returns the ready status.
5. In `Core Identification Node Github/cin-github-config.js`, set `clientId` to the same public Client ID, `tokenExchangeEndpoint` to `https://<your-worker-host>/oauth/exchange`, and `enabled` to `true`.

After configuring the public file, the GitHub Pages workflow publishes the update. The Worker endpoint must use HTTPS and its callback/origin variables must exactly match the Pages origin and redirect URI.

## GitHub App configuration

Create a GitHub App under the operator's GitHub account:

- Homepage URL: the CIN GitHub Pages URL.
- Callback URL: the exact CIN_OAUTH_REDIRECT_URI above.
- Request user authorization (OAuth): enabled.
- Account installation: install only on CIN-Core-Identification-Nodes-byLAEV.
- Repository permissions: Contents — Read and write; Metadata — Read-only.
- No Actions, Workflows, Administration, Issues, Packages or organization permissions are required for this flow.

The app must be installed on the selected repository and the operator must authorize the app. Do not enable Device Flow for this browser-based Lobby.

## Browser-side behavior

The Lobby:
1. Generates a random PKCE verifier and state value.
2. Redirects to GitHub's OAuth authorization page.
3. Validates the returned state.
4. Sends the one-time code and PKCE verifier to this Worker.
5. Receives a repository-restricted user access token.
6. Calls GitHub APIs as the operator and validates the expected repository.
7. Holds the access token only in page memory. Reloading the page requires reconnecting. The exchange Worker does not return refresh tokens to the browser; reconnect after the access token expires.

## Operational limits

- The repository is public. Any file committed below Core Identification Node Github is publicly readable and is published by the GitHub Pages deployment workflow.
- The Worker does not store operator tokens or personal records.
- The Worker does not sign CIN documents and contains no CIN signing key.
- GitHub connection authorizes repository operations; it is not Node Birth Authorization or Personal Issuance Authorization.
- The Worker source in this repository is not a deployed service. Deployment and GitHub App registration are separate setup actions.
