import { Page } from '@playwright/test';

export class AIToolsBuilder {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async AIToolsBuilder(data: {
        Search: string,
        description: string,
        additionalDescription: string,
        Licenses: string[],
        SourceApplication: string

    }) {
        try {
            console.log("Navigating to AI Tool Builder...");
            await this.page.getByRole('link', { name: 'AI Tool Builder AI Tool' }).click();
            await this.page.getByRole('textbox', { name: 'Search' }).click();
            await this.page.getByRole('textbox', { name: 'Search' }).fill(data.Search);
            await this.page.getByRole('img', { name: 'Search', exact: true }).click();
            const caseCount = await this.page.getByText(data.Search).count();

            if (caseCount > 0) {
                console.log("'ListOut Cases' found. Proceeding with deletion...");
                await this.page.getByText(data.Search).click();
                await this.page.locator('ui5-button[tooltip="Actions"]').click();
                await this.page.getByRole('menuitem', { name: 'Delete' }).click();
                console.log("Confirming deletion...");
                await this.page.waitForTimeout(1000);
                await this.page.keyboard.press('Enter');
                console.log("Successfully deleted 'ListOut Cases'.");
            }

            console.log("Clicking 'Create AI Tool' button...");
            await this.page.getByRole('button', { name: 'Create AI Tool' }).click();

            const nameField = this.page.locator('div').filter({ hasText: /^Name$/ }).getByRole('textbox');
            await nameField.click();
            await nameField.fill(data.Search);

            const descriptionField = this.page.locator('div').filter({ hasText: /^Description$/ }).getByRole('textbox');
            await descriptionField.click();
            await descriptionField.fill(data.description);

            console.log("Selecting license");
            await this.page.locator('ui5-multi-combobox ui5-icon').click();

            for (const license of data.Licenses) {
                console.log(`license: ${license}`)
                await this.page.getByRole('option', { name: license }).click();
            }


            console.log("Selecting SourceApplication");
            await this.page.locator('ui5-select').filter({ hasText: 'SAP Sales and Service Cloud' }).click();
            const options = await this.page.locator('ui5-option').all();
            for (const option of options) {
                const value = await option.getAttribute(data.SourceApplication);
                if (value) {
                    await option.click();
                    break;
                }
            }

            // Additional Description field
            const additionalDescriptionField = this.page.getByPlaceholder('Description').nth(3);
            await additionalDescriptionField.click();
            await additionalDescriptionField.fill(data.additionalDescription);

            console.log("Saving AI Tool...");
            await this.page.getByRole('button', { name: 'Save' }).click();

            console.log("Deleting AI Tool...");
            await this.page.getByRole('button', { name: 'Delete' }).click();
            await this.page.waitForSelector('ui5-button:has-text("Delete")');

            console.log("Confirming deletion...");
            await this.page.locator('ui5-button').filter({ hasText: 'DeleteEmphasized' }).click({ timeout: 5000 });
            console.log("AI Tool successfully created and deleted.");
        } catch (error) {
            console.error("Error occurred in aiToolsBuilder:", error);
            throw error;
        }
    }
}