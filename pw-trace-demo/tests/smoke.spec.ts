import { test, expect } from '@playwright/test';

test('trace smoke', async ({ page }) => {
  await page.goto('https://example.com');
  await expect(page).toHaveTitle(/Example/);

  // Additional actions to make the trace more useful
  const heading = page.locator('h1');
  await expect(heading).toBeVisible();
  
  // Get page content to demonstrate trace captures interactions
  const content = await page.textContent('body');
  expect(content).toContain('Example');
});

