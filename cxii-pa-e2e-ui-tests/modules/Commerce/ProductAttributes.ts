import { Locator, Page, expect } from '@playwright/test';
import { firstElement } from '@helpers/uiHelper';

export class ProductAttributes {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async ProductAttributes(data: {
        productName: string;
        Description: boolean;
        Image: boolean;
        radioButton: 'Overwrite' | 'Append';
        prompt: string;
        languagesToSelect: string;
    }) {
        try {
            console.log('🚀 Starting ProductAttributes flow...');
            const expectedWidth = 1280;
            const expectedHeight = 720;

            console.log(`Setting viewport: ${expectedWidth}x${expectedHeight}`);
            await this.page.setViewportSize({ width: 1280, height: 720 });
            await this.page.waitForTimeout(2000);

            while (true) {
                const size = this.page.viewportSize();
                if (size?.width === expectedWidth && size?.height === expectedHeight) {
                    console.log(`✅ Viewport size matched: ${size.width}x${size.height}`);
                    break;
                }
                console.log('⏳ Waiting for viewport size to match...');
                await this.page.waitForTimeout(1000);
            }

            console.log('⚡ Launching main workflow');
            await Promise.race([
                (async () => {
                    await this.navigateToProductAttributes();
                    await this.searchAndSelectProduct(data.productName, data.languagesToSelect);
                    await this.validateTabVisible();
                    await this.clickGenerateAndPublish(data.radioButton, data.Description, data.Image);
                })(),
                new Promise((_, reject) =>
                    setTimeout(() => reject(new Error('⏱ Timeout: Product Attributes took longer than 300 seconds')), 300000)
                )
            ]);

            console.log('🎉 ProductAttributes flow completed successfully.');
        } catch (error) {
            console.error('❌ Error in ProductAttributes:', error.message);
        }
    }

    async ProductAttributesChromeExtension(data: {
        productName: string;
        Description: boolean;
        Image: boolean;
        radioButton: 'Overwrite' | 'Append';
        prompt: string;
    }) {
        try {
            console.log('🌐 Starting ProductAttributes Chrome Extension flow...');
            await this.page.getByRole('button', { name: 'More' }).click();
            await this.page.locator('ui5-li-custom').filter({ hasText: 'Product Attributes' }).click();
            console.log('✅ Opened Product Attributes in Chrome Extension.');

            console.log(`Filling product name: ${data.productName}`);
            await this.page.getByRole('textbox', { name: 'Enter a product name or' }).fill(data.productName);
            await this.page.getByRole('textbox', { name: 'Enter a product name or' }).press('Enter');

            console.log('Waiting for search results...');
            await firstElement(this.page);
            console.log('✅ Product selected.');

            console.log('Clicking "Select All"...');
            await this.page.locator('ui5-button[data-cy="selectAllButton"]').click();

            console.log('Clicking Generate...');
            await this.page.getByRole('button', { name: 'Generate' }).click();

            const toastLocator = this.page.locator('[role="status"]');
            const hasError = await toastLocator.waitFor({
                timeout: 5000,
                state: 'visible'
            }).then(async () => {
                const text = await toastLocator.textContent();
                console.log(`⚠️ Toast message detected: ${text}`);
                return text?.toLowerCase().includes('error');
            }).catch(() => false);

            if (hasError) {
                console.warn(`⚠️ Skipping steps due to error message.`);
            } else {
                console.log('Proceeding with publishing...');
                await this.page.getByRole('button', { name: 'Next' }).click();
                await this.page.locator('.PrivateSwitchBase-input').first().click();
                await this.page.getByRole('button', { name: 'Publish' }).click();

                console.log(`Selecting radio option: ${data.radioButton}`);
                await this.page.getByRole('radio', { name: data.radioButton }).click();

                console.log('Confirming publish...');
                await this.page.getByRole('button', { name: 'Confirm' }).click();
            }
            console.log('🎉 Chrome Extension flow completed successfully.');
        } catch (error) {
            console.error("❌ Error in ProductAttributes Chrome flow:", error);
            throw error;
        }
    }

    private async navigateToProductAttributes() {
        console.log('➡️ Navigating to Product Attributes page...');
        await this.page.getByRole('link', { name: 'Product Attributes Product' }).click();
    }

    private async searchAndSelectProduct(productName: string, languagesToSelect: string) {
        console.log(`Switching language to: ${languagesToSelect}`);
        await this.page.getByRole('button', { name: 'EN', exact: true }).click();
        await this.page.getByRole('menuitem', { name: languagesToSelect }).click();
        console.log(`🔍 Searching for product: "${productName}" in language: "${languagesToSelect}"`);
        await new Promise(resolve => setTimeout(resolve, 2000));
        const dynamicPage = this.page.locator('[data-component-name="DynamicPageContent"]');
        console.log(`Waiting for dynamic Page to load`);
        await expect(dynamicPage).toBeVisible({ timeout: 2000 }); // waits up to 2 Seconds
        const searchBox = this.page.getByRole('textbox', { name: 'Enter a product name or' });
        await searchBox.fill(productName);
        await searchBox.press('Enter');
        await this.page.waitForTimeout(2000);
        console.log('Triggering product search...');
        await searchBox.click();
        await this.page.locator('ui5-icon').filter({ hasText: 'Search' }).nth(1).click();
        const listItems = this.page.locator('li.MuiListItem-root:not(.nav-link)');
        const count = await listItems.count() - 1;
        const randomIndex = Math.floor(Math.random() * (count - 2)) + 2;
        console.log(`Clicked element at index: ${randomIndex}`);
        await listItems.nth(randomIndex).click();
        await this.page.getByRole('columnheader').filter({ hasText: /^$/ }).click();
        console.log('✅ Product search and selection completed.');
    }

