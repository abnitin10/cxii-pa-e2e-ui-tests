import { Page, expect } from '@playwright/test';
import { firstElement, selectUI5DropdownValue, verifyResult } from '@helpers/uiHelper';

export class generateQuestionForDiscoveryCall {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async generateQuestionForDiscoveryCall(data: {
        firstName: string;
        renderCount: string;
        renderTone: string;
        challengesTextbox: string;
        customerTextbox: string;
    }) {
        try {
            await this.page.locator('li').filter({ hasText: 'Generate Questions for a' }).locator('div').first().click();
            const nameTextbox = this.page.getByRole('textbox', { name: 'Enter a first name, last name, email address' });
            const challengesTextbox = this.page.getByRole('textbox', { name: 'Enter the customer’s challenges that they are trying to solve' });
            const customerTextbox = this.page.getByRole('textbox', { name: 'Enter the customer’s goals, expectations, or ideal state' });
            await nameTextbox.waitFor({ state: 'visible', timeout: 15000 });
            await nameTextbox.click();
            await nameTextbox.fill('Joe');
            await nameTextbox.press('Enter');
            firstElement(this.page);
            await challengesTextbox.waitFor({ state: 'visible', timeout: 15000 });
            await challengesTextbox.click();
            await challengesTextbox.fill(data.challengesTextbox);
            await customerTextbox.waitFor({ state: 'visible', timeout: 15000 });
            await customerTextbox.click();
            await customerTextbox.fill(data.customerTextbox);

            const tonedropdown = this.page.locator('[data-cy="renderTone"]');
            if (data.renderTone.length > 0)
                await selectUI5DropdownValue(this.page, tonedropdown, data.renderTone);

            const countdropdown = this.page.locator('[data-cy="renderQuestionCount"]');
            if (data.renderCount.length > 0)
                await selectUI5DropdownValue(this.page, countdropdown, data.renderCount);

            await this.page.getByRole('button', { name: 'Generate' }).click();
            this.page.getByRole('button', { name: 'Generate' });
            await verifyResult(this.page);
        } catch (error) {
            console.error("Error occurred in GenerateQuestionForDiscoveryCall:", error);
            throw error;
        }
    }
}