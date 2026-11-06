import { Locator, Page, expect } from '@playwright/test';

export class IntegrationSettingsPage {
  constructor(private page: Page) { }
  private row: Locator;

  async openIntegrationsTab() {
    await this.page.getByTitle('User Menu').click();
    await this.page.getByText('Settings', { exact: true }).click();
    await this.page.getByRole('tab', { name: 'Integrations' }).locator('div').click();
  }

  async editIntegration() {
    await this.openIntegrationsTab();
    await this.clickEditButtonForRow('Maximus Commerce');
    const form = this.page.locator('form').filter({ hasText: 'NameNameType(Not Selected)SAP' });
    await form.locator('input[type="password"]').fill('admin');

    await this.page.getByRole('button', { name: 'Check Connection' }).click();
    await expect(this.page.locator('body')).toContainText('Connection Successful');

    await this.selectAllCheckboxes();
  }

  async clickEditButtonForRow(name: string) {
    await this.page.waitForLoadState('networkidle');
    await this.page.locator('[role="row"]');
    const rows = this.page.locator('[role="row"]');
    const rowCount = await rows.count();

    for (let i = 0; i < rowCount; i++) {
      const row = rows.nth(i);

      // Wait for the first cell to be visible before reading its content
      const nameCell = row.locator('[role="gridcell"]').first();
      try {
        await nameCell.waitFor({ state: 'visible', timeout: 5000 });
      } catch {
        continue;
      }

      const cellText = (await nameCell.innerText()).trim();

      if (cellText === name) {
        const editButton = row.locator('ui5-button[icon="edit"]').first();

        // Make sure the edit button is visible before clicking
        try {
          await editButton.waitFor({ state: 'visible', timeout: 5000 });
          await editButton.click();
          console.log(`✅ Clicked Edit for row: "${name}"`);
          return;
        } catch (err) {
          throw new Error(`Edit button found but not clickable for row: "${name}"`);
        }
      }
    }

    throw new Error(`❌ Row with name "${name}" not found after checking ${rowCount} rows.`);
  }

  async clickDeleteButtonForRow(name: string) {
    // Wait for network to be idle and rows to be ready
    await this.page.waitForLoadState('networkidle');
    const rows = this.page.locator('[role="row"]');
    const rowCount = await rows.count();

    for (let i = 0; i < rowCount; i++) {
      const row = rows.nth(i);
      const nameCell = row.locator('[role="gridcell"]').first();

      try {
        await nameCell.waitFor({ state: 'visible', timeout: 5000 });
        const cellText = (await nameCell.innerText()).trim();

        if (cellText === name) {
          const deleteButton = row.locator('ui5-button[icon="delete"]').first();

          await deleteButton.waitFor({ state: 'visible', timeout: 5000 });
          await deleteButton.click();
          console.log(`🗑️ Clicked Delete for row: "${name}"`);

          // ✅ Exit the loop and method
          return;
        }
      } catch (err) {
        console.warn(`⚠️ Error on row ${i + 1}: ${err}`);
      }
    }

    throw new Error(`❌ Row with name "${name}" not found after checking ${rowCount} rows.`);
  }

  async selectAllCheckboxes() {
    const combo = this.page.locator('ui5-multi-combobox').filter({ hasText: 'Enter existing product' });
    await combo.getByLabel('Select Options').click();

    // Wait for the popover to be visible
    await this.page.waitForSelector('ui5-responsive-popover[open]');

    // Get all list items
    const listItems = this.page.locator('ui5-responsive-popover[open] ui5-li');
    const itemCount = await listItems.count();

    for (let i = 0; i < itemCount; i++) {
      const item = listItems.nth(i);

      const isSelected = await item.getAttribute('selected');

      if (!isSelected) {
        // Use evaluate to select without closing the popover
        await item.evaluate((el: any) => el.setAttribute('selected', ''));
      }
    }
  }

  async assertRowStatus(name: string, expectedStatus: string) {
    const rows = this.page.locator('[role="row"]');
    const rowCount = await rows.count();

    for (let i = 0; i < rowCount; i++) {
      const row = rows.nth(i);
      const nameCell = row.locator('[role="gridcell"]').first();

      try {
        await nameCell.waitFor({ state: 'visible', timeout: 5000 });
        const cellText = (await nameCell.innerText()).trim();

        if (cellText === name) {
          const statusCell = row.locator('[role="gridcell"]').nth(5); // 6th column is "Status"

          // ✅ Assert that it contains the expected status like "Deleting"
          await expect(statusCell).toContainText(expectedStatus);
          console.log(`✅ Row "${name}" has status: "${expectedStatus}"`);
          return;
        }
      } catch (err) {
        console.warn(`⚠️ Skipping row ${i + 1}: ${err}`);
      }
    }
    throw new Error(`❌ Row with name "${name}" not found.`);
  }


  async deleteIntegration() {
    await this.openIntegrationsTab();
    await this.clickDeleteButtonForRow('Maximus Commerce');
    // await this.page.getByRole('button', { name: 'Delete' }).nth(3).click();

    const deleteConfirmBtn = this.page.locator('ui5-dialog[open] ui5-button[design="Emphasized"]', { hasText: 'Delete' });

    await deleteConfirmBtn.waitFor({ state: 'visible', timeout: 5000 });
    await deleteConfirmBtn.click();
    console.log('✅ Confirmed deletion for Maximus Commerce');

    await this.assertRowStatus('Maximus Commerce', 'Deleting');
  }

