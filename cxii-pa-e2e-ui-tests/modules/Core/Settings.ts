import { Page } from '@playwright/test';

export class Settings {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // 🔹 Utility: wait until viewport is set
  private async ensureViewport(width = 1024, height = 768) {
    await this.page.setViewportSize({ width, height });
    for (let i = 0; i < 5; i++) {
      const size = this.page.viewportSize();
      if (size?.width === width && size?.height === height) {
        console.log(`Viewport size matched: ${size.width}x${size.height}`);
        return;
      }
      await this.page.waitForTimeout(1000);
    }
    throw new Error(`Viewport size did not match expected ${width}x${height}`);
  }

  // 🔹 Utility: click a tab by name
  private async clickTab(name: string) {
    console.log(`Clicking on tab '${name}'...`);
    const tab = this.page.getByRole('tab', { name }).locator('div');
    await tab.waitFor({ state: 'visible', timeout: 5000 });
    await tab.click();
  }

  // 🔹 Utility: process items from a popover
  private async processPopoverItems(tabName: string) {
    const listItems = this.page.locator('ui5-responsive-popover[open] ui5-li-custom');
    const count = await listItems.count();
    console.log(`Popover item count in '${tabName}' tab: ${count}`);

    for (let i = 0; i < count; i++) {
      const element = await listItems.nth(i).textContent();
      console.log(`Clicking item: ${element}`);
      await listItems.nth(i).click();
      await this.page.waitForTimeout(500);

      if (i < count - 1) {
        await this.clickTab(tabName);
      }
    }
  }

  // 🔹 Step 1: Open Settings menu
  private async openSettingsMenu() {
    console.log("Opening User Menu...");
    await this.page.getByTitle('User Menu').locator('div').click({ timeout: 5000 });
    await this.page.getByText('Settings', { exact: true }).click({ timeout: 5000 });
    await this.page.locator('div').filter({ hasText: /^Settings$/ }).nth(1).click({ timeout: 5000 });
  }

  // 🔹 Public method: orchestrates everything
  async openSettings() {
    try {
      await this.ensureViewport();
      await this.openSettingsMenu();

      await this.clickTab('Organization');
      await this.page.waitForTimeout(500);

      await this.clickTab('Integrations');
      await this.processPopoverItems('Integrations');

      await this.clickTab('Data Sources');
      await this.page.waitForTimeout(500);

      await this.clickTab('Users');
      await this.page.waitForTimeout(500);

      await this.clickTab('Commerce');
      await this.processPopoverItems('Commerce');

      await this.page.locator('div').filter({ hasText: /^Settings$/ }).nth(1).click({ timeout: 5000 });

      console.log("✅ Finished navigating Settings tabs.");
    } catch (error) {
      console.error("❌ Error in openSettings():", error);
      throw error;
    }
  }
}
