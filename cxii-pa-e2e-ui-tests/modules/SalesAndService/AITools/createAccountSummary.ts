import { expect, Page } from '@playwright/test';
import { selectUI5DropdownValue, firstElement, verifyResult } from '@helpers/uiHelper';

export class createAccountSummary {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async createAccountSummary(data: {
        accountName: string;
        opportunity: string;
        caseType: string;
        renderLength: string;
    }) {
        try {
            await this.page.locator('div').filter({ hasText: /^Create an Account SummaryGenerate a short overview of any account$/ }).first().click();

            const textbox = this.page.getByRole('textbox', { name: 'Enter an account name or account ID' });
            await textbox.waitFor({ state: 'visible', timeout: 15000 });
            await textbox.click();
            await textbox.fill(data.accountName);
            await textbox.press('Enter');

            firstElement(this.page);
            const opportunityDropdown = this.page.locator('ui5-select[data-cy="opportunity"]');
            if (data.opportunity.length > 0)
                await selectUI5DropdownValue(this.page, opportunityDropdown, data.opportunity);

            const caseDropdown = this.page.locator('[data-cy="case"]');
            if (data.caseType.length > 0)
                await selectUI5DropdownValue(this.page, caseDropdown, data.caseType);

            const lengthdropdown = this.page.locator('[data-cy="renderLength"]');
            await selectUI5DropdownValue(this.page, lengthdropdown, data.renderLength);

            await this.page.getByRole('button', { name: 'Generate' }).click();
            await verifyResult(this.page);

        } catch (error) {
            console.error("Error occurred in createAccountSummary:", error);
            throw error;
        }
    }
}
