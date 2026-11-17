import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { createAppServer, HOST, DEFAULT_PORT, ALTERNATIVE_PORT, configuredPort } from "../src/server.js";
import { createLocalStateManager } from "../src/local-state-manager.js";

async function withServer(run, dataDir) {
  const server = createAppServer({ dataDir });
  await new Promise((resolve, reject) => { server.once("error", reject); server.listen(0, HOST, resolve); });
  try { await run(server.address().port); }
  finally { await new Promise((resolve, reject) => server.close(error => error ? reject(error) : resolve())); }
}
async function temporaryDirectory() { return mkdtemp(join(tmpdir(), "cin-runtime-test-")); }

test("runtime defaults to loopback and documented ports", () => {
  assert.equal(HOST, "127.0.0.1");
  assert.equal(DEFAULT_PORT, 2112);
  assert.equal(ALTERNATIVE_PORT, 1221);
  assert.equal(configuredPort({}), 2112);
  assert.equal(configuredPort({ CIN_LOCAL_BACKEND_PORT: "1221" }), 1221);
  assert.throws(() => configuredPort({ CIN_LOCAL_BACKEND_PORT: "0" }));
});

test("health endpoint returns safe runtime status", async () => {
  const dir = await temporaryDirectory();
  try { await withServer(async port => {
    const response = await fetch(`http://127.0.0.1:${port}/health`), body = await response.json();
    assert.equal(response.status, 200); assert.equal(body.ok, true);
    assert.equal(body.bind_address, "127.0.0.1"); assert.equal(body.port, port);
    assert.equal("token" in body, false);
  }, dir); } finally { await rm(dir, { recursive: true, force: true }); }
});

test("status endpoint reports persistence without credential material", async () => {
  const dir = await temporaryDirectory();
  try { await withServer(async port => {
    const response = await fetch(`http://127.0.0.1:${port}/api/v1/status`), body = await response.json();
    assert.equal(response.status, 200); assert.equal(body.data.github, "not-connected");
    assert.equal(body.data.repository, "not-configured"); assert.equal(body.data.persistence.enabled, true);
    assert.ok(body.data.persistence.domains.includes("configuration"));
    assert.equal(JSON.stringify(body).includes("access_token"), false);
  }, dir); } finally { await rm(dir, { recursive: true, force: true }); }
});

test("Manager is served from the local backend", async () => {
  const dir = await temporaryDirectory();
  try { await withServer(async port => {
    const response = await fetch(`http://127.0.0.1:${port}/manager`), html = await response.text();
    assert.equal(response.status, 200); assert.match(html, /CIN Backend Manager/);
    assert.match(html, /Pairing requests/); assert.match(html, /Active sessions/);
  }, dir); } finally { await rm(dir, { recursive: true, force: true }); }
});

test("unsupported methods return 405", async () => {
  const dir = await temporaryDirectory();
  try { await withServer(async port => {
    const response = await fetch(`http://127.0.0.1:${port}/api/v1/status`, { method: "POST" }), body = await response.json();
    assert.equal(response.status, 405); assert.equal(body.error.code, "METHOD_NOT_ALLOWED");
  }, dir); } finally { await rm(dir, { recursive: true, force: true }); }
});

test("pairing requests, sessions and revocation survive backend restart", async () => {
  const dir = await temporaryDirectory();
  try {
    let request;
    await withServer(async port => {
      const created = await fetch(`http://127.0.0.1:${port}/api/v1/pairing/request`, {
        method: "POST", headers: { "Content-Type": "application/json", Origin: "https://lerryalexanderelizondo.github.io" },
        body: JSON.stringify({ label: "Persistent Lobby" })
      });
      assert.equal(created.status, 201); request = (await created.json()).data;
      const approved = await fetch(`http://127.0.0.1:${port}/api/v1/pairing/approve`, {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ request_id: request.request_id })
      });
      assert.equal(approved.status, 200);
    }, dir);

    let session;
    await withServer(async port => {
      const polled = await fetch(`http://127.0.0.1:${port}/api/v1/pairing/status?request_id=${encodeURIComponent(request.request_id)}&poll_secret=${encodeURIComponent(request.poll_secret)}`);
      session = (await polled.json()).data;
      assert.equal(session.state, "ACTIVE"); assert.ok(session.session_token);
      const listing = await (await fetch(`http://127.0.0.1:${port}/api/v1/pairing/status`)).json();
      assert.equal(listing.data.sessions.length, 1);
      assert.equal(listing.data.requests[0].state, "APPROVED");
      const revoked = await fetch(`http://127.0.0.1:${port}/api/v1/pairing/revoke`, {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ session_id: session.session_id })
      });
      assert.equal(revoked.status, 200);
    }, dir);

    await withServer(async port => {
      const listing = await (await fetch(`http://127.0.0.1:${port}/api/v1/pairing/status`)).json();
      assert.equal(listing.data.sessions[0].state, "REVOKED");
      assert.ok(listing.data.events.some(event => event.type === "SESSION_REVOKED"));
    }, dir);
  } finally { await rm(dir, { recursive: true, force: true }); }
});

test("unapproved browser origins are rejected", async () => {
  const dir = await temporaryDirectory();
  try { await withServer(async port => {
    const response = await fetch(`http://127.0.0.1:${port}/api/v1/pairing/request`, {
      method: "POST", headers: { "Content-Type": "application/json", Origin: "https://example.com" }, body: JSON.stringify({})
    });
    assert.equal(response.status, 403);
  }, dir); } finally { await rm(dir, { recursive: true, force: true }); }
});

test("Local State Manager persists independent domains and validated configuration", async () => {
  const dir = await temporaryDirectory();
  try {
    const state = createLocalStateManager({ directory: dir });
    state.setDomain("installed_engines", { pairing: { version: "1.0.0", enabled: true } });
    state.updateDomain("installed_engines", current => ({
      ...current, merkle: { version: "0.1.0", enabled: false }
    }));
    state.updateConfiguration({ lobby_origin: "https://example.org" });

    const restored = createLocalStateManager({ directory: dir });
    assert.deepEqual(restored.getDomain("installed_engines"), {
      pairing: { version: "1.0.0", enabled: true },
      merkle: { version: "0.1.0", enabled: false }
    });
    assert.equal(restored.getDomain("configuration").lobby_origin, "https://example.org");
    assert.equal(restored.status().schema_version, 2);
    assert.throws(() => restored.updateConfiguration({ unknown_setting: true }));
    assert.throws(() => restored.updateConfiguration({ lobby_origin: "file:///tmp/state" }));
  } finally { await rm(dir, { recursive: true, force: true }); }
});
