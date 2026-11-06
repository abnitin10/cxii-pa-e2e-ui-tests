import { Page, expect } from '@playwright/test';
import { firstElement, selectUI5DropdownValue, verifyResult } from '@helpers/uiHelper';

export class personalizedProspectingEmail {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async personalizedProspectingEmail(data: {
        firstName: string;
        renderLength: string;
        renderTone: string;
        productTextbox: string;
        talkingPointsTextbox: string;
        callAction: string;
    }) {
        try {
            await this.page.locator('li').filter({ hasText: 'Write a Personalized' }).locator('div').first().click();
            const nameTextbox = this.page.getByRole('textbox', { name: 'Enter a first name, last name, email address' });
            const productTextbox = this.page.getByRole('textbox').nth(2);
            const talkingPointsTextbox = this.page.getByRole('textbox', { name: 'Enter details about the product' });
            const callAction = await this.page.getByRole('textbox', { name: 'for example, are you available for a quick call' });
            await nameTextbox.waitFor({ state: 'visible', timeout: 15000 });
            await nameTextbox.click();
            await nameTextbox.fill(data.firstName);
            await nameTextbox.press('Enter');

            firstElement(this.page);

            await productTextbox.waitFor({ state: 'visible', timeout: 15000 });
            if (data.productTextbox.length > 0) {
                await productTextbox.click();
                await productTextbox.fill(data.productTextbox);
                await productTextbox.press('Tab');
            }

            if (data.talkingPointsTextbox.length > 0) {
                await talkingPointsTextbox.fill(data.talkingPointsTextbox);
                await talkingPointsTextbox.press('Tab');
            }

            if (data.callAction.length > 0) {
                await callAction.fill(data.callAction);
                await callAction.press('Tab');
            }

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

            await this.page.getByRole('button', { name: 'Generate' }).click();
            this.page.getByRole('button', { name: 'Generate' });
            await this.page.waitForTimeout(5000);
           await verifyResult(this.page);
        } catch (error) {
            console.error("Error occurred in personalizedProspectiveEmail:", error);
            throw error;
        }
    }
}