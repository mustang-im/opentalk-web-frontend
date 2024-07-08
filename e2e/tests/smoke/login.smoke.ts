// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { test, expect } from '@playwright/test';

// prevent from auto login for testing
test.use({ storageState: { cookies: [], origins: [] } });

test('Login with valid credentials (username)', async ({ page }) => {
  await page.goto(process.env.INSTANCE_URL);
  await page.getByRole('button', { name: /^(Anmelden|Sign In)$/ }).click();
  await page.getByLabel('Username or email').fill(process.env.USERNAME);
  await page.getByLabel('Username or email').press('Tab');
  await page.getByLabel('Password').fill(process.env.PASSWORD);
  await page.getByRole('button', { name: 'Sign In' }).click();
  await expect(page.getByRole('link', { name: /(Start|Starten)$/ }).nth(1)).toBeVisible();
});

test('Login with valid credentials (email)', async ({ page }) => {
  await page.goto(process.env.INSTANCE_URL);
  await page.getByRole('button', { name: /^(Anmelden|Sign In)$/ }).click();
  await page.getByLabel('Username or email').fill(process.env.USER_EMAIL);
  await page.getByLabel('Username or email').press('Tab');
  await page.getByLabel('Password').fill(process.env.PASSWORD);
  await page.getByRole('button', { name: 'Sign In' }).click();
  await expect(page.getByRole('link', { name: /(Start|Starten)$/ }).nth(1)).toBeVisible();
});

test('Login with invalid credentials', async ({ page }) => {
  await page.goto(process.env.INSTANCE_URL);
  await page.getByRole('button', { name: /^(Anmelden|Sign In)$/ }).click();
  await page.getByLabel('Username or email').fill(process.env.USERNAME);
  await page.getByLabel('Username or email').press('Tab');
  await page.getByLabel('Password').fill('wrong_password');
  await page.getByRole('button', { name: 'Sign In' }).click();
  await expect(page.locator('#input-error')).toContainText('Invalid username or password.');
});
