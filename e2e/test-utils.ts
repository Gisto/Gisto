import { expect, Page } from '@playwright/test';

export async function loginWithLocal(page: Page) {
  await page.goto('/');
  await page.waitForSelector('text=Local');
  await page.click('text=Local');
  await page.click('button:has-text("Continue")');
  await page.waitForSelector('text=Dashboard');
}

export async function navigateToNewSnippet(page: Page) {
  await page.click('text=New snippet');
  await page.waitForSelector('text=Create new snippet');
}

export async function navigateToSettings(page: Page) {
  await page.goto('/settings');
  await page.waitForSelector('text=Gisto settings');
}

export async function navigateToAbout(page: Page) {
  await page.click('text=About');
  await page.waitForSelector('text=Gisto is a code snippet manager');
}

export async function navigateToDashboard(page: Page) {
  await page.goto('/');
  await page.waitForSelector('text=Dashboard');
}

export async function createSnippet(
  page: Page,
  options: {
    description: string;
    filename: string;
    content: string;
    isPrivate?: boolean;
  }
) {
  await navigateToNewSnippet(page);

  await page.fill('textarea[id="description"]', options.description);
  await page.fill('input[id="file"]', options.filename);

  await page.click('.monaco-editor');
  await page.keyboard.type(options.content);

  if (options.isPrivate) {
    await page.click('button:has-text("Private")');
  }

  await page.click('button:has-text("Create")');

  await page.waitForTimeout(3000);
}

export async function deleteSnippet(page: Page, snippetTitle: string, fileName = 'hello.js') {
  await page.click(`text=${snippetTitle}`);
  await page.waitForSelector(`text=${fileName}`);

  await page.click('button:has-text("More")');

  page.on('dialog', async (dialog) => {
    expect(dialog.message()).toContain('delete');
    await dialog.accept();
  });

  await page.click('[class*="text-danger"]');

  await page.waitForTimeout(1000);
}

// the language picker is a searchable dropdown; the search field filters on label and keywords,
// so pick the option by its visible label and assert the trigger shows it before moving on
export async function selectLanguage(page: Page, language: string) {
  const trigger = page.locator('.searchable-select').first();

  await trigger.click();
  await page.fill('input[placeholder="Find language"]', language);

  const option = page.locator('.searchable-select button', { hasText: language }).first();
  await expect(option).toBeVisible({ timeout: 5000 });
  await option.click();

  await expect(trigger).toContainText(language);
}

export async function logout(page: Page) {
  page.on('dialog', async (dialog) => {
    expect(dialog.message()).toContain('log-out');
    await dialog.accept();
  });

  await page.click('text=Log-out');
  await page.waitForSelector('text=Please sign-in using token');
}
