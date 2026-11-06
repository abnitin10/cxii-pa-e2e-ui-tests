import { Page, expect } from '@playwright/test';

export class Scheduling {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async Scheduling(data: {
        title: string;
        duration: string;
        timeZone: string;
        platform: string;
        description: string;
        ReserveTimes: boolean;
        time: string;
    }) {
        try {
            console.log(`Navigating to Scheduling...`);
            await this.page.locator('li').filter({ hasText: 'Scheduling' }).click();
            await new Promise(resolve => setTimeout(resolve, 2000));            
            const meetings = this.page.locator('li:has([data-cy="schedulingSubject"]:text("Test - Meeting"))');
            const count = await meetings.count();
            console.log(`count: ${count}`);
            for (let i = 0; i < count; i++) {
                await meetings.nth(0).click();
                // Optional: Wait for some action or close popup before clicking next
                await this.page.waitForTimeout(500);
                console.log(`Deleting Request`);
                await this.page.getByRole('button', { name: 'Delete Request' }).click();
                const deleteConfirm = this.page.getByRole('button', { name: 'Delete', exact: true });
                await expect(deleteConfirm).toBeEnabled({ timeout: 60000 });
                await deleteConfirm.click();
            }

            console.log(`Creating Meeting Request...`);
            await this.page.getByRole('button', { name: 'Create Meeting Request' }).click();

            console.log(`Filling title: ${data.title}`);
            const titleInput = this.page.locator('input[type="text"]');
            await expect(titleInput).toBeVisible({ timeout: 60000 });
            await titleInput.fill(data.title);
            await expect(titleInput).toHaveValue(data.title, { timeout: 60000 });

            await this.page.getByRole('button', { name: 'day' }).click();
            await this.page.getByRole('button', { name: 'Next day' }).click();

            for (const day of ['Saturday', 'Sunday']) {
                const header = this.page.getByRole('columnheader', { name: day });
                if (await header.count() > 0) {
                    await this.page.getByRole('button', { name: 'Next day' }).click();
                }
            }

            console.log(`Selecting Duration: ${data.duration}`);
            await this.page.locator('div').filter({ hasText: /^Duration in Minutes$/ }).locator('ui5-icon').click();
            const durationOption = this.page.getByRole('option', { name: data.duration });
            await expect(durationOption).toBeVisible({ timeout: 60000 });
            await durationOption.click();

            console.log(`Selecting Time Zone: ${data.timeZone}`);
            await this.page.locator('div').filter({ hasText: /^Time Zone$/ }).locator('ui5-icon').click();
            const timezoneOption = this.page.getByRole('option', { name: data.timeZone });
            await expect(timezoneOption).toBeVisible({ timeout: 60000 });
            await timezoneOption.click();

            console.log(`Selecting Platform: ${data.platform}`);
            await this.page.locator('ui5-select ui5-icon').click();
            const platformOption = this.page.locator('ui5-li').filter({ hasText: data.platform });
            await expect(platformOption).toBeVisible({ timeout: 60000 });
            await platformOption.click();

            console.log(`Adding Description`);
            const descriptionArea = this.page.locator('textarea');
            await expect(descriptionArea).toBeVisible({ timeout: 60000 });
            await descriptionArea.fill(data.description);
            await expect(descriptionArea).toHaveValue(data.description, { timeout: 60000 });

            if (data.ReserveTimes) {
                console.log(`Toggling switches`);
                const switches = this.page.getByRole('switch');
                await expect(switches.first()).toBeVisible({ timeout: 60000 });
                await switches.first().click();
            }

            console.log(`Selecting Time : ${data.time}`);
            await this.page.locator('tr').filter({ hasText: new RegExp(`^${data.time}$`, 'i') }).locator('td').nth(1).click();

            console.log(`Creating Request`);
            const createButton = this.page.getByRole('button', { name: 'Create', exact: true });
            await expect(createButton).toBeEnabled({ timeout: 60000 });
            await createButton.click();

            console.log(`Deleting Request`);
            await this.page.getByRole('button', { name: 'Delete Request' }).click();
            const deleteConfirm = this.page.getByRole('button', { name: 'Delete', exact: true });
            await expect(deleteConfirm).toBeEnabled({ timeout: 60000 });
            await deleteConfirm.click();
        } catch (error) {
            console.error("❌ Error occurred in scheduling:", error);
            throw error;
        }
    }
}
