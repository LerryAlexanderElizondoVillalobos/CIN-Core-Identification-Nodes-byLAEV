import test from "node:test";
import assert from "node:assert/strict";
import { createAppServer, HOST, DEFAULT_PORT, ALTERNATIVE_PORT, configuredPort } from "../src/server.js";

async function withServer(run) {
  const server = createAppServer();
  await new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, HOST, resolve);
  });
  try {
    await run(server.address().port);
  } finally {
    await new Promise((resolve, reject) => server.close(error => error ? reject(error) : resolve()));
  }
}

test("runtime defaults to loopback and documented ports", () => {
  assert.equal(HOST, "127.0.0.1");
  assert.equal(DEFAULT_PORT, 2112);
  assert.equal(ALTERNATIVE_PORT, 1221);
  assert.equal(configuredPort({}), 2112);
  assert.equal(configuredPort({ CIN_LOCAL_BACKEND_PORT: "1221" }), 1221);
  assert.throws(() => configuredPort({ CIN_LOCAL_BACKEND_PORT: "0" }));
});

test("health endpoint returns safe runtime status", async () => {
  await withServer(async port => {
    const response = await fetch(`http://127.0.0.1:${port}/health`);
    const body = await response.json();
    assert.equal(response.status, 200);
    assert.equal(body.ok, true);
    assert.equal(body.bind_address, "127.0.0.1");
    assert.equal(body.port, port);
    assert.equal("token" in body, false);
  });
});

test("status endpoint exposes maturity without credential material", async () => {
  await withServer(async port => {
    const response = await fetch(`http://127.0.0.1:${port}/api/v1/status`);
    const body = await response.json();
    assert.equal(response.status, 200);
    assert.equal(body.data.github, "not-connected");
    assert.equal(body.data.repository, "not-configured");
    assert.equal(JSON.stringify(body).includes("access_token"), false);
  });
});

test("Manager is served from the local backend", async () => {
  await withServer(async port => {
    const response = await fetch(`http://127.0.0.1:${port}/manager`);
    const html = await response.text();
    assert.equal(response.status, 200);
    assert.match(html, /CIN Backend Manager/);
    assert.match(html, /Pairing requests/);\n    assert.match(html, /Active sessions/);
  });
});

test("unsupported methods are rejected on the initial read-only API", async () => {
  await withServer(async port => {
    const response = await fetch(`http://127.0.0.1:${port}/api/v1/status`, { method: "POST" });
    const body = await response.json();
    assert.equal(response.status, 405);
    assert.equal(body.error.code, "METHOD_NOT_ALLOWED");
  });
});

test("pairing request requires operator approval and creates revocable session", async () => {
  await withServer(async port => {
    const base = `http://127.0.0.1:${port}`;
    const created = await fetch(base + "/api/v1/pairing/request", {
      method: "POST", headers: { "Content-Type": "application/json", Origin: "https://lerryalexanderelizondo.github.io" },
      body: JSON.stringify({ label: "Test Lobby" })
    });
    assert.equal(created.status, 201);
    const request = (await created.json()).data;
    assert.equal(request.state, "PENDING");

    const pending = await fetch(base + "/api/v1/pairing/status");
    assert.equal((await pending.json()).data.requests[0].state, "PENDING");

    const approved = await fetch(base + "/api/v1/pairing/approve", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ request_id: request.request_id })
    });
    assert.equal(approved.status, 200);

    const polled = await fetch(base + "/api/v1/pairing/status?request_id=" +
      encodeURIComponent(request.request_id) + "&poll_secret=" + encodeURIComponent(request.poll_secret));
    const session = (await polled.json()).data;
    assert.equal(session.state, "ACTIVE");
    assert.ok(session.session_token);

    const revoked = await fetch(base + "/api/v1/pairing/revoke", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ session_id: session.session_id })
    });
    assert.equal(revoked.status, 200);
    const after = await fetch(base + "/api/v1/pairing/status");
    assert.equal((await after.json()).data.sessions.length, 0);
  });
});

test("pairing rejects unapproved browser origins", async () => {
  await withServer(async port => {
    const response = await fetch(`http://127.0.0.1:${port}/api/v1/pairing/request`, {
      method: "POST", headers: { "Content-Type": "application/json", Origin: "https://example.com" },
      body: JSON.stringify({})
    });
    assert.equal(response.status, 403);
  });
});
