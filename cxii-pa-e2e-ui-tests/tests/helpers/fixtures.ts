import { test as base, chromium, type BrowserContext } from '@playwright/test';
import path from 'path';
import fs from 'fs';

const authFile = 'playwright/.auth/user.json'; // Path to saved authentication state
const userDataDir = './user-data'; // Persistent user storage directory

export const test = base.extend<{
  context: BrowserContext;
  extensionId: string;
}>({
  context: async ({ browser }, use) => {
    const extensionDir = path.join(__dirname, '../../tests/downloads/out');
    // ✅ Ensure the extension directory exists
    if (!fs.existsSync(extensionDir) || fs.readdirSync(extensionDir).length === 0) {
      throw new Error(`❌ Extension directory is empty or missing: ${extensionDir}`);
    }

    // ✅ Create a new browser context
    const context = await chromium.launchPersistentContext(userDataDir, {
      channel: 'chromium',
      ignoreHTTPSErrors: true,
      args: [
        `--disable-extensions-except=${extensionDir}`,
        `--load-extension=${extensionDir}`,
        '--ignore-certificate-errors',
        '--allow-running-insecure-content',
        '--enable-features=UseChromeOSDirectSockets',
        '--auto-select-certificate-for-urls="https://cxai.jaas-gcp.cloud.sap.corp"',
        '--disable-client-side-phishing-detection', // Prevents security warnings
        '--disable-features=CertificateTransparencyEnforcement', // Allows self-signed certs
        '--test-type', // Allows running with untrusted certificates
      ],
    });

    // ✅ Load authentication state if available
    if (fs.existsSync(authFile)) {
      try {
        const storageState = JSON.parse(fs.readFileSync(authFile, 'utf-8'));
        await context.addCookies(storageState.cookies);
      } catch (error) {
        console.error('❌ Error loading authentication state:', error);
      }
    } else {
      console.warn('⚠️ No saved session found! You might need to log in manually.');
    }

    await use(context);
    await context.close(); // ✅ Ensure cleanup after test
  },

  extensionId: async ({ context }, use) => {
    let background = context.serviceWorkers()[0];

    if (!background) {
      try {
        background = await context.waitForEvent('serviceworker', { timeout: 5000 });
      } catch (error) {
        throw new Error('❌ Service worker failed to start. Ensure the extension is loaded properly.');
      }
    }

    if (!background) {
      throw new Error('❌ Failed to retrieve service worker. Extension might not be loaded correctly.');
    }

    const extensionId = background.url().split('/')[2];
    await use(extensionId);
  },
});

export const expect = test.expect;
