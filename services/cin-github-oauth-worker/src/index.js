/**
 * CIN GitHub OAuth exchange service.
 *
 * Deploy as a Cloudflare Worker (or equivalent serverless HTTPS function).
 * The GitHub App client secret MUST remain in the Worker environment.
 *
 * Required Worker variables/secrets:
 *   CIN_GITHUB_APP_CLIENT_ID
 *   CIN_GITHUB_APP_CLIENT_SECRET  (secret)
 *   CIN_TARGET_REPOSITORY_ID      (1458540194 for the current CIN repo)
 *   CIN_ALLOWED_ORIGIN            (https://lerryalexanderelizondo.github.io)
 *   CIN_OAUTH_REDIRECT_URI        (exact GitHub Pages callback URL)
 */
const json = (body, status, origin) => new Response(JSON.stringify(body), {
  status,
  headers: {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "POST, OPTIONS, GET",
    "Access-Control-Allow-Headers": "Content-Type",
    "Vary": "Origin"
  }
});

export default {
  async fetch(request, env) {
    const allowedOrigin = env.CIN_ALLOWED_ORIGIN;
    const origin = request.headers.get("Origin") || "";
    if (!allowedOrigin || origin !== allowedOrigin) {
      return new Response("Origin not allowed", { status: 403 });
    }

    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: {
          "Access-Control-Allow-Origin": allowedOrigin,
          "Access-Control-Allow-Methods": "POST, OPTIONS, GET",
          "Access-Control-Allow-Headers": "Content-Type",
          "Access-Control-Max-Age": "600",
          "Vary": "Origin"
        }
      });
    }

    const url = new URL(request.url);
    if (url.pathname === "/health" && request.method === "GET") {
      return json({ service: "cin-github-oauth-exchange", status: "ready" }, 200, allowedOrigin);
    }
    if (url.pathname !== "/oauth/exchange" || request.method !== "POST") {
      return json({ error: "not_found" }, 404, allowedOrigin);
    }

    if (!env.CIN_GITHUB_APP_CLIENT_ID ||
        !env.CIN_GITHUB_APP_CLIENT_SECRET ||
        !env.CIN_TARGET_REPOSITORY_ID ||
        !env.CIN_OAUTH_REDIRECT_URI) {
      return json({ error: "worker_configuration_incomplete" }, 503, allowedOrigin);
    }

    let input;
    try { input = await request.json(); }
    catch { return json({ error: "invalid_json" }, 400, allowedOrigin); }

    const code = typeof input.code === "string" ? input.code : "";
    const verifier = typeof input.code_verifier === "string" ? input.code_verifier : "";
    const redirectUri = typeof input.redirect_uri === "string" ? input.redirect_uri : "";

    if (!code || code.length > 2048 || !/^[A-Za-z0-9._~-]{43,128}$/.test(verifier)) {
      return json({ error: "invalid_oauth_exchange_parameters" }, 400, allowedOrigin);
    }
    if (redirectUri !== env.CIN_OAUTH_REDIRECT_URI) {
      return json({ error: "redirect_uri_mismatch" }, 400, allowedOrigin);
    }

    const form = new URLSearchParams({
      client_id: env.CIN_GITHUB_APP_CLIENT_ID,
      client_secret: env.CIN_GITHUB_APP_CLIENT_SECRET,
      code,
      redirect_uri: redirectUri,
      code_verifier: verifier,
      repository_id: String(env.CIN_TARGET_REPOSITORY_ID)
    });

    let tokenResponse;
    try {
      tokenResponse = await fetch("https://github.com/login/oauth/access_token", {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: form.toString()
      });
    } catch {
      return json({ error: "github_token_service_unreachable" }, 502, allowedOrigin);
    }

    let token;
    try { token = await tokenResponse.json(); }
    catch { return json({ error: "github_token_response_invalid" }, 502, allowedOrigin); }

    if (!tokenResponse.ok || !token.access_token) {
      // Deliberately do not log or echo authorization codes, secrets or tokens.
      return json({
        error: token.error || "github_authorization_failed",
        error_description: token.error_description || "GitHub did not issue an access token."
      }, 401, allowedOrigin);
    }

    // The short-lived, repository-restricted user token is returned to the page.
    // The page keeps it in memory only and never writes it to GitHub or browser storage.
    return json({
      access_token: token.access_token,
      token_type: token.token_type || "bearer",
      scope: token.scope || "",
      expires_in: token.expires_in || null,
    }, 200, allowedOrigin);
  }
};
