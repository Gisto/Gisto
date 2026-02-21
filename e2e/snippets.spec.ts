import { test, expect } from '@playwright/test';

import { loginWithLocal, createSnippet, deleteSnippet, navigateToDashboard } from './test-utils';

test.describe('Snippet CRUD', () => {
  test('can create, view and delete a private snippet', async ({ page }) => {
    await loginWithLocal(page);

    await createSnippet(page, {
      description: 'E2E private test #e2e-tag',
      filename: 'hello.js',
      content: 'console.log("Hello World");',
      isPrivate: true,
    });

    await page.reload();

    await expect(page.getByRole('heading', { name: 'E2E private test' })).toBeVisible({
      timeout: 10000,
    });

    await expect(page.getByText('console.log("Hello World");')).toBeVisible({ timeout: 10000 });

    await deleteSnippet(page, 'E2E private test');

    await navigateToDashboard(page);

    await expect(page.getByText('E2E private test')).not.toBeVisible();
  });
});
