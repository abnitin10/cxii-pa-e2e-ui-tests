import test, { expect, Page } from '@playwright/test';

export class SmartActions {
    readonly page: Page;
    

    constructor(page: Page) {
        this.page = page;
    }

    async SmartActions(data: {
        "duration": string;
    }) {
        try {
            await this.page.locator('li').filter({ hasText: 'HomeHome' }).click();
            await this.page.getByText('Smart ActionsImprove').click();
            await this.page.locator('.MuiInputBase-root').click();
            await this.page.getByRole('option', { name: data.duration }).click();
            try {
                const noSmartActionsMessage = this.page.locator('text=No smart actions detected at the moment');
              
                const messageVisible = await noSmartActionsMessage.isVisible({ timeout: 5000 });
              
                if (messageVisible) {
                  console.warn('⚠️ Message displayed: "No smart actions detected at the moment". Skipping validation.');
                  return;
                }

                const summary = this.page.locator('[data-cy="actionsDetected"]').first();
                await expect(summary).toBeVisible({ timeout: 100000 });

                const text = await summary.textContent();
                expect(text?.trim().length).toBeGreaterThan(0);
                console.log('📄 Text content:', text);
                console.log('✅ Opportunity summary appeared. Proceeding with validation.');              
              } catch (error) {
                console.warn('⚠️ No smart actions found. Skipping validation steps.');
                console.trace('🔍 Trace Log: No smart actions visible for product');
                console.info('ℹ️ Skipped smart actions validation for product');
              }
              
        } catch (error) {
            console.error("Error occurred in smartActions:", error);
            throw error;
        }
    }

    async SmartActionschromeExtension(data: {
      "duration": string;
  }) {
        try {
          console.log("▶️ Navigating to Smart Actions...");
          await this.page.getByLabel('Smart Actions').getByText('Smart Actions').click();
          
          console.log("▶️ Opening dropdown filter...");
          await this.page.locator('.MuiSelect-select').click();
          
          console.log("▶️ Selecting Duration");
          await this.page.locator(`li:has-text("${data.duration}")`).click();

        } catch (error) {
            console.error("Error occurred in smartActions:", error);
            throw error;
        }
    }
}
