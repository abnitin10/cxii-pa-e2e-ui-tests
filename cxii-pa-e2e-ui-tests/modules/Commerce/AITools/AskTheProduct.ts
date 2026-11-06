import { Page } from '@playwright/test';
import { verifyResult,firstElement } from '@helpers/uiHelper'

export class AskTheProduct {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async clickAskAboutProduct() {
        console.log('Clicking "Ask about this Product"...');
        await this.page.getByText('Ask about this Product').click();
        console.log('"Ask about this Product" clicked.');
    }

    async enterProductDetails(productName: string) {
        console.log(`Entering product name: ${productName}`);
        const productTextbox = this.page.getByRole('textbox', { name: 'Enter a product name or product ID' });
        await productTextbox.fill(productName);
        await productTextbox.press('Enter');
        console.log('Product name entered and submitted.');

        await firstElement(this.page);
        console.log('Selected the first product from search results.');
    }

    async askProductQuestion(question: string) {
        console.log(`Asking product question: "${question}"`);
        const askAnythingTextbox = this.page.getByRole('textbox', { name: 'Ask me about this product...' });
        await askAnythingTextbox.fill(question);
        await this.page.waitForTimeout(3000);
        await askAnythingTextbox.press('Enter');
        console.log('Question submitted.');
    }

    async AskTheProduct(data: { "ProductName": string;
        "askProductQuestion": string;
     }) {
        try {
            console.log('Starting AskTheProduct flow...');
            await this.clickAskAboutProduct();
            await this.enterProductDetails(data.ProductName);
            await this.askProductQuestion(data.askProductQuestion);
            console.log('Waiting for product answer...');
            await this.page.waitForTimeout(5000);
            await verifyResult(this.page);
            console.log('AskTheProduct flow completed.');
        } catch (error) {
            console.error('AskTheProduct flow failed:', error);
            throw error;
        }
    }
}