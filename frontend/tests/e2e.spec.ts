import { test, expect, type Page } from '@playwright/test';

// Helper to accept disclaimer
async function acceptDisclaimer(page: Page) {
  await page.waitForSelector('.modal-overlay');
  await page.click('input[type="checkbox"]');
  await page.click('button.accept-btn');
}

test('happy path: upload, select symptom, analyze, see high risk', async ({ page }) => {
  await page.goto('/');

  // Accept disclaimer
  await acceptDisclaimer(page);

  // Upload a sample image directly to the hidden input
  await page.setInputFiles('input[type="file"]', 'public/e2e-sample.png');

  // Select symptom "chảy máu"
  await page.getByText('chảy máu').click();

  // Click analyze
  await page.click('button.analyze-btn');

  // Expect result card with CAO
  await expect(page.getByText('CAO')).toBeVisible();
});
