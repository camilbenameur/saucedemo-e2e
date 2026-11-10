import { test, expect } from '@playwright/test';
import { login } from './support/login';

test.describe('Connexion', { tag: '@regression' }, () => {
  test('TC-05 utilisateur bloqué', async ({ page }) => {
    await login(page, 'locked_out_user');
    await expect(page.getByTestId('error')).toHaveText(
      'Epic sadface: Sorry, this user has been locked out.',
    );
    await expect(page).toHaveURL(/\/$/);
    await expect(page.getByTestId('inventory-item')).toHaveCount(0);
  });

  test('TC-06 mauvais mot de passe', async ({ page }) => {
    await login(page, 'standard_user', 'mauvais_mot_de_passe');
    await expect(page.getByTestId('error')).toHaveText(
      'Epic sadface: Username and password do not match any user in this service',
    );
    await expect(page).toHaveURL(/\/$/);
  });
});
