import { test as setup, expect } from '@playwright/test';
import { LoginPage } from '@core/login.e2e';

const authFile = 'playwright/.auth/user.json';

// Authenticate before running tests. See https://playwright.dev/docs/auth
setup('authenticate', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.login({ 
    waitForNetworkIdle: false // we don't need to wait for network idle, as we just want the cookies -> Speeds up the test
  });

  await page.context().storageState({ path: authFile });
});