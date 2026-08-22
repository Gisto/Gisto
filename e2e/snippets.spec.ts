import { test, expect } from '@playwright/test';

import {
  loginWithLocal,
  createSnippet,
  deleteSnippet,
  navigateToDashboard,
  navigateToNewSnippet,
} from './test-utils';

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

  test('markdown preview with long content stays at normal width and scrolls sideways', async ({
    page,
  }) => {
    await loginWithLocal(page);

    await navigateToNewSnippet(page);

    await page.fill('textarea[id="description"]', 'E2E markdown width #e2e-tag');
    await page.fill('input[id="file"]', 'README.md');
    await page.click('.monaco-editor');
    await page.keyboard.insertText(
      `# Title\n\n${'A'.repeat(400)}\n\n\`\`\`js\n${'C'.repeat(3000)}\n\`\`\``
    );
    await page.click('button:has-text("Create")');

    await page.waitForSelector('.markdown-body', { timeout: 40000 });

    const metrics = await page.evaluate(() => {
      const mdb = document.querySelector('.markdown-body') as HTMLElement | null;
      let fileEl = null as HTMLElement | null;
      document.querySelectorAll('div').forEach((el) => {
        if (el.querySelector('.markdown-body')) {
          fileEl = el.closest('[class*="bg-background"]') as HTMLElement | null;
        }
      });
      const pre = mdb?.querySelector('pre') as HTMLElement | null;
      const snippetRoot = document.querySelector('div.h-screen.w-full') as HTMLElement | null;
      return {
        innerWidth: window.innerWidth,
        snippetRootWidth: snippetRoot
          ? Math.round(snippetRoot.getBoundingClientRect().width)
          : null,
        fileElWidth: fileEl ? Math.round(fileEl.getBoundingClientRect().width) : null,
        mdbWidth: mdb ? Math.round(mdb.getBoundingClientRect().width) : null,
        preScrollWidth: pre ? pre.scrollWidth : null,
        preClientWidth: pre ? pre.clientWidth : null,
      };
    });

    expect(metrics.fileElWidth).not.toBeNull();
    expect(metrics.snippetRootWidth).not.toBeNull();
    expect(metrics.snippetRootWidth).toBeLessThan(metrics.innerWidth);
    expect(metrics.fileElWidth).toBeLessThanOrEqual(metrics.snippetRootWidth!);
    expect(metrics.mdbWidth).toBeLessThanOrEqual(metrics.snippetRootWidth!);
    expect(metrics.preScrollWidth).toBeGreaterThan(metrics.preClientWidth!);

    await deleteSnippet(page, 'E2E markdown width', 'README.md');
  });
});
