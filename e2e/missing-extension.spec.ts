import { test, expect } from '@playwright/test';

import { loginWithLocal, deleteSnippet, navigateToNewSnippet } from './test-utils';

test.describe('Snippet CRUD with language extension dialog', () => {
  test('creates snippet with filename needing extension and applies it', async ({ page }) => {
    await loginWithLocal(page);

    await navigateToNewSnippet(page);

    await page.fill('textarea[id="description"]', 'E2E extension apply #e2e-tag');
    await page.fill('input[id="file"]', 'server');
    await page.click('.monaco-editor');
    await page.keyboard.insertText('console.log("hi");');

    // Select JavaScript language
    await page.getByLabel('Dropdown select').click();
    await page.fill('input[placeholder="Find language"]', 'JavaScript');
    await page.click('div:has-text("JavaScript")');

    await page.click('button:has-text("Create")');

    await expect(page.getByText('Add missing file extension?')).toBeVisible({ timeout: 5000 });
    await expect(page.getByText('server → server.js')).toBeVisible();
    await page.click('button:has-text("Add extension")');

    await page.waitForTimeout(3000);

    await page.reload();
    await expect(page.getByRole('heading', { name: 'E2E extension apply' })).toBeVisible({
      timeout: 10000,
    });
    await expect(page.getByText('server.js')).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('console.log("hi");')).toBeVisible({ timeout: 10000 });

    await deleteSnippet(page, 'E2E extension apply', 'server.js');
  });

  test('creates snippet and skips extension', async ({ page }) => {
    await loginWithLocal(page);

    await navigateToNewSnippet(page);

    await page.fill('textarea[id="description"]', 'E2E extension skip #e2e-tag');
    await page.fill('input[id="file"]', 'notes');
    await page.click('.monaco-editor');
    await page.keyboard.insertText('print("hi")');

    await page.getByLabel('Dropdown select').click();
    await page.fill('input[placeholder="Find language"]', 'Python');
    await page.click('div:has-text("Python")');

    await page.click('button:has-text("Create")');

    await expect(page.getByText('Add missing file extension?')).toBeVisible({ timeout: 5000 });
    await page.click('button:has-text("Save without extension")');

    await page.waitForTimeout(3000);

    await page.reload();
    await expect(page.getByRole('heading', { name: 'E2E extension skip' })).toBeVisible({
      timeout: 10000,
    });
    await expect(page.getByText('notes')).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('print("hi")')).toBeVisible({ timeout: 10000 });

    await deleteSnippet(page, 'E2E extension skip', 'notes');
  });

  test('Text language is not renamed', async ({ page }) => {
    await loginWithLocal(page);

    await navigateToNewSnippet(page);

    await page.fill('textarea[id="description"]', 'E2E text no extension #e2e-tag');
    await page.fill('input[id="file"]', 'c');
    await page.click('.monaco-editor');
    await page.keyboard.insertText('hello world');

    // Keep as Text (default)
    await page.click('button:has-text("Create")');

    await expect(page.getByText('Add missing file extension?')).not.toBeVisible();
    await page.waitForTimeout(2000);

    await page.reload();
    await expect(page.getByRole('heading', { name: 'E2E text no extension' })).toBeVisible({
      timeout: 10000,
    });
    await page.waitForTimeout(1000);
    await expect(
      page
        .getByRole('button', { name: 'More' })
        .locator('..')
        .locator('..')
        .getByText('c', { exact: false })
        .first()
    ).toBeVisible({ timeout: 10000 });

    await deleteSnippet(page, 'E2E text no extension', 'c');
  });

  test('dockerfile with Dockerfile language is not renamed', async ({ page }) => {
    await loginWithLocal(page);

    await navigateToNewSnippet(page);

    await page.fill('textarea[id="description"]', 'E2E dockerfile #e2e-tag');
    await page.fill('input[id="file"]', 'dockerfile');
    await page.click('.monaco-editor');
    await page.keyboard.insertText('FROM node:20');

    await page.getByLabel('Dropdown select').click();
    await page.fill('input[placeholder="Find language"]', 'Dockerfile');
    await page.click('div:has-text("Dockerfile")');

    await page.click('button:has-text("Create")');

    await expect(page.getByText('Add missing file extension?')).not.toBeVisible();
    await page.waitForTimeout(2000);

    await page.reload();
    await expect(page.getByRole('heading', { name: 'E2E dockerfile' })).toBeVisible({
      timeout: 10000,
    });
    await expect(
      page
        .getByRole('button', { name: 'More' })
        .locator('..')
        .locator('..')
        .getByText('dockerfile', { exact: false })
        .first()
    ).toBeVisible({ timeout: 10000 });

    await deleteSnippet(page, 'E2E dockerfile', 'dockerfile');
  });
});
