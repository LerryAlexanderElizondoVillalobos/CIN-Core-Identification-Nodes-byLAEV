import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { createLocalWorkspace } from "../src/workspace/local-directory.js";

test("workspace creates directories and nested UTF-8 files", async () => {
  const root = await mkdtemp(join(tmpdir(), "cin-workspace-"));
  try {
    const workspace = createLocalWorkspace(root);
    await workspace.createDirectory("CIN 001/state");
    const saved = await workspace.write("CIN 001/state/test.txt", "CIN — local");
    assert.equal(saved.saved, true);
    assert.equal((await workspace.read("CIN 001/state/test.txt")).content, "CIN — local");
    assert.equal((await workspace.list("CIN 001/state")).length, 1);
  } finally { await rm(root, { recursive: true, force: true }); }
});

test("workspace preserves arbitrary binary bytes through base64", async () => {
  const root = await mkdtemp(join(tmpdir(), "cin-binary-"));
  try {
    const workspace = createLocalWorkspace(root);
    const original = Buffer.from([0, 255, 1, 2, 128, 13, 10, 42]);
    await workspace.write("uploads/sample.bin", original.toString("base64"), "base64");
    const result = await workspace.read("uploads/sample.bin", "base64");
    assert.deepEqual(Buffer.from(result.content_base64, "base64"), original);
    assert.deepEqual(await readFile(join(root, "uploads/sample.bin")), original);
  } finally { await rm(root, { recursive: true, force: true }); }
});

test("workspace rejects paths outside its root", async () => {
  const root = await mkdtemp(join(tmpdir(), "cin-path-"));
  try {
    const workspace = createLocalWorkspace(root);
    await assert.rejects(() => workspace.write("../outside.txt", "no"), /workspace_path_outside_root/);
  } finally { await rm(root, { recursive: true, force: true }); }
});
