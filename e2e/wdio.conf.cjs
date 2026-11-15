const path = require('node:path');

const appBinaryPath = process.env.CIN_APP_BINARY;
if (!appBinaryPath) {
  throw new Error('CIN_APP_BINARY must point to the extracted package launcher');
}

const absoluteAppPath = path.resolve(appBinaryPath);

exports.config = {
  runner: 'local',
  specs: ['./e2e/specs/**/*.spec.cjs'],
  maxInstances: 1,
  capabilities: [
    {
      browserName: 'tauri',
      'tauri:options': {
        application: absoluteAppPath
      }
    }
  ],
  services: [
    [
      '@wdio/tauri-service',
      {
        appBinaryPath: absoluteAppPath,
        driverProvider: 'official',
        autoInstallTauriDriver: true,
        startTimeout: 60000,
        commandTimeout: 30000,
        captureFrontendLogs: true
      }
    ]
  ],
  framework: 'mocha',
  reporters: ['spec'],
  logLevel: 'info',
  waitforTimeout: 20000,
  connectionRetryTimeout: 90000,
  connectionRetryCount: 2,
  mochaOpts: {
    ui: 'bdd',
    timeout: 90000
  },
  afterTest: async function (_test, _context, { passed }) {
    if (!passed && global.browser) {
      try {
        const screenshotPath = path.join(
          process.env.RUNNER_TEMP || process.cwd(),
          'cin-desktop-e2e-failure.png'
        );
        await browser.saveScreenshot(screenshotPath);
        console.log(`Failure screenshot: ${screenshotPath}`);
      } catch (error) {
        console.warn(`Could not save failure screenshot: ${error}`);
      }
    }
  }
};
