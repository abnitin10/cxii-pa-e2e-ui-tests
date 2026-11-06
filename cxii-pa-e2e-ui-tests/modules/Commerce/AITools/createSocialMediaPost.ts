import { Page, expect } from '@playwright/test';
import { selectUI5DropdownValue, firstElement, verifyResult } from '@helpers/uiHelper';

export class createSocialMediaPost {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async openSocialMediaPostModal() {
        console.log('Opening Social Media Post modal...');
        const modalTrigger = this.page.locator('div').filter({
            hasText: /^Create Social Media PostsGenerate social media posts for my products$/
        }).first();

        await modalTrigger.waitFor({ state: 'visible', timeout: 10000 });
        await modalTrigger.click();
        console.log('Modal opened.');
    }

    async enterProductDetails(productName: string) {
        console.log(`Entering product name: ${productName}`);
        await this.page.waitForTimeout(3000);
        const textbox = this.page.getByRole('textbox', { name: 'Enter a product name or product ID' });

        await textbox.waitFor({ state: 'visible', timeout: 10000 });
        await textbox.fill(productName);
        await textbox.press('Enter');
        console.log('Product name submitted.');

        await firstElement(this.page);
        console.log('Selected first product from search results.');
    }

    async clickGenerate() {
        console.log('Clicking Generate button...');
        const generateButton = this.page.getByRole('button', { name: 'Generate' });
        await generateButton.waitFor({ state: 'visible', timeout: 10000 });
        await generateButton.click();
        console.log('Generate button clicked.');
    }

    async additionalGuidance(info: string) {
        console.log(`Entering additional guidance: "${info}"`);
        const guidanceInput = this.page.getByRole('textbox', { name: 'Enter additional guidance for' });
        await guidanceInput.waitFor({ state: 'visible', timeout: 10000 });
        await guidanceInput.click();
        await guidanceInput.fill(info);
        console.log('Additional guidance entered.');
    }

    async createSocialMediaPost(data: {
        ProductName: string;
        renderLength: string;
        renderTone: string;
        additionalGuidance: string;
        platformSelect: string;
    }) {
        try {
            console.log('Starting CreateSocialMediaPost flow...');

            await this.openSocialMediaPostModal();
            await this.enterProductDetails(data.ProductName);

            console.log(`Selecting platform: ${data.platformSelect}`);
            const platformSelect = this.page.locator('[data-cy="platformSelect"]');
            await platformSelect.waitFor({ state: 'visible', timeout: 10000 });
            await selectUI5DropdownValue(this.page, platformSelect, data.platformSelect);
            console.log('Platform selected.');

            await this.additionalGuidance(data.additionalGuidance);

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

            await this.clickGenerate();

            console.log('Waiting for result...');
            
            await verifyResult(this.page);

            console.log('CreateSocialMediaPost flow completed.');
        } catch (error) {
            console.error('CreateSocialMediaPost flow failed:', error);
            throw error;
        }
    }
}
