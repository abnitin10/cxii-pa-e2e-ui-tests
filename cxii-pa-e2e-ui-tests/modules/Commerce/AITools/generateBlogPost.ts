import { Page, expect } from '@playwright/test';
import { selectUI5DropdownValue, firstElement } from '@helpers/uiHelper';

export class generateBlogPost {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async openBlogPostGenerator() {
        await this.page.locator('div').filter({
            hasText: /^Generate Blog PostGenerate blog posts for my products$/
        }).first().click();
    }

    async enterProductDetails(productName: string) {
        const productTextbox = this.page.getByRole('textbox', { name: 'Enter a product name or product ID' });

        await productTextbox.waitFor({ state: 'visible' });
        await productTextbox.fill(productName);
        await productTextbox.press('Enter');
        await firstElement(this.page);
    }

    async enterBlogDetails(description: string): Promise<boolean> {
        const blogDescriptionTextbox = this.page.getByRole('textbox', { name: 'Tell us about the basics of your blog in a few words' });

        await blogDescriptionTextbox.waitFor({ state: 'visible' });
        await blogDescriptionTextbox.fill(description);

        const locator = await this.page.locator('ui5-label span', { hasText: '/40 (minimum 40 characters)' }).first();
        const text = await locator.textContent();
        const currentValue = parseInt(text?.split('/')[0].trim() || '0', 10);
        console.log(currentValue);
        if (currentValue < 40) {
            console.warn(`Warning: Minimum character requirement not met. Current value is ${currentValue}.`);
            return false;
        } else {
            console.log(`Character requirement met: ${currentValue}`);
            return true;
        }
    }

    async entercustomInstructions(instructions: string) {
        const customInstructionsTextbox = this.page.getByRole('textbox', { name: 'Enter additional guidance for the blog post' });
        await customInstructionsTextbox.waitFor({ state: 'visible' });
        await customInstructionsTextbox.fill(instructions);
    }

    async clickGenerate() {
        const generateButton = this.page.getByRole('button', { name: 'Generate' });
        await generateButton.waitFor({ state: 'visible' });
        await generateButton.click();
    }

    async validatePopoverErrorMessage() {
        const textbox = this.page.getByRole('textbox', {
            name: 'Tell us about the basics of your blog in a few words'
        });

        await textbox.click();
        const borderColor = await textbox.evaluate((element) =>
            window.getComputedStyle(element).borderColor
        );
    
        console.log(`📘 Textbox border color: ${borderColor}`);
        const expectedColor = 'rgb(19, 30, 41)';
    
        if (borderColor == expectedColor) {
            console.warn(`✅ Textbox border is red, indicating validation error`);
        }
    }

    async generateBlogPost(data: {
        "ProductName": string;
        "renderTone": string;
        "renderLength": string;
        "description": string;
        "instructions": string;
    }) {
        try {
            await this.openBlogPostGenerator();
            await this.enterProductDetails(data.ProductName);
            const value = await this.enterBlogDetails(data.description);
            await this.entercustomInstructions(data.instructions);

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
            if(!value){
                await this.validatePopoverErrorMessage();
            }else{
            await expect.poll(async () => {
                const paragraphs = await this.page.locator('#copyText').all();
                const texts = await Promise.all(paragraphs.map(async (p) => await p.textContent()));
                if (texts.length > 0)
                    console.log('📄 Paragraphs found:', texts); 
                return paragraphs.length;
            }, {
                timeout: 60000, 
                message: 'Expected at least one paragraph element to appear',
            }).toBeGreaterThan(0);
        }
        } catch (error) {
            console.error("Error in GenerateBlogPost flow:", error);
            throw error;
        }
    }
}