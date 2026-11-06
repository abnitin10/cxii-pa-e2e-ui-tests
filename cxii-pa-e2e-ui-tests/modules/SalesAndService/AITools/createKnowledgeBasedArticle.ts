import { Page, expect } from '@playwright/test';
import { firstElement, verifyResult } from '@helpers/uiHelper';

export class createKnowledgeBasedArticle {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async createKnowledgeBasedArticle(data: {
        accountName: string;
        additionalInformation: string;
    }) {
        try {
            await this.page.locator('div').filter({ hasText: /^Create Knowledge Base ArticleWrite a knowledge base article using case details$/ }).first().click();
            const textbox = this.page.getByRole('textbox', { name: 'Enter a case subject, case ID, account or contact name' });
            await textbox.waitFor({ state: 'visible', timeout: 15000 });
            await textbox.click();
            await textbox.fill(data.accountName);
            await textbox.press('Enter');
            firstElement(this.page);

            if (data.additionalInformation.length > 0) {
                await this.page.locator('textarea').click();
                await this.page.locator('textarea').fill('water input is not proper');
            }

            await this.page.getByRole('button', { name: 'Generate' }).click();
            this.page.getByRole('button', { name: 'Generate' });
            await verifyResult(this.page);
        } catch (error) {
            console.error("Error occurred in CreateKnowledgeBasedArticle:", error);
            throw error;
        }
    }
}