(() => {
  "use strict";

  const ENDPOINT = "http://127.0.0.1:2112/health";
  const button = document.getElementById("testLocalRuntimeButton");
  const badge = document.getElementById("localRuntimeBadge");
  const status = document.getElementById("localRuntimeStatus");
  const output = document.getElementById("localRuntimeResult");

  if (!button || !badge || !status || !output) return;

  const show = (message, kind, label) => {
    status.textContent = message;
    status.className = "status " + kind;
    badge.textContent = label;
  };

  button.addEventListener("click", async () => {
    button.disabled = true;
    output.hidden = true;
    output.textContent = "";
    show("Requesting " + ENDPOINT + " …", "info", "Testing");

    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 7000);

    try {
      const response = await fetch(ENDPOINT, {
        method: "GET",
        mode: "cors",
        cache: "no-store",
        credentials: "omit",
        signal: controller.signal
      });

      const raw = await response.text();
      let data;
      try {
        data = JSON.parse(raw);
      } catch {
        throw new Error("The local endpoint responded, but its body was not valid JSON. HTTP " + response.status + ".");
      }

      output.hidden = false;
      output.textContent = JSON.stringify({
        http_status: response.status,
        response_ok: response.ok,
        endpoint: ENDPOINT,
        payload: data
      }, null, 2);

      if (!response.ok) {
        show("The local server responded, but returned HTTP " + response.status + ".", "error", "HTTP error");
      } else if (data && data.ok === true && data.project === "CIN byLAEV") {
        show("Connection successful. The Lobby received the CIN local runtime health response.", "ok", "Connected");
      } else {
        show("The endpoint is reachable, but its response does not match the expected CIN health payload.", "error", "Unexpected response");
      }
    } catch (error) {
      const detail = error && error.name === "AbortError"
        ? "The request timed out after 7 seconds."
        : (error && error.message) || String(error);
      show(
        "The Lobby could not complete the request. " + detail +
        " Check that Termux is running the server. If it is active, inspect Chrome's local-network permission and the browser console; CORS or browser Local Network Access policy may be blocking the request.",
        "error",
        "Not connected"
      );
      output.hidden = false;
      output.textContent = JSON.stringify({
        endpoint: ENDPOINT,
        result: "FETCH_FAILED",
        error_name: error && error.name || "Error",
        error: detail
      }, null, 2);
    } finally {
      window.clearTimeout(timeout);
      button.disabled = false;
    }
  });
})();
