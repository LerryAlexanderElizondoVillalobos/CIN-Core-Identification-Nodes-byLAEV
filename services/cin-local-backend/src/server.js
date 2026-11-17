import http from "node:http";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { createPairingEngine } from "./pairing-engine.js";

export const HOST = "127.0.0.1";
export const DEFAULT_PORT = 2112;
export const ALTERNATIVE_PORT = 1221;
const LOBBY_ORIGIN = process.env.CIN_LOBBY_ORIGIN ?? "https://lerryalexanderelizondo.github.io";
const managerPath = fileURLToPath(new URL("../manager/index.html", import.meta.url));
const pairing = createPairingEngine();

function sendJson(response, statusCode, payload, headers = {}) {
  response.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    "X-Content-Type-Options": "nosniff",
    ...headers
  });
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
function originHeaders(origin) {
  if (!origin || origin !== LOBBY_ORIGIN) return {};
  return {
    "Access-Control-Allow-Origin": LOBBY_ORIGIN,
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-CIN-Session-Id, Authorization",
    "Vary": "Origin"
  };
}

export function createAppServer() {
  return http.createServer(async (request, response) => {
    const url = new URL(request.url ?? "/", "http://127.0.0.1");
    const origin = request.headers.origin;
    const cors = originHeaders(origin);

    if (origin && !cors["Access-Control-Allow-Origin"]) {
      sendJson(response, 403, { ok: false, error: { code: "ORIGIN_DENIED", message: "Request origin is not approved." } });
      return;
    }
    if (request.method === "OPTIONS") {
      if (!cors["Access-Control-Allow-Origin"]) {
        sendJson(response, 403, { ok: false, error: { code: "ORIGIN_DENIED", message: "Preflight origin is not approved." } });
        return;
      }
      response.writeHead(204, { ...cors, "Access-Control-Max-Age": "600" });
      response.end();
      return;
    }

    if (url.pathname === "/health" && request.method === "GET") {
      sendJson(response, 200, { ok: true, service: "cin-local-backend", state: "running", bind_address: HOST, port: request.socket.localPort });
      return;
    }
    if (url.pathname === "/api/v1/status" && request.method === "GET") {
      sendJson(response, 200, { ok: true, data: {
        service: "cin-local-backend", version: "0.2.0", runtime: "node",
        bind_address: HOST, port: request.socket.localPort,
        github: "not-connected", repository: "not-configured", pairing: "available"
      } }, cors);
      return;
    }

    if (url.pathname === "/api/v1/pairing/request" && request.method === "POST") {
      try {
        const body = await readBody(request);
        const result = pairing.request({ origin: origin ?? "local-manager", label: body.label });
        sendJson(response, 201, { ok: true, data: result }, cors);
      } catch (error) {
        sendJson(response, 400, { ok: false, error: { code: "INVALID_REQUEST", message: error.message === "REQUEST_TOO_LARGE" ? "Request body is too large." : "A valid JSON body is required." } }, cors);
      }
      return;
    }

    if (url.pathname === "/api/v1/pairing/status" && request.method === "GET") {
      const id = url.searchParams.get("request_id");
      if (id) {
        const result = pairing.poll(id, url.searchParams.get("poll_secret"));
        sendJson(response, result.state === "NOT_FOUND" ? 404 : 200, { ok: result.state !== "NOT_FOUND", data: result }, cors);
      } else {
        sendJson(response, 200, { ok: true, data: pairing.list() });
      }
      return;
    }

    if (url.pathname === "/api/v1/pairing/approve" && request.method === "POST") {
      try {
        const body = await readBody(request);
        const result = pairing.approve(body.request_id);
        sendJson(response, result ? 200 : 409, result ? { ok: true, data: result } : { ok: false, error: { code: "PAIRING_NOT_PENDING", message: "The request is unavailable, expired or already processed." } });
      } catch {
        sendJson(response, 400, { ok: false, error: { code: "INVALID_REQUEST", message: "A valid JSON body is required." } });
      }
      return;
    }

    if (url.pathname === "/api/v1/pairing/revoke" && request.method === "POST") {
      try {
        const body = await readBody(request);
        const revoked = pairing.revoke(body.session_id);
        sendJson(response, revoked ? 200 : 404, revoked ? { ok: true, data: { session_id: body.session_id, state: "REVOKED" } } : { ok: false, error: { code: "SESSION_NOT_FOUND", message: "Session was not found or is no longer active." } });
      } catch {
        sendJson(response, 400, { ok: false, error: { code: "INVALID_REQUEST", message: "A valid JSON body is required." } });
      }
      return;
    }

    if ((url.pathname === "/manager" || url.pathname === "/manager/") && request.method === "GET") {
      try {
        const html = await readFile(managerPath, "utf8");
        response.writeHead(200, { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" });
        response.end(html);
      } catch {
        sendJson(response, 500, { ok: false, error: { code: "MANAGER_UNAVAILABLE", message: "The local Manager interface could not be loaded." } });
      }
      return;
    }

    response.setHeader("Allow", "GET, POST, OPTIONS");
    sendJson(response, 404, { ok: false, error: { code: "NOT_FOUND", message: "Route not found." } }, cors);
  });
}

export function configuredPort(environment = process.env) {
  const raw = environment.CIN_LOCAL_BACKEND_PORT ?? String(DEFAULT_PORT);
  const port = Number(raw);
  if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error("CIN_LOCAL_BACKEND_PORT must be an integer between 1 and 65535.");
  return port;
}
export async function startServer(port = configuredPort()) {
  const server = createAppServer();
  await new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(port, HOST, resolve);
  });
  return server;
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const server = await startServer();
    const address = server.address();
    process.stdout.write(`CIN Local Backend listening at http://${HOST}:${address.port}\n`);
    process.on("SIGINT", () => server.close(() => process.exit(0)));
    process.on("SIGTERM", () => server.close(() => process.exit(0)));
  } catch (error) {
    process.stderr.write(`CIN Local Backend failed to start: ${error.message}\n`);
    process.exitCode = 1;
  }
}
