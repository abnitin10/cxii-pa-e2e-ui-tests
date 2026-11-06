import { test } from '../helpers/fixtures';
import { E2E_BASE_URL, EXECUTION_MODE } from '@env';
import { Page, TestInfo } from '@playwright/test';
import { toolRegistry } from './toolRegistry';

const testData = require('../ui/testDataChrome.json') as Record<string, any[]>;

// ✅ Utility function to pick random test data
function getRandomSubset<T>(arr: T[], count: number): T[] {
  return arr.sort(() => 0.5 - Math.random()).slice(0, count);
}

// ✅ Navigate to AI Tools page
async function navigateToAITools(page: Page) {
  await page.getByLabel('AI Tools').getByText('AI Tools').click();
}

// ✅ Execute a test with given data
async function runTest(
  page: Page,
  testName: string,
  action: (data: any) => Promise<void>,
  data: any,
  testInfo: TestInfo
) {
  console.log(`🚀 Running ${testName} with data:`, data);
  console.log('Test title:', testInfo.title);

  await navigateToAITools(page);
  await action(data);
}

// ✅ Main test suite
test.describe('Extension Tests', () => {
  test.beforeEach(async ({ page, extensionId }) => {
    console.log(`🔹 Navigating to login page: ${E2E_BASE_URL}/login`);
    await page.goto(`${E2E_BASE_URL}/login`);
    await page.waitForURL(`${E2E_BASE_URL}/apps/home`);
    console.log('✅ Successfully logged in.');

    await page.goto(`chrome-extension://${extensionId}/index.html`);
    await page.waitForTimeout(2000);
  });

  Object.entries(testData).forEach(([testName, testCases]) => {
    const tool = toolRegistry[testName];
    if (!tool) {
      console.warn(`⚠️ No registered tool for ${testName}, skipping.`);
      return;
    }

    // ✅ Pick subset based on execution mode
    let selectedTestCases: any[];
    if (EXECUTION_MODE === 'daily') {
      selectedTestCases = getRandomSubset(testCases, 1);
    } else if (EXECUTION_MODE === 'smoke') {
      selectedTestCases = getRandomSubset(testCases, 2);
    } else {
      selectedTestCases = testCases;
    }

    // ✅ Generate tests dynamically
    selectedTestCases.forEach((data, index) => {
      test(`${testName} - Test Case #${index + 1}`, async ({ page }, testInfo) => {
        console.log(`▶️ Running ${testName} - Test Case #${index + 1}`);

        // Attach JSON test data to report
        await testInfo.attach('Test Data JSON', {
          body: JSON.stringify(data, null, 2),
          contentType: 'application/json',
        });

        // Run mapped action
        await runTest(
          page,
          testName,
          async (data) => {
            const instance = new tool.class(page);
            await instance[tool.method](data);
          },
          data,
          testInfo
        );
      });
    });
  });
});
