import { expect, Page } from '@playwright/test';
import { firstElement, selectUI5DropdownValue, verifyResult } from '@helpers/uiHelper';

export class writeCaseOverview {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async writeCaseOverview(data: {
        firstName: string;
        renderLength: string;
        renderTone: string;
        highlightTextbox: string;
      actionTextbox: string;
    }) {
        try {
            await this.page.getByText('Write a Case OverviewWrite a').click();
            const searchTextbox = this.page.getByRole('textbox', { name: 'Enter a case subject, case ID, account or contact name' });
            const highlightTextbox = this.page.getByRole('textbox', { name: 'Highlight important issues with the case or account' });
            const actionTextbox = this.page.getByRole('textbox', { name: 'Enter action items that are, or should be, scheduled' });
           
            await searchTextbox.waitFor({ state: 'visible', timeout: 15000 });
            await searchTextbox.click();
            await searchTextbox.fill(data.firstName);
            await searchTextbox.press('Enter');
            firstElement(this.page);

            await highlightTextbox.waitFor({ state: 'visible', timeout: 15000 });
            await highlightTextbox.click();
            await highlightTextbox.fill(data.highlightTextbox);
            await actionTextbox.waitFor({ state: 'visible', timeout: 15000 });
            await actionTextbox.click();
            await actionTextbox.fill(data.actionTextbox);

            const tonedropdown = this.page.locator('[data-cy="renderTone"]');
            if (data.renderTone.length > 0) {
                console.log(`Selecting render tone: ${data.renderTone}`);
                await tonedropdown.waitFor({ state: 'visible', timeout: 10000 });
                await selectUI5DropdownValue(this.page, tonedropdown, data.renderTone);
                console.log('Render tone selected.');
            }

            const lengthdropdown = this.page.locator('[data-cy="renderLength"]');
            if (data.renderLength.length > 0) {
                console.log(`Selecting render length: ${data.renderLength}`);
                await lengthdropdown.waitFor({ state: 'visible', timeout: 10000 });
                await selectUI5DropdownValue(this.page, lengthdropdown, data.renderLength);
                console.log('Render length selected.');
            }

            await this.page.getByRole('button', { name: 'Generate' }).click();
            await verifyResult(this.page);
        } catch (error) {
            console.error("Error occurred in writeCaseOverview:", error);
            throw error;
        }
    }
}