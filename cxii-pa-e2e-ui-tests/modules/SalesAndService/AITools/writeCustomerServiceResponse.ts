import { Page, expect } from '@playwright/test';
import { firstElement } from '@helpers/uiHelper';

export class writeCustServiceResponse {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async writeCustServiceResponse(data: {
        searchTextbox: string;
        informationTextbox: string;
        linkToPublicTextbox:string;
    }) {
        try {
            await this.page.locator('li').filter({ hasText: 'Write a Customer Service' }).locator('div').first().click();
            const searchTextbox = this.page.getByRole('textbox', { name: 'Enter a case subject, case ID, account or contact name' });
            const informationTextbox = this.page.getByRole('textbox').nth(2);
            const linkToPublicTextbox = this.page.getByRole('textbox', { name: 'Enter the link to the public knowledge base' });

            await searchTextbox.waitFor({ state: 'visible', timeout: 15000 });
            await searchTextbox.click();
            await searchTextbox.fill(data.searchTextbox);
            await searchTextbox.press('Enter');
            firstElement(this.page);
            await informationTextbox.waitFor({ state: 'visible', timeout: 15000 });
            await informationTextbox.click();
            await informationTextbox.fill(data.informationTextbox);
            await linkToPublicTextbox.waitFor({ state: 'visible', timeout: 15000 });
            await linkToPublicTextbox.click();
            await linkToPublicTextbox.fill(data.linkToPublicTextbox);
            await this.page.getByRole('button', { name: 'Generate' }).click();
            this.page.getByRole('button', { name: 'Generate' });
            await expect.poll(async () => {
                const result = await this.page.locator('[data-cy="generatedResponse"]');
                const text = await result.textContent();
                console.log('📄 Text content:', text);
                return !!text?.trim();
            }, {
                timeout: 30000,
                message: 'Expected the opportunity summary to appear',
            }).toBeTruthy();

        } catch (error) {
            console.error("Error occurred in WriteCustServiceResponse:", error);
            throw error;
        }
    }
}