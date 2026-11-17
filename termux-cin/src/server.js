import http from "node:http";
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { createOAuthService } from "./github/oauth.js";
import { createGitHubConnector } from "./github/connector.js";
import { createPermissionEngine } from "./authorization/permission-engine.js";
import { createLocalWorkspace } from "./workspace/local-directory.js";

const here = dirname(fileURLToPath(import.meta.url));
const envPath = resolve(here, "../.env");
if (existsSync(envPath)) {
  for (const line of readFileSync(envPath, "utf8").split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
    if (match && !process.env[match[1]]) process.env[match[1]] = match[2].replace(/^(['"])(.*)\1$/, "$2");
  }
}
const config = {
  clientId: process.env.CIN_GITHUB_APP_CLIENT_ID || "",
  clientSecret: process.env.CIN_GITHUB_APP_CLIENT_SECRET || "",
  redirectUri: process.env.CIN_GITHUB_REDIRECT_URI || "",
  owner: process.env.CIN_GITHUB_OWNER || "LerryAlexanderElizondoVillalobos",
  repository: process.env.CIN_GITHUB_REPOSITORY || "CIN-Core-Identification-Nodes-byLAEV",
  repositoryId: process.env.CIN_GITHUB_REPOSITORY_ID || "1458540194",
  allowedOrigin: process.env.CIN_ALLOWED_ORIGIN || "https://lerryalexanderelizondovillalobos.github.io"
};
const host = process.env.CIN_BIND_HOST || "127.0.0.1";
const port = Number(process.env.CIN_PORT || 8787);
let token = null;
let tokenExpiresAt = 0;
const session = {
  set(value, seconds) { token = value; tokenExpiresAt = Date.now() + Number(seconds) * 1000; },
  get() { if (tokenExpiresAt && Date.now() >= tokenExpiresAt) { token = null; tokenExpiresAt = 0; } return token; },
  clear() { token = null; tokenExpiresAt = 0; }
};
const oauth = createOAuthService(config, session);
const github = createGitHubConnector(config, session);
const permissions = createPermissionEngine();
const workspace = createLocalWorkspace(process.env.CIN_LOCAL_WORKSPACE_ROOT || resolve(here, "../../Core Identification Node Github"));

function send(res, status, value, origin) {
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    "Access-Control-Allow-Origin": origin || config.allowedOrigin,
    "Access-Control-Allow-Methods": "GET, POST, PUT, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Private-Network": "true",
    "Vary": "Origin"
  });
  res.end(JSON.stringify(value));
}
async function readJson(req) {
  let raw = "";
  for await (const chunk of req) {
    raw += chunk;
    if (raw.length > 3_000_000) { const error = new Error("request_body_too_large"); error.status = 413; throw error; }
  }
  try { return raw ? JSON.parse(raw) : {}; }
  catch { const error = new Error("invalid_json"); error.status = 400; throw error; }
}
function githubPath(pathname) {
  const prefix = "/v1/github";
  if (!pathname.startsWith(prefix + "/")) return null;
  return decodeURIComponent(pathname.slice(prefix.length));
}
const server = http.createServer(async (req, res) => {
  const origin = req.headers.origin || "";
  if (origin && origin !== config.allowedOrigin) return send(res, 403, { error: "origin_not_allowed" }, config.allowedOrigin);
  if (!origin && req.method !== "GET") return send(res, 403, { error: "browser_origin_required" }, config.allowedOrigin);
  if (req.method === "OPTIONS") {
    res.writeHead(204, {
      "Access-Control-Allow-Origin": config.allowedOrigin,
      "Access-Control-Allow-Methods": "GET, POST, PUT, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Private-Network": "true",
      "Access-Control-Max-Age": "600",
      "Vary": "Origin"
    });
    return res.end();
  }
  const url = new URL(req.url, "http://127.0.0.1");
  try {
    if (req.method === "GET" && url.pathname === "/health") {
      return send(res, 200, { service: "cin-termux-local-backend", status: "ready", runtime: process.version }, origin);
    }
    if (req.method === "GET" && url.pathname === "/v1/status") {
      return send(res, 200, { service: "cin-termux-local-backend", github_connected: !!session.get(), repository: config.owner + "/" + config.repository, repository_id: config.repositoryId }, origin);
    }
    if (req.method === "POST" && url.pathname === "/v1/session/disconnect") {
      session.clear();
      return send(res, 200, { disconnected: true }, origin);
    }
    if (req.method === "POST" && url.pathname === "/oauth/exchange") {
      if (!config.clientId || !config.clientSecret || !config.redirectUri) return send(res, 503, { error: "github_app_not_configured_in_termux_env" }, origin);
      const result = await oauth.exchange(await readJson(req));
      return send(res, 200, result, origin);
    }
    if (req.method === "GET" && url.pathname === "/v1/local/tree") {
      const entries = await workspace.list(url.searchParams.get("path") || "");
      return send(res, 200, { root: "Core Identification Node Github", entries }, origin);
    }
    if (req.method === "GET" && url.pathname === "/v1/local/file") {
      const file = await workspace.read(url.searchParams.get("path") || "");
      return send(res, 200, file, origin);
    }
    if (req.method === "PUT" && url.pathname === "/v1/local/file") {
      const input = await readJson(req);
      const saved = await workspace.write(input.path, input.content);
      return send(res, 200, saved, origin);
    }
    if (req.method === "POST" && url.pathname === "/v1/permissions/requests") {
      const item = permissions.request(await readJson(req));
      return send(res, 201, item, origin);
    }
    if (req.method === "POST" && url.pathname.startsWith("/v1/permissions/")) {
      const id = url.pathname.split("/").pop();
      const input = await readJson(req);
      return send(res, 200, permissions.decide(id, input.decision, input.actor), origin);
    }
    const path = githubPath(url.pathname);
    if (path && ["GET", "PUT"].includes(req.method)) {
      const data = await github.request(path + url.search, req.method, req.method === "PUT" ? await readJson(req) : undefined);
      return send(res, 200, data, origin);
    }
    return send(res, 404, { error: "not_found" }, origin);
  } catch (error) {
    return send(res, error.status || 500, { error: error.message || "internal_error" }, origin);
  }
});
server.listen(port, host, () => {
  process.stdout.write("CIN Termux backend listening at http://" + host + ":" + port + "\n");
});
