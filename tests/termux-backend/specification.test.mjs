import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const base = new URL("../../docs/termux-local-backend/", import.meta.url);
const read = async (name) => readFile(new URL(name, base), "utf8");

test("specification fixes repository and branch baseline", async () => {
  const spec = JSON.parse(await read("SPECIFICATION.json"));
  assert.equal(spec.repository.owner, "LerryAlexanderElizondoVillalobos");
  assert.equal(spec.repository.name, "CIN-Core-Identification-Nodes-byLAEV");
  assert.equal(spec.repository.id, 1458540194);
  assert.equal(spec.branch, "feat/termux-local-backend");
});

test("backend network defaults are loopback-only and use approved ports", async () => {
  const spec = JSON.parse(await read("SPECIFICATION.json"));
  assert.equal(spec.backend.bindAddress, "127.0.0.1");
  assert.equal(spec.backend.defaultPort, 2112);
  assert.equal(spec.backend.alternativePort, 1221);
});

test("GitHub tokens stay on Termux and Device Flow is the selected method", async () => {
  const spec = JSON.parse(await read("SPECIFICATION.json"));
  assert.equal(spec.authentication.method, "GitHub App Device Authorization Flow");
  assert.equal(spec.authentication.tokenLocation, "Termux private storage");
  assert.equal(spec.authentication.browserReceivesGitHubToken, false);
});

test("backend excludes Actions, Workflows and Cloudflare Worker", async () => {
  const spec = JSON.parse(await read("SPECIFICATION.json"));
  assert.equal(spec.githubPermissions.actions, "none");
  assert.equal(spec.githubPermissions.workflows, "none");
  assert.equal(spec.cloudflareWorker, "excluded-from-target-architecture");
});

test("CIN node root and Pages publication root are explicitly distinguished", async () => {
  const spec = JSON.parse(await read("SPECIFICATION.json"));
  assert.equal(spec.existingNodeRoot, "Core Identification Node Github/CIN 001/");
  assert.equal(spec.pagesPublicationRoot, "Core Identification Node Github/");
});

test("all required specification documents exist", async () => {
  const names = [
    "README.md", "ARCHITECTURE.md", "API-SPECIFICATION.md",
    "AUTHENTICATION.md", "PERMISSIONS-AND-STORAGE.md",
    "TERMUX-INSTALLATION.md", "TEST-PLAN.md",
    "GITHUB-ACTIONS.md", "IMPLEMENTATION-ROADMAP.md"
  ];
  for (const name of names) {
    const content = await read(name);
    assert.ok(content.trim().length > 100, `${name} must contain substantive content`);
  }
});

test("specification records current implementation maturity honestly", async () => {
  const spec = JSON.parse(await read("SPECIFICATION.json"));
  assert.equal(spec.maturity.specification, true);
  assert.equal(spec.maturity.runtimeFoundation, true);
  assert.equal(spec.maturity.managerPrototype, true);
  assert.equal(spec.maturity.runtimeImplemented, false);
  assert.equal(spec.maturity.androidBrowserCompatibilityVerified, false);
});
