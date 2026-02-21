import { test, expect } from '@playwright/test';
import { loginWithLocal, navigateToSettings, navigateToAbout, logout } from './test-utils';

test.describe('Login', () => {
  test('shows login page with provider options', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByText('{ Gisto }')).toBeVisible();
    await expect(page.getByText('Snippets made awesome')).toBeVisible();

    await expect(page.getByText('Please sign-in using token')).toBeVisible();

    await expect(page.getByRole('radio', { name: 'GitHub' })).toBeVisible();
    await expect(page.getByRole('radio', { name: 'GitLab' })).toBeVisible();
    await expect(page.getByRole('radio', { name: 'Local' })).toBeVisible();
  });

  test('can switch to local provider and continue', async ({ page }) => {
    await loginWithLocal(page);

    await expect(page.getByText('Dashboard')).toBeVisible();
    await expect(page.getByText('No snippets yet')).toBeVisible();
  });

  test('shows empty state when logged in with local provider', async ({ page }) => {
    await loginWithLocal(page);

    await expect(page.getByText('No snippets yet')).toBeVisible();
    await expect(page.getByText('Create your first snippet to get started')).toBeVisible();
  });
});

test.describe('Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await loginWithLocal(page);
  });

  test('can navigate to about page', async ({ page }) => {
    await navigateToAbout(page);

    await expect(page.getByText('Gisto is a code snippet manager')).toBeVisible();
  });

  test('can navigate to settings page', async ({ page }) => {
    await navigateToSettings(page);

    await expect(page.getByText('Gisto settings')).toBeVisible();
  });

  test('can logout', async ({ page }) => {
    await logout(page);
  });
});
