import test from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';
import { E2E_BASE_URL,EXECUTION_MODE } from '@env';
import { moduleMapping } from './moduleMapping';
import { runTest } from '@helpers/runTest';

// Define the correct path for testData.json
const testDataPath = path.resolve(__dirname, '../ui/testData.json');

// Load test data from JSON file
const testData = JSON.parse(fs.readFileSync(testDataPath, 'utf-8'));

function getRandomSubset<T>(arr: T[], count: number): T[] { return arr.sort(() => 0.5 - Math.random()).slice(0, count); }

test.describe('AIToolKit', () => {
  test.describe.configure({ mode: 'parallel' });

  test.beforeEach(async ({ page }, testInfo) => {
    console.log(`🔹 Setting up test context for: ${testInfo.title}`);
    console.log(`Navigating to login page: ${E2E_BASE_URL}/login`);

    await page.goto(`${E2E_BASE_URL}/login`);
    await page.waitForURL(`${E2E_BASE_URL}/apps/home`);

    console.log('✅ Successfully logged in and navigated to home page.');

    testInfo.annotations.push({
      type: 'info',
      description: `Login page navigation completed for test: ${testInfo.title}`,
    });
  });

  test.afterEach(async ({ page }, testInfo) => {
    console.log(`🛑 Closing test context for: ${testInfo.title}`);

    if (testInfo.status !== testInfo.expectedStatus) {
      try {
        const screenshotPath = path.join(testInfo.outputDir, 'failure.png');
        await page.screenshot({ path: screenshotPath, fullPage: true });
        await testInfo.attach('Screenshot on Failure', {
          path: screenshotPath,
          contentType: 'image/png',
        });
      } catch (e) {
        console.error('❌ Failed to take screenshot or attach:', e);
      }
    }

    console.log(`✅ Test completed: ${testInfo.title}`);
  });

  // Dynamically generate tests based on EXECUTION_MODE
  Object.entries(testData).forEach(([moduleName, testCases]) => {
    if (moduleMapping[moduleName]) {
      let selectedTestCases: Array<any>;

      if (EXECUTION_MODE === 'daily') { selectedTestCases = getRandomSubset(testCases as Array<any>, 1); } else if (EXECUTION_MODE === 'smoke') { selectedTestCases = getRandomSubset(testCases as Array<any>, 2); } else { selectedTestCases = testCases as Array<any>; }

      selectedTestCases.forEach((data, index) => {
        test(`${moduleName} - Dataset ${index + 1}`, async ({ page }, testInfo) => {
          console.log(`🚀 Starting test: ${testInfo.title}`);

          // Attach JSON test data for traceability
          await testInfo.attach('Test Data JSON', {
            body: JSON.stringify(data, null, 2),
            contentType: 'application/json',
          });

          try {
            await runTest(
              moduleMapping[moduleName],
              moduleName,
              `${moduleName} - Dataset ${index + 1}`,
              data,
              page,
              testInfo
            );

            testInfo.annotations.push({
              type: 'step',
              description: `Completed runTest for ${testInfo.title}`,
            });
          } catch (error: any) {
            await testInfo.attach('Error', {
              body: error.message || String(error),
              contentType: 'text/plain',
            });
            throw error;
          }
        });
      });
    } else {
      console.warn(`⚠️ Module ${moduleName} not found in moduleMapping!`);
    }
  });
});