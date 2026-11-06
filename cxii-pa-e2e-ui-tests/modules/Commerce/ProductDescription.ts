import { Page, expect } from '@playwright/test';
import { selectUI5DropdownValue } from '@helpers/uiHelper';

export class ProductDescription {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async navigateToProductDescription() {
        console.log('Navigating to Product Descriptions Product...');
        await this.page.getByRole('link', { name: 'Product Descriptions Product' }).click();
    }

    async ProductDescriptionClick() {
        console.log('Clicking on Product Descriptions link...');
        await this.page.locator('ui5-li-custom').filter({ hasText: 'Product Descriptions' }).click();
    }

    async searchProduct() {
        console.log('Triggering product search input...');
        await this.page.waitForTimeout(2000);
       
        // Locate all product cards
        const cards = this.page.locator('ui5-card');

        // Get total count
        const count = await cards.count();
        console.log(`count ${count}`)
        if (count === 0) {
            console.log('No product cards found ❌');
            return false;
        }

        // Generate a random index between 0 and count-1
        const randomIndex = Math.floor(Math.random() * count);

        // Log for debugging
        console.log(`Clicking random product at index ${randomIndex}`);
        return true;
    }

    async expandDetails() {
        console.log('Checking if details section is expanded...');
        const expandCollapseBtn = this.page.getByRole('button', { name: 'Expand/Collapse' }).last();
        await expect(expandCollapseBtn).toBeVisible();
        const isExpanded = await expandCollapseBtn.getAttribute('aria-expanded');

        if (isExpanded === 'true') {
            console.log('🔽 Section is already expanded. Skipping click.');
        } else {
            console.log('▶️ Section is collapsed. Expanding...');
            await expandCollapseBtn.click();
        }
    }

    async selectTemplate(templateName: string) {
        console.log(`Selecting template: ${templateName}`);
        await this.page.locator('ui5-combobox ui5-icon').click();
        await this.page.getByRole('option', { name: templateName }).click();
    }

    async enterPrompt(promptText: string) {
        console.log(`Entering prompt: ${promptText}`);
        const textbox = this.page.getByRole('textbox', { name: /Enter a prompt/i });
        await textbox.waitFor({ state: 'visible' });
        await textbox.fill(promptText);
    }

    async setToneAndDetail(tone: string, detail: string) {
        console.log(`Setting tone: ${tone}, detail: ${detail}`);
        await this.page.locator('[id*=select] ui5-icon').nth(0).click();
        await this.page.getByRole('listitem', { name: tone }).click();

        await this.page.locator('[id*=select] ui5-icon').nth(1).click();
        await this.page.getByRole('listitem', { name: detail }).click();
    }

    async enterPromptchrome(promptText: string) {
        console.log(`Entering Chrome prompt: ${promptText}`);
        const textbox = this.page.getByRole('textbox', { name: 'Enter a product name or product ID' });
        await textbox.waitFor({ state: 'visible' });
        await textbox.fill(promptText);
        await textbox.press('Enter');
        const firstElement = this.page.locator('[role="cell"]').nth(1);
        await firstElement.waitFor();
        await firstElement.click();
    }

    async checkOptions() {
        console.log('Checking all unchecked options...');
        await this.page.getByRole('button', { name: 'Select All' }).first().click();
    }

    async generateDescription() {
        console.log('Clicking Generate button...');
        const generateButton = this.page.getByRole('button', { name: 'Generate' });
        await generateButton.waitFor({ state: 'visible' });
        await generateButton.click();
        this.page.waitForTimeout(1000);
    }

    async publishDescription(languagesToSelect: string[]) {
        console.log('Clicking Publish button...');
        const publishButton = this.page.getByRole('button', { name: 'Publish' });
        await publishButton.waitFor({ state: 'visible' });
        await publishButton.click();
        await this.page.locator('ui5-multi-combobox ui5-icon').click();

        for (const lang of languagesToSelect) {
            await this.page.getByRole('option', { name: lang }).getByLabel('Multiple Selection Mode').click();
            console.log(`Selected Langage : ${lang}`);
        }
        await this.page.waitForTimeout(2000);
        await this.page.keyboard.press('Tab');
        await this.page.waitForTimeout(2000);
        await this.page.keyboard.press('Enter');
        await this.page.waitForTimeout(2000);
        await this.page.getByRole('button', { name: 'Publish' }).first().click();
    }

