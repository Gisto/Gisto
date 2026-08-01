import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

import { test, expect } from '@playwright/test';

import { loginWithLocal, navigateToSettings } from './test-utils';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const localesDir = path.join(__dirname, '../public/locales');
const localeFiles = fs.readdirSync(localesDir).filter((file) => file.endsWith('.json'));

const locales = localeFiles.map((file) => {
  const code = file.replace('.json', '');
  const content = JSON.parse(fs.readFileSync(path.join(localesDir, file), 'utf-8'));

  return {
    code,
    dashboard: content.menu.dashboard,
    settings: content.menu.settings,
    logout: content.menu.logOut,
    newSnippet: content.menu.newSnippet,
    about: content.menu.about,
    dashboardTitle: content.pages.dashboard.title,
    settingsTitle: content.pages.settings.title,
  };
});

test.describe('Translations', () => {
  test.beforeEach(async ({ page }) => {
    await loginWithLocal(page);
  });

  for (const locale of locales) {
    test(`can switch to ${locale.code} and see translated UI`, async ({ page }) => {
      await navigateToSettings(page);

      await page.waitForSelector('text=Gisto settings');

      await page.evaluate((lang) => {
        // @ts-expect-error setLanguage is exposed on window
        window.setLanguage(lang);
        setTimeout(() => {
          window.location.reload();
        }, 100);
      }, locale.code);

      await page.waitForNavigation();
      await page.waitForLoadState('networkidle');

      await expect(page.getByText(locale.dashboard).first()).toBeVisible();
      await expect(page.getByText(locale.settings).first()).toBeVisible();
      await expect(page.getByText(locale.logout).first()).toBeVisible();
      await expect(page.getByText(locale.newSnippet).first()).toBeVisible();
      await expect(page.getByText(locale.about).first()).toBeVisible();

      await page.click(`text=${locale.dashboard}`);
      await expect(page.getByText(locale.dashboardTitle).first()).toBeVisible();

      await page.click(`text=${locale.settings}`);
      await expect(page.getByText(locale.settingsTitle).first()).toBeVisible();
    });
  }
});
