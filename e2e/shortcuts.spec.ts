import { test, expect } from '@playwright/test';
import { loginWithLocal, navigateToDashboard } from './test-utils';

test.describe('Keyboard Shortcuts', () => {
  test.beforeEach(async ({ page }) => {
    await loginWithLocal(page);
  });

  test('Ctrl+K opens command palette', async ({ page }) => {
    await page.keyboard.press('Control+k');
    await expect(page.getByText('Go to Dashboard')).toBeVisible();
  });

  test('? shows shortcuts help', async ({ page }) => {
    await page.keyboard.press('?');
    await expect(page.getByText('Keyboard Shortcuts')).toBeVisible();
  });
});

test.describe('Command Palette', () => {
  test.beforeEach(async ({ page }) => {
    await loginWithLocal(page);
  });

  test('D navigates to dashboard', async ({ page }) => {
    await page.keyboard.press('Control+k');
    await expect(page.getByText('Go to Dashboard')).toBeVisible();

    await page.keyboard.press('d');
    await expect(page.getByText('Dashboard').last()).toBeVisible();
  });

  test('N navigates to new snippet', async ({ page }) => {
    await page.keyboard.press('Control+k');
    await expect(page.getByText('Create New Snippet')).toBeVisible();

    await page.keyboard.press('n');
    await expect(page.getByText('Create New Snippet')).toBeVisible();
  });

  test('S navigates to settings', async ({ page }) => {
    await page.keyboard.press('Control+k');
    await expect(page.getByText('Open Settings')).toBeVisible();

    await page.keyboard.press('s');
    await expect(page.getByText('Gisto settings')).toBeVisible();
  });

  test('R reloads snippets', async ({ page }) => {
    await page.keyboard.press('Control+k');
    await expect(page.getByText('Reload All Snippets')).toBeVisible();

    await page.keyboard.press('r');
  });

  test('clicking command executes it', async ({ page }) => {
    await page.keyboard.press('Control+k');
    await expect(page.getByText('Go to Dashboard')).toBeVisible();

    await page.getByText('Go to Dashboard').click();
    await expect(page.getByText('Dashboard').last()).toBeVisible();
  });
});