    async ProductDescription(data: {
        flowType: string,
        template: string,
        prompt: string,
        renderTone: string,
        renderLength: string,
        languagesToSelect: string[]
    }) {
        console.log(`Running ProductDescription flow with flowType: ${data.flowType}`);
        await this.navigateToProductDescription();

        if (data.flowType === 'Add Contact') {
            console.log('Flow: Add Contact');
            await this.page.getByRole('option', { name: 'Add Contact' }).click();
            await this.searchProduct();
            await this.expandDetails();
            await this.selectTemplate(data.template);
            await this.enterPrompt(data.prompt);

            const lengthdropdown = this.page.locator('ui5-select').nth(1);
            if (data.renderLength.length > 0) {
                console.log(`Selecting render length: ${data.renderLength}`);
                await lengthdropdown.waitFor({ state: 'visible', timeout: 10000 });
                await selectUI5DropdownValue(this.page, lengthdropdown, data.renderLength);
            }

            await this.page.waitForTimeout(2000);
            await this.expandDetails();
            await this.checkOptions();
            await this.page.waitForTimeout(2000);

            console.log("Expanding first section...");
            await this.page.getByRole('button', { name: 'Expand/Collapse' }).nth(1).click();
            await this.page.waitForTimeout(2000);

            console.log("Expanding second section...");
            await this.page.getByRole('button', { name: 'Expand/Collapse' }).nth(2).click();

            console.log("Selecting all items in second section...");
            await this.page.getByRole('button', { name: 'Select All' }).nth(1).click();
            await this.page.waitForTimeout(2000);
            await this.generateDescription();

            console.log('Clicking Publish button...');
            const publishButton = this.page.getByRole('button', { name: 'Publish' });
            await publishButton.waitFor({ state: 'visible' });
            await publishButton.click();

            console.log("Navigating to Translate Description tab...");
            await this.page.getByRole('tab', { name: 'Translate Description' }).locator('div').click();

            console.log("Opening language dropdown...");
            await this.page.locator('ui5-multi-combobox ui5-icon').click();

            console.log("Selecting ES - Spanish...");
            await this.page.getByRole('option', { name: 'ES - Spanish' })
                .getByLabel('Multiple Selection Mode')
                .click();

            console.log("Clicking Translate...");
            await this.page.getByRole('button', { name: 'Translate' }).click();

            console.log("Waiting for translation completion...");
            await this.page.locator('div')
                .filter({ hasText: /^Translation completed for the languages ES$/ })
                .nth(3)
                .click();

            console.log("Clicking Publish...");
            await this.page.getByRole('button', { name: 'Publish' }).click();

            console.log("Confirming publish success for ES...");
            await this.page.locator('div')
                .filter({ hasText: /^Your selected description for ES have been published$/ })
                .nth(3)
                .click();

            console.log("✅ Translation and publish flow completed successfully.");


        } else if (data.flowType === 'List View') {
            console.log('Flow: List View');
            await this.page.getByRole('option', { name: 'List View' }).click();
            console.log('Selecting checkboxes...');
            await this.page.locator('.MuiDataGrid-cellCheckbox').first().click();
            await this.page.locator('div:nth-child(2) > .MuiDataGrid-cellCheckbox').click();
            await this.page.locator('div:nth-child(3) > .MuiDataGrid-cellCheckbox').click();

            await this.page.getByRole('button', { name: 'Generate' }).click();

            const lengthdropdown = this.page.locator('ui5-select').first();
            if (data.renderLength.length > 0) {
                console.log(`Selecting render length: ${data.renderLength}`);
                await lengthdropdown.waitFor({ state: 'visible', timeout: 10000 });
                await selectUI5DropdownValue(this.page, lengthdropdown, data.renderLength);
            }

            console.log('Clicking Generate inside dialog...');
            await this.page.getByRole('main').locator('ui5-dialog').getByRole('button', { name: 'Generate' }).click();

            await this.generateDescription();

            await this.publishDescription(data.languagesToSelect);
        } else {
            console.log(`❌ Unexpected flow type: ${data.flowType}`);
            throw Error;
        }
    }

    async ProductDescriptionChromeExtension(data: {
        flowType: string;
        template: string;
        prompt: string;
        renderTone: string;
        renderLength: string;
    }) {
        try {
            console.log('Running Chrome-specific flow...');
            await this.page.getByRole('button', { name: 'More' }).click();
            console.log('Navigating to Product Description...');
            await this.ProductDescriptionClick();
            await this.enterPromptchrome(data.prompt);

            const button = this.page.locator('ui5-button[tooltip="Expand/Collapse"] ui5-icon').first();
            const isExpanded = await button.getAttribute('aria-expanded');

            if (isExpanded === 'false') {
                console.log('Expanding collapsed section...');
                await this.page.locator('ui5-button[tooltip="Expand/Collapse"]').first().click();
                const tonedropdown = this.page.locator('ui5-select').first();
                const lengthdropdown = this.page.locator('ui5-select').nth(1);
                if (data.renderLength.length > 0) {
                    console.log(`Selecting render length: ${data.renderLength}`);
                    await lengthdropdown.waitFor({ state: 'visible', timeout: 10000 });
                    await selectUI5DropdownValue(this.page, lengthdropdown, data.renderLength);
                }
            }

            console.log('Clicking Generate button...');
            await this.page.getByRole('button', { name: 'Generate' }).click();

            const descriptionDiv = this.page.locator('div[class*="FlexBox_flexBoxDirectionRow"]').first();
            await expect(descriptionDiv).toHaveText(/.+/, { timeout: 5000 });

            console.log('Clicking Publish button...');
            const publishButton = this.page.getByRole('button', { name: 'Publish' });
            await publishButton.waitFor({ state: 'visible' });
            await publishButton.click();

        } catch (error) {
            console.error("❌ Error in ProductDescription Chrome Extension flow:", error);
            throw error;
        }
    }
}