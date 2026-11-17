import { URLSearchParams } from "node:url";

export function createOAuthService(config, session) {
  return {
    async exchange({ code, code_verifier, redirect_uri }) {
      if (!code || typeof code !== "string" || code.length > 2048) {
        const error = new Error("invalid_authorization_code"); error.status = 400; throw error;
      }
      if (!/^[A-Za-z0-9._~-]{43,128}$/.test(code_verifier || "")) {
        const error = new Error("invalid_pkce_verifier"); error.status = 400; throw error;
      }
      if (redirect_uri !== config.redirectUri) {
        const error = new Error("redirect_uri_mismatch"); error.status = 400; throw error;
      }
      const form = new URLSearchParams({
        client_id: config.clientId,
        client_secret: config.clientSecret,
        code,
        code_verifier,
        redirect_uri: config.redirectUri
      });
      const response = await fetch("https://github.com/login/oauth/access_token", {
        method: "POST",
        headers: { Accept: "application/json", "Content-Type": "application/x-www-form-urlencoded" },
        body: form
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok || !result.access_token) {
        const error = new Error(result.error_description || result.error || "github_oauth_exchange_failed");
        error.status = 401; throw error;
      }
      // Credential remains in this Termux process only; it is never returned to the browser.
      session.set(result.access_token, result.expires_in || 28800);
      return { connected: true, expires_in: result.expires_in || null, scope: result.scope || "" };
    }
  };
}