  async addIntegration() {
    await expect(this.page.locator('ui5-message-strip')).toContainText('Activate your data sources to use all AI Tools.');

    await this.openIntegrationsTab();
    await this.page.getByRole('button', { name: 'Add Integration' }).click();

    const form = this.page.locator('form').filter({ hasText: 'NameNameType(Not Selected)SAP' });
    await form.getByRole('textbox').click();
    await form.getByRole('textbox').fill('Maximus Commerce');

    // Open the dropdown
    await this.page.locator('ui5-select[value-state="None"]').filter({ hasText: '(Not Selected)SAP Commerce' }).click();


    // Select the desired option
    await this.page
      .locator('ui5-responsive-popover[open] ui5-li')
      .filter({ hasText: 'SAP Commerce Cloud' })
      .click();


    const hostUrl = this.page.locator('div').filter({ hasText: /^Host URL$/ }).getByRole('textbox');
    await hostUrl.click();
    await hostUrl.fill('https://cxii-maximus.usdemo.hybris.com');
    await hostUrl.press('Tab');

    const clientId = this.page.getByRole('textbox').nth(3);
    await clientId.click();
    await clientId.fill('AI_CLIENT2');
    await clientId.press('Tab');

    await form.locator('input[type="password"]').click();
    await form.locator('input[type="password"]').fill('admin');

    await this.page.getByRole('button', { name: 'Check Connection' }).click();
    // await expect(this.page.locator('span')).toContainText('Connection Successful');

    // Open and select multiple identifier checkboxes
    const combo = this.page.locator('ui5-multi-combobox').filter({ hasText: 'Enter existing product' });
    await combo.locator('ui5-icon').click();

    // Wait for the popover to be visible
    await this.page.waitForSelector('ui5-responsive-popover[open]');

    // Select all selectable list items inside the open popover
    const listItems = this.page.locator('ui5-responsive-popover[open] li[role="option"]');
    const itemCount = await listItems.count();

    for (let i = 0; i < itemCount; i++) {
      const item = listItems.nth(i);
      const checkbox = item.locator('ui5-checkbox');

      const isChecked = await checkbox.getAttribute('checked');

      if (!isChecked) {
        await checkbox.click(); // Click the checkbox directly
        this.page.waitForTimeout(100);
      }
    }
    await this.page.keyboard.press('Escape');
    await this.page.waitForTimeout(1000);

    const catalogLabel = this.page.getByText('Product Catalog', { exact: true });
    const catalogComboBox = catalogLabel.locator('xpath=following::ui5-multi-combobox[1]').nth(0);

    await catalogComboBox.click();
    await this.page.waitForTimeout(1000);
    await catalogComboBox.locator('ui5-icon').click();
    // Wait for the dropdown (popover) to appear
    await this.page.waitForSelector('ui5-responsive-popover[open]');

    // Desired labels to select
    const targetCatalogs = ['CXAI Commerce Joni (', 'CXII Document Test Catalog ('];

    // Locate all items in the dropdown
    const listItemsCatalog = this.page.locator('ui5-responsive-popover[open] ui5-li');
    const itemCountCatalog = await listItemsCatalog.count();
    console.log(`itemCountCatalog : ${itemCountCatalog}`);
    for (let i = 0; i < itemCountCatalog; i++) {
      const item = listItemsCatalog.nth(i);
      const text = (await item.innerText()).trim();
      console.log(`text: ${text}`);

      if (targetCatalogs.some(target => text.startsWith(target))) {
        const checkbox = item.locator('ui5-checkbox');
        const isChecked = await checkbox.getAttribute('checked');

        if (!isChecked) {
          await checkbox.click(); // ✅ click on the checkbox inside the item
          console.log(`✔️ Selected: ${text}`);
        }
      }
    }

    // Close the dropdown
    await this.page.keyboard.press('Escape');

    const ClassificationLabel = this.page.getByText('Classification Catalog', { exact: true });
    const ClassificationComboBox = ClassificationLabel.locator('xpath=following::ui5-multi-combobox[1]').nth(0);

    await ClassificationComboBox.click();
    await this.page.waitForTimeout(1000);
    await ClassificationComboBox.locator('ui5-icon').click();
    // Wait for the dropdown (popover) to appear
    await this.page.waitForSelector('ui5-responsive-popover[open]');

    // Desired labels to select
    const targetClassificationCatalogs = ['CXAI Commerce Classification', 'CXII Document Test'];

    // Locate all items in the dropdown
    const listItemsClassificationCatalog = this.page.locator('ui5-responsive-popover[open] ui5-li');
    const itemCountClassificationCatalog = await listItemsClassificationCatalog.count();
    console.log(`itemCountCatalog : ${itemCountClassificationCatalog}`);
    for (let i = 0; i < itemCountClassificationCatalog; i++) {
      const item = listItemsClassificationCatalog.nth(i);
      const text = (await item.innerText()).trim();

      if (targetClassificationCatalogs.some(target => text.startsWith(target))) {
        const checkbox = item.locator('ui5-checkbox');
        const isChecked = await checkbox.getAttribute('checked');

        if (!isChecked) {
          await checkbox.click(); // ✅ click on the checkbox inside the item
          console.log(`✔️ Selected: ${text}`);
        }
      }
    }

    // Close the dropdown
    await this.page.keyboard.press('Escape');

    // Final submission
    await this.page.getByRole('button', { name: 'Add', exact: true }).click();

    // Assert final row is visible
    await this.page.getByRole('row', { name: 'Name Maximus Commerce' }).getByLabel('Status ACTIVE').click();
  }

}