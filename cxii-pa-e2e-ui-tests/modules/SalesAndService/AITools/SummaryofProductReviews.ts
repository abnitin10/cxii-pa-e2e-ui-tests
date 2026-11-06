import { Page, expect } from '@playwright/test';
import { firstElement } from '@helpers/uiHelper';

export class SummaryOfProductReviews {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async navigateToAITools() {
        try {
            const aiToolsLink = this.page.getByRole('link', { name: 'AI Tools AI Tools' });
            await expect(aiToolsLink).toBeVisible();
            await aiToolsLink.click();
        } catch (error) {
            console.error('❌ Error navigating to AI Tools:', error);
            throw error;
        }
    }

    async openSummaryOfProductReviews() {
        try {
            const summaryHeading = this.page.getByRole('heading', { name: 'Summary of Product Reviews' });
            await expect(summaryHeading).toBeVisible();
            await summaryHeading.click();
        } catch (error) {
            console.error('❌ Error opening Summary of Product Reviews:', error);
            throw error;
        }
    }

    async enterProductName(productName: string) {
        try {
            const searchBox = this.page.getByRole('textbox', { name: 'Enter a product name or' });
            await searchBox.click();
            await searchBox.fill(productName);
            await searchBox.press('Enter');
        } catch (error) {
            console.error(`❌ Error entering product name: ${productName}`, error);
            throw error;
        }
    }

    async clickGenerate() {
        try {
            const generateButton = this.page.getByRole('button', { name: 'Generate' });
            await expect(generateButton).toBeVisible();
            await generateButton.click();
        } catch (error) {
            console.error('❌ Error clicking Generate button:', error);
            throw error;
        }
    }

    async changeSentiment(sentiment: string) {
        try {
            await this.page.getByRole('option', { name: sentiment }).click();
            console.log(`✅ Sentiment changed to: "${sentiment}"`);
        } catch (error) {
            console.error(`❌ Error changing sentiment to: ${sentiment}`, error);
            throw error;
        }
    }

    async validateGeneratedSummary() {
        try {
            const summarySection = this.page.getByRole('main');
            await expect(summarySection).toBeVisible();
            await expect(summarySection).toContainText(/summary/i);
        } catch (error) {
            console.error('❌ Error validating the generated summary:', error);
            throw error;
        }
    }

    async SummaryOfProductReviews(data: {
        ProductName: string;
        changeSentiment: string;
    }) {
        try {
            const currentUrl = this.page.url();
            if (!currentUrl.includes('chrome-extension'))
                await this.navigateToAITools();
            await this.openSummaryOfProductReviews();
            await this.enterProductName(data.ProductName);
            await firstElement(this.page);
            await this.clickGenerate();
            await this.page.waitForTimeout(3000);
            const isVisible = await this.page.getByText('No review summary available.').isVisible();
            if (!isVisible) {
                const warningMessage = this.page.locator('ui5-message-strip[design="Warning"]');
                let condition = true;
                if (await warningMessage.isVisible()) {
                    const messageText = await warningMessage.textContent();
                    console.log(`messageText ${messageText}`)
                    if (messageText?.includes('The summary of reviews for this product is not up to date') ||
                        messageText?.includes('Unable to generate a review summary for this product since the review process is still underway')
                    ) {
                        console.log('⚠️ Execution skipped due to review summary warning.');
                        condition = false
                    }
                }
                if (condition) {
                    await expect.poll(async () => {
                        const result  = this.page.locator('ui5-segmented-button');
                        const text = await result.textContent();
                        return !!text?.trim();
                    }, {
                        timeout: 5000,
                        message: 'No reviews available for the selected product.',
                    }).toBeTruthy();

                    await this.changeSentiment(data.changeSentiment);
                    await this.validateGeneratedSummary();
                }
              }else {
                console.warn('No review summary available. Skipping validation steps.');
                console.trace(`Trace Log: No review summary visible for product`);
                console.info(`Skipped summary validation for product`);
            }
            
        } catch (error) {
            console.error('❌ Test failed due to an error:', error);
            throw error;
        }
    }
}
