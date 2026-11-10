import type { Page } from '@playwright/test';

export const PASSWORD = process.env.SAUCE_PASSWORD ?? 'secret_sauce';

export async function login(page: Page, username = 'standard_user', password = PASSWORD) {
  await page.goto('/');
  await page.getByTestId('username').fill(username);
  await page.getByTestId('password').fill(password);
  await page.getByTestId('login-button').click();
}
