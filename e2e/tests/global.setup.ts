// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { test as setup, expect } from '@playwright/test';

export const authUserFile = '.auth/user.json';

setup('authenticate and set english language', async ({ page }) => {
  // Perform authentication steps.
  await page.goto(process.env.INSTANCE_URL);
  await page.getByRole('button', { name: /^(Anmelden|Sign In)$/ }).click();
  await page.getByLabel('Username or email').fill(process.env.USERNAME);
  await page.getByLabel('Username or email').press('Tab');
  await page.getByLabel('Password').fill(process.env.PASSWORD);
  await page.getByRole('button', { name: 'Sign In' }).click();
  await expect(page.getByRole('link', { name: /(Start|Starten)$/ }).nth(1)).toBeVisible();

  // End of authentication steps.
  await page.context().storageState({ path: authUserFile });

  // Set language to english
  await page.getByRole('link', { name: /^(Einstellungen|Settings)$/ }).click();
  await page.getByRole('link', { name: /^(Allgemein|General)$/ }).click();
  await page.getByLabel(/^(Deutsch|English)$/).click();
  await page.getByRole('option', { name: 'English' }).click();
  await page.getByRole('button', { name: /^(Änderungen speichern|Save)$/ }).click();
  await expect(page.getByLabel('Your settings have been saved successfully.').getByRole('alert')).toBeVisible();
});
