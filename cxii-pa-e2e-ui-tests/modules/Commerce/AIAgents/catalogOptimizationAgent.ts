import { test, expect, Page } from '@playwright/test';
import { deleteAgentByName, firstElement } from '@helpers/uiHelper'

export class catalogOptimizationAgent {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async catalogOptimizationAgent(data: {
    "AgentName": string;
    "AgentDescription": string;
    "ProductCatalog": string;
    "CatalogVersion": string;
    "ClassificationCatalog"?: string;
    "ClassificationCatalogVersion"?: string;
    "languagesToSelect": string[];

  }) {
    console.log('🔹 Navigating to AI Agents section...');
    await this.page.getByRole('link', { name: 'AI Agents AI Agents' }).click();
    console.log(`🔹 Checking if previous ${data.AgentName} exists...`);
    if (await deleteAgentByName(this.page, data.AgentName)) {
      console.log('🔹 Clicking Create AI Agent button...');
      await this.page.locator('button[title="Create AI Agent"]').click({ force: true });
    }

    console.log('🔹 Waiting for Catalog Optimization Agent card...');
    const card = this.page.locator('ui5-card', { hasText: 'Catalog Optimization Agent' });
    await card.waitFor({ state: 'visible', timeout: 10000 });
    await card.scrollIntoViewIfNeeded();
    await card.locator('div[part="root"]').click({ force: true });
    console.log('✅ Clicked the Catalog Optimization card successfully.');

    console.log('🔹 Proceeding with Agent setup steps...');
    await this.page.getByRole('button', { name: 'Next' }).click();

    console.log('🔹 Filling agent name and description...');
    await this.page.locator('.ui5-wiz-step-title-text', { hasText: 'Agent Setup' }).click();
    await this.page.locator('#AgentSetup input[type="text"]').fill(data.AgentName);
    await this.page.locator('ui5-textarea').filter({ hasText: 'Description is required.' })
      .getByRole('textbox').fill(data.AgentDescription);
    await this.page.getByRole('button', { name: 'Next' }).click();

    console.log('🔹 Verifying system values...');
    await this.page.locator('.ui5-wiz-step-title-text', { hasText: 'Agent Trigger' }).click();
    await expect(this.page.getByRole('textbox').first()).toHaveValue('SAP Commerce Cloud');
    await expect(this.page.getByRole('textbox').nth(1)).toHaveValue('Product');

    console.log('🔹 Configuring catalog setup...');
    await this.page.getByRole('button', { name: 'Add' }).click();
    await this.page.locator('div[data-row-index="2"] ui5-icon[name="slim-arrow-down"]').click();
    await this.page.getByRole('listitem', { name: data.ProductCatalog }).click();

    await this.page.locator('div[data-row-index="4"] ui5-icon[name="slim-arrow-down"]').click();
    await this.page.getByRole('listitem', { name: data.CatalogVersion }).click();

    console.log('🔹 Selecting all products...');
    await this.page.locator('div[data-row-index="6"] ui5-icon[name="slim-arrow-down"]').click();
    await this.page.getByRole('checkbox', { name: /Select All/ }).click();
    await this.page.keyboard.press('Escape');

    await this.page.locator('div[data-row-index="8"] ui5-icon[name="slim-arrow-down"]').click();
    await this.page.getByRole('listitem', { name: data.ClassificationCatalog }).click();

    await this.page.locator('div[data-row-index="10"] ui5-icon[name="slim-arrow-down"]').click();
    await this.page.getByRole('listitem', { name: data.ClassificationCatalogVersion }).click();

    console.log('🔹 Saving catalog configuration...');
    await this.page.getByRole('button', { name: 'Save' }).click();
    await expect(this.page.locator('ui5-table-row')).toContainText('CXAICommerceJoni');
    console.log('✅ Catalog setup saved and validated.');

    console.log(`🔹 Proceeding to Target Language selection : ${data.languagesToSelect}`);
    await this.page.getByRole('button', { name: 'Next' }).click();
    await this.page.locator('.ui5-wiz-step-title-text', { hasText: 'Agent Settings' }).click();
    await this.page.locator('.ui5-multi-combobox-root > ui5-icon').first().click();
    for (const lang of data.languagesToSelect) {
      await this.page.getByRole('option', { name: lang }).getByLabel('Multiple Selection mode.').click();
      console.log(`Selected Langage : ${lang}`);
    }

    console.log('🔹 Saving language configuration...');
    await this.page.getByRole('button', { name: 'Save' }).click();
    await this.page.waitForTimeout(2000);
    await this.page.locator('.ui5-wiz-step-title-text', { hasText: 'Agent Settings' }).click();
    await this.page.getByRole('button', { name: 'Save' }).click();

    const textbox = this.page.getByRole('textbox', { name: 'Enter product name, code, or keyword' });
    await textbox.waitFor({ state: 'visible', timeout: 15000 });
    await textbox.click();
    await textbox.fill('a');
    await textbox.press('Enter');
    firstElement(this.page);
    await this.page.getByRole('button', { name: 'Generate' }).click();

    // Wait for the Status label to appear
    await this.page.waitForSelector('ui5-label:has-text("Status")', { timeout: 60000 });

    // Locate the value span right after the label
    const statusLocator = this.page.locator('ui5-label:has-text("Status") + span');

    // Get the text content
    const statusText = (await statusLocator.textContent())?.trim();
    console.log(`🔹 Current Status: ${statusText}`);

    // Validate the status
    if (statusText !== 'DONE') {
      throw new Error(`❌ Status is "${statusText}", expected "DONE".`);
    }
    console.log('✅ Status is DONE — validation successful.');
    await this.page.getByRole('button', { name: 'Close', exact: true }).click();

    console.log('🕒 Waiting for confirmation...');
    await this.page.waitForTimeout(3000);

    console.log('🔹 Deleting test agent for cleanup...');
    await deleteAgentByName(this.page, data.AgentName);

    console.log('✅ Catalog Optimization Agent flow completed successfully.');
  }
}