import { Page, expect } from '@playwright/test';

export class Meetings {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async Meetings(data: {
        upcoming?: {
          duration: string;
          updatedDuration?: string;
          attendeeFilter?: string;
        };
        past?: {
          duration: string;
          updatedDuration?: string;
          attendeeFilter?: string;
        };
      }) {
        try {
          console.log('🔍 Navigating to Meetings section...');
          await this.page.getByRole('link', { name: 'Meetings Meetings' }).click({ timeout: 15000 });
      
          // ──────────────── MEETING UPCOMING SECTION ────────────────
          if (data.upcoming) {
            const { duration, attendeeFilter } = data.upcoming;
            console.log(`📅 Upcoming filter selected: ${duration}`);
      
            await this.page.getByText('Next 1 Day', { exact: true }).click({ timeout: 15000 });
            await this.page.getByRole('option', { name: duration }).click({ timeout: 15000 });
            console.log(`✅ Set upcoming duration to: ${duration}`);
      
            await expect(this.page.getByLabel('Upcoming')).toContainText(duration, { timeout: 15000 });
      
            if (attendeeFilter) {
              console.log(`👥 Applying attendee filter: ${attendeeFilter}`);
              await this.page.getByText('All', { exact: true }).click({ timeout: 15000 });
              await this.page.getByRole('option', { name: attendeeFilter }).click({ timeout: 15000 });
              console.log(`✅ Attendee filter applied: ${attendeeFilter}`);
            }
          }
      
          // ──────────────── MEETING PAST SECTION ────────────────
          if (data.past) {
            const { duration, attendeeFilter } = data.past;
            console.log(`📅 Switching to Past tab...`);
      
            await this.page.locator('[data-cy="pastMeetingsTab"]').click({ timeout: 15000 });
            await this.page.getByText('Last 7 Days', { exact: true }).click({ timeout: 15000 });
            await this.page.getByRole('option', { name: duration }).click({ timeout: 15000 });
            console.log(`✅ Set past duration to: ${duration}`);
      
            if (attendeeFilter) {
              console.log(`👥 Applying attendee filter for past: ${attendeeFilter}`);
              await this.page.getByText('All', { exact: true }).click({ timeout: 15000 });
              await this.page.getByRole('option', { name: attendeeFilter }).click({ timeout: 15000 });
              console.log(`✅ Attendee filter applied: ${attendeeFilter}`);
            }

            await expect(
              this.page.getByRole('tabpanel', { name: 'Past' })
            ).toContainText(duration, { timeout: 15000 });            
            
            console.log(`✅ Verified Past section displays: ${duration}`);
          }
      
          console.log('✅ Meeting filter flow completed successfully.');
      
        } catch (error) {
          console.error("❌ Error occurred in meetings:", error);
          throw error;
        }
      }      
}