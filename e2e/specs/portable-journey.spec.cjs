const assert = require('node:assert/strict');

const phase = process.env.CIN_E2E_PHASE;
if (!['write', 'read'].includes(phase)) {
  throw new Error('CIN_E2E_PHASE must be either "write" or "read"');
}

describe('CIN portable desktop user journey', function () {
  it(`launches the extracted package and completes the ${phase} phase`, async function () {
    const heading = await $('h1');
    await heading.waitForDisplayed({ timeout: 30000 });
    assert.equal(await heading.getText(), 'CIN — Portable Linux Runtime');

    const status = await $('#status');
    await status.waitForDisplayed({ timeout: 30000 });
    await browser.waitUntil(
      async () => (await status.getText()).includes('Linux prototype runtime ready'),
      { timeout: 30000, timeoutMsg: 'The local runtime status did not become ready' }
    );

    const output = await $('#output');
    if (phase === 'write') {
      await $('#write').click();
      await browser.waitUntil(
        async () => (await output.getText()).includes('Probe committed and read-back verified at'),
        { timeout: 15000, timeoutMsg: 'The GUI did not confirm the persistence probe write' }
      );
      assert.match(await output.getText(), /runtime-probe\.record$/);
    } else {
      await $('#read').click();
      await browser.waitUntil(
        async () => (await output.getText()).includes('CIN_LOCAL_PERSISTENCE_PROBE_V1'),
        { timeout: 15000, timeoutMsg: 'The GUI could not read the persisted probe after relaunch' }
      );
      assert.match(await output.getText(), /written_at_unix=/);
    }
  });
});
