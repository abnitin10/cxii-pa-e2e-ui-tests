import { expect, Page } from '@playwright/test';
import { firstElement, selectUI5DropdownValue } from '@helpers/uiHelper';

export class summarizeSalesOppotunity {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async summarizeSalesOppotunity(data: {
        accountName: string
        renderLength: string;
    }) {
        try {
            console.log("Navigating to 'Summarize a Sales Opportunity' section...");
            const opportunitySection = this.page.locator('div').filter({ hasText: /^Summarize a Sales OpportunitySummarize a sales opportunity linked to an account$/ });
            await opportunitySection.first().click();

            console.log("Filling in 'Opportunity name or ID'...");
            const opportunityInput = this.page.getByRole('textbox', { name: 'Opportunity name or ID' });
            await opportunityInput.fill(data.accountName);
            await opportunityInput.press('Enter');
            firstElement(this.page);

            const lengthdropdown = this.page.locator('[data-cy="renderLength"]');
            if (data.renderLength.length > 0) {
                console.log(`Selecting render length: ${data.renderLength}`);
                await lengthdropdown.waitFor({ state: 'visible', timeout: 10000 });
                await selectUI5DropdownValue(this.page, lengthdropdown, data.renderLength);
                console.log('Render length selected.');
            }
            console.log("Clicking 'Generate'...");
            const generateButton = this.page.getByRole('button', { name: 'Generate' });
            await generateButton.waitFor({ state: 'attached', timeout: 5000 });
            await generateButton.click();

            await expect.poll(async () => {
                const result = await this.page.locator('[data-cy="opportunitySummary"]');
                const text = await result.textContent();
                console.log('📄 Text content:', text);
                return !!text?.trim();
            }, {
                timeout: 30000,
                message: 'Expected the opportunity summary to appear',
            }).toBeTruthy();
            
            console.log("Test completed successfully!");
        } catch (error) {
            console.error("Error occurred in summarizeSalesOpp():", error);
            throw error;
        }

    }
}