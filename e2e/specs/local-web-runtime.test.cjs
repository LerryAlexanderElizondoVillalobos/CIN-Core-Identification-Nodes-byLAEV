const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const net = require('node:net');
const { spawn } = require('node:child_process');

const repoRoot = path.resolve(__dirname, '../..');
const binary = path.join(repoRoot, 'prototype/linux-runtime/target/release/cin-linux-prototype');

function reserve(port) {
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    server.once('error', reject);
    server.listen(port, '127.0.0.1', () => resolve(server));
  });
}
function close(server) {
  return new Promise(resolve => server.close(resolve));
}
function startRuntime(dataRoot) {
  const child = spawn(binary, [], {
    env: { ...process.env, CIN_DATA_ROOT: dataRoot, CIN_NO_BROWSER: '1' },
    stdio: ['ignore', 'pipe', 'pipe']
  });
  let output = '';
  child.stdout.on('data', chunk => { output += chunk.toString(); });
  child.stderr.on('data', chunk => { output += chunk.toString(); });
  const ready = new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(`Runtime startup timeout: ${output}`)), 10000);
    const check = () => {
      const match = output.match(/CIN_URL=(http:\/\/127\.0\.0\.1:\d+)/);
      if (match) { clearTimeout(timer); resolve(match[1]); }
    };
    child.stdout.on('data', check);
    child.once('exit', code => {
      clearTimeout(timer);
      reject(new Error(`Runtime exited (${code}): ${output}`));
    });
    check();
  });
  return { child, ready, getOutput: () => output };
}
async function stop(runtime) {
  if (runtime.child.exitCode !== null) return;
  runtime.child.kill('SIGTERM');
  await Promise.race([
    new Promise(resolve => runtime.child.once('exit', resolve)),
    new Promise(resolve => setTimeout(resolve, 3000))
  ]);
  if (runtime.child.exitCode === null) runtime.child.kill('SIGKILL');
}

test('serves the web UI and preserves data after restart and package relocation', async t => {
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'cin-web-e2e-'));
  const dataRoot = path.join(temp, 'user-data');
  const packageA = path.join(temp, 'portable-a');
  const packageB = path.join(temp, 'relocated', 'portable-b');
  fs.mkdirSync(packageA, { recursive: true });
  fs.copyFileSync(binary, path.join(packageA, 'cin'));
  t.after(() => fs.rmSync(temp, { recursive: true, force: true }));

  let runtime = startRuntime(dataRoot);
  const base = await runtime.ready;
  assert.match(base, /^http:\/\/127\.0\.0\.1:\d+$/);
  const page = await fetch(base);
  assert.equal(page.status, 200);
  const html = await page.text();
  assert.match(html, /CIN — Portable Linux Runtime/);
  assert.match(html, /fetch\(path/);

  const status = await fetch(`${base}/api/status`);
  assert.equal(status.status, 200);
  assert.match(await status.text(), /CIN local web runtime ready/);
  const write = await fetch(`${base}/api/probe/write`, { method: 'POST' });
  assert.equal(write.status, 200);
  assert.match(await write.text(), /Probe committed and read-back verified/);
  await stop(runtime);

  fs.mkdirSync(path.dirname(packageB), { recursive: true });
  fs.renameSync(packageA, packageB);
  runtime = startRuntime(dataRoot);
  const relocatedBase = await runtime.ready;
  const read = await fetch(`${relocatedBase}/api/probe/read`);
  assert.equal(read.status, 200);
  const record = await read.text();
  assert.match(record, /CIN_LOCAL_PERSISTENCE_PROBE_V1/);
  assert.match(record, /written_at_unix=/);
  assert.equal(fs.existsSync(path.join(dataRoot, 'runtime-probe.record')), true);
  assert.equal(fs.existsSync(path.join(packageB, 'runtime-probe.record')), false);
  await stop(runtime);
});

test('prefers 1221 when it is available', async t => {
  let blocker;
  try { blocker = await reserve(1221); }
  catch { t.skip('Port 1221 is already occupied by the test host'); return; }
  await close(blocker);
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'cin-port-primary-'));
  t.after(() => fs.rmSync(temp, { recursive: true, force: true }));
  const runtime = startRuntime(path.join(temp, 'data'));
  const base = await runtime.ready;
  assert.equal(new URL(base).port, '1221');
  await stop(runtime);
});

test('falls back to 2112 when 1221 is occupied', async t => {
  let blocker;
  try { blocker = await reserve(1221); }
  catch { t.skip('Port 1221 is already occupied by the test host'); return; }
  t.after(() => close(blocker));
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'cin-port-fallback-'));
  t.after(() => fs.rmSync(temp, { recursive: true, force: true }));
  const runtime = startRuntime(path.join(temp, 'data'));
  const base = await runtime.ready;
  assert.equal(new URL(base).port, '2112');
  await stop(runtime);
});

test('uses an ephemeral loopback port when 1221 and 2112 are occupied', async t => {
  let first, second;
  try { first = await reserve(1221); second = await reserve(2112); }
  catch {
    if (first) await close(first);
    t.skip('A preferred port is already occupied by the test host');
    return;
  }
  t.after(async () => { await close(first); await close(second); });
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'cin-port-dynamic-'));
  t.after(() => fs.rmSync(temp, { recursive: true, force: true }));
  const runtime = startRuntime(path.join(temp, 'data'));
  const base = await runtime.ready;
  assert.notEqual(new URL(base).port, '1221');
  assert.notEqual(new URL(base).port, '2112');
  await stop(runtime);
});
