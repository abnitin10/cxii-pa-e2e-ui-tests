import { Page, expect } from '@playwright/test';

export class IntelligentQA {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async IntelligentQA(data: { prompt: string }) {
    try {
      const callerFile =
        new Error().stack?.split('\n')[2]?.match(/\((.*):\d+:\d+\)/)?.[1] || 'Unknown';

      // Handle ChromeExtension context
      if (callerFile.includes('ChromeExtension')) {
        console.log('🧭 ChromeExtension detected. Clicking Intelligent Q&A tab...');
        await this.page.waitForTimeout(1000);
        await this.page.getByText('Intelligent Q&A').click();
      }

      console.log(`💬 Asking AI: "${data.prompt}"`);
      const textbox = this.page.getByRole('textbox', {
        name: 'Ask me anything about your business',
      });

      await textbox.click();
      await textbox.fill(data.prompt);
      await this.page.waitForTimeout(1000);
      await textbox.press('Enter');
      await this.page.waitForTimeout(2000);

      // Selector for the AI response
      const selector = '[data-cy="searchResultCard"] p';
      const searchResult = this.page.locator(selector);
      await this.page.waitForTimeout(1000);
      const found = await this.page.locator('[data-cy="searchResultCard"] p').count();

      // Fallback message to detect
      const fallbackMessage = `I'm sorry, but as an AI assistant I can only provide answers based on reliable information that the company has shared with me. My main focus is to help you with tasks and provide useful information.`;

      // Try to get the initial text
      let textContent;

      // If it's empty or the fallback message, wait until it changes
      if (found != 0) {
        await this.page.waitForFunction(
          ([sel, fallback]) => {
            const el = document.querySelector(sel);
            const txt = el?.textContent?.trim();
            return !!txt && txt !== fallback;
          },
          [selector, fallbackMessage],
          { timeout: 10000 }
        );

        // Re-fetch the updated content
        textContent = (await searchResult.textContent())?.trim() || '';
      }else{
        textContent=fallbackMessage;
      }

      // Validate the final result
      if (textContent === fallbackMessage) {
        console.warn('⚠️ Fallback message detected. Valid AI response not received.');
      } else if (!textContent) {
        throw new Error('❌ No valid response text found in search result card.');
      } else {
        console.log(`✅ AI Response: ${textContent}`);
        expect(textContent.length).toBeGreaterThan(0);
      }

    } catch (error) {
      console.error('❌ Error in IntelligentQA flow:', error);
      throw error;
    }
  }
}
