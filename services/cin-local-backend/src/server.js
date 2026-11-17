import http from "node:http";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

export const HOST = "127.0.0.1";
export const DEFAULT_PORT = 2112;
export const ALTERNATIVE_PORT = 1221;

const managerPath = fileURLToPath(new URL("../manager/index.html", import.meta.url));

function sendJson(response, statusCode, payload) {
  response.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    "X-Content-Type-Options": "nosniff"
  });
  response.end(JSON.stringify(payload));
}

export function createAppServer() {
  return http.createServer(async (request, response) => {
    const url = new URL(request.url ?? "/", "http://127.0.0.1");

    if (request.method !== "GET") {
      response.setHeader("Allow", "GET");
      sendJson(response, 405, {
        ok: false,
        error: { code: "METHOD_NOT_ALLOWED", message: "This initial runtime exposes read-only diagnostic routes." }
      });
      return;
    }

    if (url.pathname === "/health") {
      sendJson(response, 200, {
        ok: true,
        service: "cin-local-backend",
        state: "running",
        bind_address: HOST,
        port: request.socket.localPort
      });
      return;
    }

    if (url.pathname === "/api/v1/status") {
      sendJson(response, 200, {
        ok: true,
        data: {
          service: "cin-local-backend",
          version: "0.1.0",
          runtime: "node",
          bind_address: HOST,
          port: request.socket.localPort,
          github: "not-connected",
          repository: "not-configured",
          pairing: "not-implemented"
        }
      });
      return;
    }

    if (url.pathname === "/manager" || url.pathname === "/manager/") {
      try {
        const html = await readFile(managerPath, "utf8");
        response.writeHead(200, {
          "Content-Type": "text/html; charset=utf-8",
          "Cache-Control": "no-store",
          "X-Content-Type-Options": "nosniff"
        });
        response.end(html);
      } catch {
        sendJson(response, 500, {
          ok: false,
          error: { code: "MANAGER_UNAVAILABLE", message: "The local Manager interface could not be loaded." }
        });
      }
      return;
    }

    sendJson(response, 404, {
      ok: false,
      error: { code: "NOT_FOUND", message: "Route not found." }
    });
  });
}

export function configuredPort(environment = process.env) {
  const raw = environment.CIN_LOCAL_BACKEND_PORT ?? String(DEFAULT_PORT);
  const port = Number(raw);
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error("CIN_LOCAL_BACKEND_PORT must be an integer between 1 and 65535.");
  }
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
