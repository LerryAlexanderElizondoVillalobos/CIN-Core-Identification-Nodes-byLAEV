import http from "node:http";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { createPairingEngine } from "./pairing-engine.js";
import { createLocalStateManager } from "./local-state-manager.js";

export const HOST = "127.0.0.1";
export const DEFAULT_PORT = 2112;
export const ALTERNATIVE_PORT = 1221;

const managerPath = fileURLToPath(new URL("../manager/index.html", import.meta.url));

function sendJson(response, statusCode, payload, headers = {}) {
  response.writeHead(statusCode, { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff", ...headers });
  response.end(JSON.stringify(payload));
}
function readBody(request) {
  return new Promise((resolve, reject) => {
    let body = "";
    request.setEncoding("utf8");
    request.on("data", chunk => {
      body += chunk;
      if (body.length > 16384) reject(new Error("REQUEST_TOO_LARGE"));
    });
    request.on("end", () => {
      try { resolve(body ? JSON.parse(body) : {}); }
      catch { reject(new Error("INVALID_JSON")); }
    });
    request.on("error", reject);
  });
}
function isAllowedOrigin(origin, lobbyOrigin) {
  return !origin || origin === lobbyOrigin || /^http:\/\/127\.0\.0\.1:\d+$/.test(origin);
}
function originHeaders(origin, lobbyOrigin) {
  if (!origin || origin !== lobbyOrigin) return {};
  return { "Access-Control-Allow-Origin": lobbyOrigin, "Access-Control-Allow-Methods": "GET, POST, OPTIONS", "Access-Control-Allow-Headers": "Content-Type, X-CIN-Session-Id, Authorization", "Vary": "Origin" };
}

export function createAppServer({ dataDir, stateManager: providedStateManager } = {}) {
  const stateManager = providedStateManager ?? createLocalStateManager(dataDir ? { directory: dataDir } : {});
  const runtimeConfiguration = stateManager.getDomain("configuration");
  const pairing = createPairingEngine({ store: stateManager, configuration: runtimeConfiguration });
  return http.createServer(async (request, response) => {
    const url = new URL(request.url ?? "/", "http://127.0.0.1");
    const origin = request.headers.origin;
    const lobbyOrigin = stateManager.getDomain("configuration").lobby_origin;
    const cors = originHeaders(origin, lobbyOrigin);

    if (origin && !isAllowedOrigin(origin, lobbyOrigin)) {
      sendJson(response, 403, { ok: false, error: { code: "ORIGIN_DENIED", message: "Request origin is not approved." } });
      return;
    }
    if (request.method === "OPTIONS") {
      if (!cors["Access-Control-Allow-Origin"]) {
        sendJson(response, 403, { ok: false, error: { code: "ORIGIN_DENIED", message: "Preflight origin is not approved." } });
        return;
      }
      response.writeHead(204, { ...cors, "Access-Control-Max-Age": "600" }); response.end(); return;
    }

    if (url.pathname === "/health" && request.method === "GET") {
      sendJson(response, 200, { ok: true, service: "cin-local-backend", state: "running", bind_address: HOST, port: request.socket.localPort }); return;
    }
    if (url.pathname === "/api/v1/status" && request.method === "GET") {
      sendJson(response, 200, { ok: true, data: {
        service: "cin-local-backend", version: "0.3.0", runtime: "node", bind_address: HOST,
        port: request.socket.localPort, github: "not-connected", repository: "not-configured",
        pairing: "available", persistence: stateManager.status()
      } }, cors); return;
    }

    if (url.pathname === "/api/v1/configuration" && request.method === "GET") {
      if (origin && !/^http:\/\/127\.0\.0\.1:\d+$/.test(origin)) {
        sendJson(response, 403, { ok: false, error: { code: "LOCAL_MANAGER_ONLY", message: "Runtime configuration is available only from the local Backend Manager." } }); return;
      }
      sendJson(response, 200, { ok: true, data: stateManager.getDomain("configuration") }); return;
    }

    if (url.pathname === "/api/v1/configuration" && request.method === "PUT") {
      if (origin && !/^http:\/\/127\.0\.0\.1:\d+$/.test(origin)) {
        sendJson(response, 403, { ok: false, error: { code: "LOCAL_MANAGER_ONLY", message: "Runtime configuration can be changed only from the local Backend Manager." } }); return;
      }
      try {
        const body = await readBody(request);
        const updated = stateManager.updateConfiguration(body);
        pairing.configure(updated);
        sendJson(response, 200, { ok: true, data: { configuration: updated, restart_required: updated.backend_port !== request.socket.localPort } });
      } catch (error) {
        sendJson(response, 400, { ok: false, error: { code: "INVALID_CONFIGURATION", message: error.message } });
      }
      return;
    }

    if (url.pathname === "/api/v1/pairing/request" && request.method === "POST") {
      try {
        const body = await readBody(request);
        const result = pairing.request({ origin: origin ?? "local-manager", label: body.label });
        sendJson(response, 201, { ok: true, data: result }, cors);
      } catch (error) {
        sendJson(response, 400, { ok: false, error: { code: "INVALID_REQUEST", message: error.message === "REQUEST_TOO_LARGE" ? "Request body is too large." : "A valid JSON body is required." } }, cors);
      } return;
    }

    if (url.pathname === "/api/v1/pairing/status" && request.method === "GET") {
      const id = url.searchParams.get("request_id");
      if (id) {
        const result = pairing.poll(id, url.searchParams.get("poll_secret"));
        sendJson(response, result.state === "NOT_FOUND" ? 404 : 200, { ok: result.state !== "NOT_FOUND", data: result }, cors);
      } else sendJson(response, 200, { ok: true, data: pairing.list() }, cors);
      return;
    }

    if (url.pathname === "/api/v1/pairing/approve" && request.method === "POST") {
      try {
        const body = await readBody(request), result = pairing.approve(body.request_id);
        sendJson(response, result ? 200 : 409, result ? { ok: true, data: result } : { ok: false, error: { code: "PAIRING_NOT_PENDING", message: "The request is unavailable, expired or already processed." } });
      } catch { sendJson(response, 400, { ok: false, error: { code: "INVALID_REQUEST", message: "A valid JSON body is required." } }); }
      return;
    }

    if (url.pathname === "/api/v1/pairing/reject" && request.method === "POST") {
      try {
        const body = await readBody(request), rejected = pairing.reject(body.request_id);
        sendJson(response, rejected ? 200 : 409, rejected ? { ok: true, data: { request_id: body.request_id, state: "REJECTED" } } : { ok: false, error: { code: "PAIRING_NOT_PENDING", message: "The request is unavailable, expired or already processed." } });
      } catch { sendJson(response, 400, { ok: false, error: { code: "INVALID_REQUEST", message: "A valid JSON body is required." } }); }
      return;
    }

    if (url.pathname === "/api/v1/pairing/revoke" && request.method === "POST") {
      try {
        const body = await readBody(request), revoked = pairing.revoke(body.session_id);
        sendJson(response, revoked ? 200 : 404, revoked ? { ok: true, data: { session_id: body.session_id, state: "REVOKED" } } : { ok: false, error: { code: "SESSION_NOT_FOUND", message: "Session was not found or is no longer active." } });
      } catch { sendJson(response, 400, { ok: false, error: { code: "INVALID_REQUEST", message: "A valid JSON body is required." } }); }
      return;
    }

    if ((url.pathname === "/manager" || url.pathname === "/manager/") && request.method === "GET") {
      try {
        const html = await readFile(managerPath, "utf8");
        response.writeHead(200, { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" });
        response.end(html);
      } catch { sendJson(response, 500, { ok: false, error: { code: "MANAGER_UNAVAILABLE", message: "The local Manager interface could not be loaded." } }); }
      return;
    }

    const known = ["/health", "/api/v1/status", "/api/v1/configuration", "/api/v1/pairing/request", "/api/v1/pairing/status", "/api/v1/pairing/approve", "/api/v1/pairing/reject", "/api/v1/pairing/revoke", "/manager", "/manager/"];
    if (known.includes(url.pathname)) {
      response.setHeader("Allow", url.pathname === "/api/v1/configuration" ? "GET, PUT, OPTIONS" : (url.pathname.includes("pairing") ? "GET, POST, OPTIONS" : "GET, OPTIONS"));
      sendJson(response, 405, { ok: false, error: { code: "METHOD_NOT_ALLOWED", message: "Method not allowed." } }, cors); return;
    }
    sendJson(response, 404, { ok: false, error: { code: "NOT_FOUND", message: "Route not found." } }, cors);
  });
}

export function configuredPort(environment = process.env, configuration = {}) {
  const raw = environment.CIN_LOCAL_BACKEND_PORT ?? String(configuration.backend_port ?? DEFAULT_PORT), port = Number(raw);
  if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error("CIN_LOCAL_BACKEND_PORT must be an integer between 1 and 65535.");
  return port;
}
export async function startServer(port) {
  const stateManager = createLocalStateManager();
  const selectedPort = port ?? configuredPort(process.env, stateManager.getDomain("configuration"));
  const server = createAppServer({ stateManager });
  await new Promise((resolve, reject) => { server.once("error", reject); server.listen(selectedPort, HOST, resolve); });
  return server;
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const server = await startServer(), address = server.address();
    process.stdout.write(`CIN Local Backend listening at http://${HOST}:${address.port}\n`);
    process.on("SIGINT", () => server.close(() => process.exit(0)));
    process.on("SIGTERM", () => server.close(() => process.exit(0)));
  } catch (error) {
    process.stderr.write(`CIN Local Backend failed to start: ${error.message}\n`);
    process.exitCode = 1;
  }
}
