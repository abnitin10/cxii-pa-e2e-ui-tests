import { Page, expect } from '@playwright/test';
import { selectUI5DropdownValue, firstElement } from '@helpers/uiHelper';

export class generateProductBannerTxt {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async openProductBannerGenerator() {
        await this.page.locator('div').filter({
            hasText: /^Generate Product Banner TextGenerate banner text for my products$/
        }).first().click();
    }

    async enterProductDetails(productName: string) {
        const productTextbox = this.page.getByRole('textbox', { name: 'Enter a product name or product ID' });
        await productTextbox.waitFor({ state: 'visible' });
        await productTextbox.fill(productName);
        await productTextbox.press('Enter');
        await firstElement(this.page);
    }

    async additionalGuidance(info: string) {
        console.log(`Entering additional guidance: "${info}"`);
        const guidanceInput = this.page.getByRole('textbox', { name: 'Enter additional guidance for' });
        await guidanceInput.waitFor({ state: 'visible', timeout: 10000 });
        await guidanceInput.click();
        await guidanceInput.fill(info);
        console.log('Additional guidance entered.');
    }

    async clickGenerate() {
        const generateButton = this.page.getByRole('button', { name: 'Generate' });
        await generateButton.waitFor({ state: 'visible' });
        await generateButton.click();
    }

    async generateProductBannerTxt(data: {
        "ProductName": string;
        "CustomInstructions": string;
        "renderTone": string;
        "renderSuggestions": string;
    }) {
        try {
            await this.openProductBannerGenerator();
            await this.enterProductDetails(data.ProductName);

            if (data.CustomInstructions.length > 0)
                await this.additionalGuidance(data.CustomInstructions);

            const tonedropdown = this.page.locator('[data-cy="renderTone"]');
            if (data.renderTone.length > 0) {
                console.log(`Selecting render tone: ${data.renderTone}`);
                await tonedropdown.waitFor({ state: 'visible', timeout: 10000 });
                await selectUI5DropdownValue(this.page, tonedropdown, data.renderTone);
                console.log('Render tone selected.');
            }

            const countdropdown = this.page.locator('[data-cy="renderSuggestions"]');
            if (data.renderSuggestions.length > 0)
                await selectUI5DropdownValue(this.page, countdropdown, data.renderSuggestions);

            await this.clickGenerate();
            await this.page.waitForTimeout(5000);
            await this.page.locator('#copyText > div').first().waitFor({ timeout: 60000 });
            const childCount = await this.page.locator('#copyText > div').count();
            expect(childCount).toBeGreaterThan(0);
            expect(childCount).toEqual(Number(data.renderSuggestions));
        } catch (error) {
            console.error("Error in GenerateProductBannerTxt flow:", error);
            throw error;
        }
    }
}