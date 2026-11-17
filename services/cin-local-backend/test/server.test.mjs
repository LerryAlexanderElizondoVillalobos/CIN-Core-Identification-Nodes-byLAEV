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
    assert.match(html, /GitHub Device Flow/);
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