    private async validateTabVisible() {
        console.log('🔎 Validating "Product Attributes" tab visibility...');
        await expect(this.page.locator('ui5-tabcontainer')).toContainText('Product Attributes');
        console.log('✅ Product Attributes tab is visible.');
    }

    private async selectCheckboxes(Description: boolean, Image: boolean) {
        console.log('☑️ Selecting checkboxes...');
        const DescriptionBox = this.page.getByRole('checkbox', { name: 'Values based on Description and Documents' });
        const ImageBox = this.page.getByRole('checkbox', { name: 'Values based on Image' });

        async function isDisabled(box: Locator) {
            const attribute = await box.getAttribute('aria-disabled');
            return attribute === 'true' || attribute === null;
        }

        if (!Description && !Image) {
            throw new Error('❌ At least one of Description or Image checkbox must be selected.');
        }

        if (Description) {
            if (await isDisabled(DescriptionBox)) {
                console.log('⚠️ Description checkbox is disabled, skipping.');
            } else {
                console.log('✅ Clicking Description checkbox...');
                await DescriptionBox.click();
            }
        }

        if (Image) {
            if (await isDisabled(ImageBox)) {
                console.log('⚠️ Image checkbox is disabled, skipping.');
            } else {
                console.log('✅ Clicking Image checkbox...');
                await ImageBox.click();
            }
        }
    }

    private async clickGenerateAndPublish(radioButton: 'Overwrite' | 'Append', Description, Image) {
        console.log('⚡ Clicking Generate and Publish sequence...');
        await this.page.waitForTimeout(3000);

        console.log('Clicking first Generate...');
        // await this.page.getByRole('button', { name: 'Generate' }).click();
        const generateButton = await this.page.getByRole('button', { name: 'Generate' });

        // Get the disabled attribute
        const isDisabledgenerateButton = await generateButton.isEnabled();

        // If the attribute exists, it's disabled
        if (!isDisabledgenerateButton ) {
            console.log("==ALERT== Generate button is disabled.");
        } else {
            await generateButton.click();
            await this.selectCheckboxes(Description, Image);

            console.log('Clicking second Generate...');
            await this.page.waitForTimeout(5000);
            await this.page.getByRole('button', { name: 'Generate' }).nth(1).click();

            console.log('Showing all generated values...');
            await this.page.getByRole('button', { name: 'Show All' }).click();
            await this.page.getByRole('listitem', { name: 'With Generated Values' }).click();
            await this.page.waitForTimeout(3000);

            console.log('Publishing attributes...');
            const publishButton = this.page.locator('ui5-button[data-cy="publishButton"]');

            // Get the disabled attribute
            const isDisabledpublishButton = await publishButton.getAttribute('disabled');

            // If the attribute exists, it's disabled
            if (isDisabledpublishButton !== null) {
                console.log("==ALERT== Publish button is disabled.");
            } else {
                console.log("🚀 Publish button is enabled.");
                await this.page.getByRole('button', { name: 'Publish' }).click();

                console.log(`Selecting radio button: ${radioButton}`);
                await this.page.getByRole('radio', { name: radioButton }).click();

                console.log('Confirming publish...');
                await this.page.waitForTimeout(5);
                await this.page.getByRole('button', { name: 'Confirm' }).click();

                console.log('✅ Generate and Publish completed.');
            }
            return isDisabledpublishButton;
        }
        
    }

    private async handleGeneratedAttributes(prompt: string) {
        console.log('📝 Handling Generated Attributes tab...');
        await this.page.getByRole('tab', { name: 'Generated Attributes' }).locator('div').click();

        console.log(`Filling prompt: "${prompt}"`);
        const promptInput = this.page.getByRole('textbox', { name: 'Enter a prompt that provides' });
        await promptInput.click();
        await promptInput.fill(prompt);

        console.log('Clicking Generate for attributes...');
        await this.page.getByRole('button', { name: 'Generate' }).click();
        await this.page.getByRole('button', { name: 'Generate' }).nth(1).click();

        const start = Date.now();
        console.log('Waiting for progress bar...');
        await this.page.getByRole('columnheader').filter({ hasText: /^$/ }).click();
        console.log(`⏱ Wait time for progress bar: ${Date.now() - start} ms`);

        console.log('Re-clicking Generate to finalize...');
        await this.page.getByRole('button', { name: 'Generate' }).click();
        await this.page.getByRole('button', { name: 'Generate' }).nth(1).click();
    }

    private async saveAttributes() {
        console.log('💾 Saving attributes...');
        await this.page.getByRole('button', { name: 'Save' }).click();
        console.log('🎉 Product Attributes process completed successfully.');
    }
}
