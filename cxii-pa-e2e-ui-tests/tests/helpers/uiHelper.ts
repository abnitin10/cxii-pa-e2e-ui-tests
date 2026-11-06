import { expect, Locator, Page } from '@playwright/test';

export async function selectUI5DropdownValue(page: Page, dropdown: Locator, value: string) {
    await dropdown.click();
    const staticItems = await page.locator('ui5-static-area > ui5-static-area-item').elementHandles();

    let valueFound = false;

    dropdownLoop: for (const item of staticItems) {
        const listItems = await item.evaluate((results) => {
            const shadow = (results as HTMLElement).shadowRoot;
            if (!shadow) return null;

            const list = shadow.querySelector('ui5-responsive-popover > ui5-list');
            if (!list) return null;

            const items = list.querySelectorAll('ui5-li');
            return Array.from(items).map((li) => li.textContent?.trim() || '');
        });

        if (listItems && listItems.length > 0) {
            for (let idx = 0; idx < listItems.length; idx++) {
                const itemText = listItems[idx];
                if (itemText.match(new RegExp(value, 'i'))) {
                    for (let i = 0; i < idx; i++) {
                        await dropdown.press('ArrowDown');
                    }
                    await dropdown.press('Enter');
                    valueFound = true;
                    break dropdownLoop;
                }
            }
        }
    }

    if (!valueFound) {
        throw new Error(`Value "${value}" not found in UI5 dropdown.`);
    }
}

export async function firstElement(page: Page) {
    const firstElement = page.locator('[role="grid"] [aria-colindex="2"]').nth(1);
    await firstElement.waitFor({ state: 'visible', timeout: 15000 });
    await firstElement.click();
    console.log('Selected the first product from search results.');
}

export async function verifyResult(page: Page) {
    await expect.poll(async () => {
        const paragraphs = await page.getByRole('paragraph').all();
        const texts = await Promise.all(paragraphs.map(async (p) => await p.textContent()));
        if (texts.length > 0)
            console.log('📄 Paragraphs found:', texts); // ✅ Log the text of all paragraphs
        return paragraphs.length;
    }, {
        timeout: 60000, // milliseconds
        message: 'Expected at least one paragraph element to appear',
    }).toBeGreaterThan(0);
}

// Function to delete a row by name
export async function deleteAgentByName(page: Page, agentName: string): Promise<boolean> {
    await page.waitForTimeout(5000);
    const tableSelector = '[data-component-name="AnalyticalTableBodyScrollableContainer"]';
    let tableLocator = page.locator(tableSelector);
    const tableCount = await tableLocator.count();
    if (tableCount > 0) {
        console.log('✅ Table found on the page.');

        // Locate all rows
        const rows = page.locator(`${tableSelector} >>> div[role="row"]`);
        const count = await rows.count();
        console.log(`Total rows found: ${count}`);

        for (let i = 0; i < count; i++) {
            const row = rows.nth(i);
            const nameCell = row.locator('div[data-column-id-cell="name"] span');
            const text = (await nameCell.textContent())?.trim();

            console.log(`Row ${i + 1}: ${text}`);

            if (text === agentName) {
                console.log(`✅ Found matching row: ${text}`);

                // Click overflow (Actions) button in the same row
                const actionsButton = row.locator('ui5-button[icon="overflow"]');
                await actionsButton.click();

                // Click Delete from the dropdown
                await page.getByRole('menuitem', { name: 'Delete' }).click();
                await page.waitForTimeout(1000);

                // Confirm delete (if popup appears)
                const confirmDeleteBtn = page.getByRole('button', { name: 'Delete' });
                if (await confirmDeleteBtn.isVisible()) {
                    await confirmDeleteBtn.click();
                }

                console.log(`🗑️ Deleted agent: ${agentName}`);
                await page.waitForTimeout(1000);
                tableLocator = await page.locator(tableSelector);
                console.log(`Table row count after deletion: ${await tableLocator.count()}`)
                if (await tableLocator.count() > 0)
                    return true; // ✅ Successfully deleted
                else
                    return false;
            }
        }

        console.log(`⚠️ No row found with name: ${agentName}`);
        return true; // ❌ Not found in table
    } else {
        console.log('⚠️ Table not found — skipping further steps.');
        return false; // ❌ Table missing
    }
}  