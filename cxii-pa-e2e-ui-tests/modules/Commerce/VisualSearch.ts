import { Page, expect } from '@playwright/test';

export class VisualSearch {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async navigateToVisualSearch() {
        console.log('Navigating to Visual Search');
        await this.page.getByRole('link', { name: 'Visual Search Visual Search' }).click();
    }

    async uploadImage(imagePath: string) {
        console.log(`Uploading image from path: ${imagePath}`);
        const fileUploader = this.page
            .locator('ui5-file-uploader')
            .filter({ hasText: 'Upload Image' })
            .locator('input[type="file"]');

        await fileUploader.waitFor({ state: 'visible' });
        await fileUploader.setInputFiles(imagePath);
    }

    async clickSearch() {
        console.log('Clicking on Search button');
        const searchButton = this.page.getByRole('button', { name: 'Search' });

        await searchButton.waitFor({ state: 'visible' });
        await searchButton.click();
    }

    async VisualSearch(data: {
        ImageName: string;
        flowType: string;
        ObjectDetection: boolean;
        VisualInformationExtraction: boolean;
        Instructions: string;
    }) {
        try {
            if (data.flowType === 'New') {
                console.log('Flow type is New');
                await this.navigateToVisualSearch();
                await this.uploadImage(`./resources/${data.ImageName}`);
                await this.clickSearch();
            } else if (data.flowType === 'Existing') {
                console.log('Flow type is Recent');
                await this.navigateToVisualSearch();
                const recentImagesTitle = this.page.locator('ui5-title', { hasText: 'Recent Images' });
                try {
                    await recentImagesTitle.waitFor({ state: 'visible', timeout: 10000 });
                    console.log('Recent uploaded images are available');
                } catch {
                    console.log('Recent uploaded images are not available');
                }
                console.log('Clicking on first recent image');
                await this.page.locator('.DynamicPage_contentContainer_1pt9i_29 > div > div > div > img').first().click();
            }

            console.log('Toggling Object Detection');
            await this.page
                .locator('ui5-panel')
                .filter({ hasText: /^Object Detection$/ })
                .getByRole('switch')
                .click();

            console.log('Waiting for Detected Objects text');
            await this.page.locator('text=Detected Objects:').waitFor({ timeout: 15000 });

            console.log('Toggling Visual Information Extraction');
            await this.page
                .locator('ui5-panel')
                .filter({ hasText: /^Visual Information Extraction$/ })
                .getByRole('switch')
                .click();

            console.log('Entering instructions');
            await this.page.getByRole('textbox', { name: 'Enter Instructions' }).click();
            await this.page.getByRole('textbox', { name: 'Enter Instructions' }).fill(data.Instructions);

            console.log('Clicking generate button');
            await this.page.getByRole('button').filter({ hasText: /^$/ }).nth(4).click();

            console.log('Clicking Search again');
            await this.page.getByRole('button', { name: 'Search' }).click();

            await this.page.waitForTimeout(5000);
            const resultsText = await this.page
                .locator('ui5-title', { hasText: /^Results \(\d+\)$/ })
                .textContent();

            if (resultsText) {
                const hasZeroResults = /Results\s+\(0\)/.test(resultsText);
                if (hasZeroResults) {
                    console.log('UI shows zero results: Results (0)');
                } else {
                    console.log('UI shows non-zero results. Proceeding with validation...');
                    await expect(this.page.getByRole('main')).toContainText(/Results \((?!0\))/);
                }
            }
            console.log(`Results text: ${resultsText}`);
        } catch (error) {
            console.log('Error in VisualSearch flow');
            console.error(error);
            throw error;
        }
    }
}
