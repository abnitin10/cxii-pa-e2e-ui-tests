import { Page } from '@playwright/test';
import { E2E_BASE_URL, E2E_PASSWORD, E2E_USER_NAME } from '@env';

export class LoginPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goto(url: string) {
    await this.page.goto(url);
    // await this.page.waitForLoadState('networkidle');
  }

  async enterUserName(userName: string) {
    const textbox = this.page.getByRole('textbox');
    await textbox.click();
    await textbox.fill(userName);
  }

  async enterPassword(password: string) {
    const textbox = this.page.getByRole('textbox');
    await textbox.click();
    await textbox.fill(password);
  }

  /**
   * Logs in to the application.
   * @param waitForNetworkIdle Whether to wait for the network to be idle after login. Only required if the follow up tests wants to work with that page. Default is true.
   * @returns Promise<void>
   */
  async login({ waitForNetworkIdle = true }) {
    await this.goto(`${E2E_BASE_URL}/login`);
    await this.enterUserName(E2E_USER_NAME);
    await this.page.getByRole('button', { name: 'Sign In' }).click();
    await this.page.getByRole('button', { name: 'Continue' }).click();
    await this.enterPassword(E2E_PASSWORD);
    await this.page.getByRole('button', { name: 'Sign in' }).click();
    await this.page.getByRole('button', { name: 'Yes' }).click();

    if (waitForNetworkIdle) {
      await this.page.waitForLoadState('networkidle');
    }
    await this.page.waitForURL(`${E2E_BASE_URL}/apps/home`);
    console.log('Logged in successfully');
  }
}
