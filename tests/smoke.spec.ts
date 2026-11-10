import { test, expect } from '@playwright/test';
import { login } from './support/login';

test.describe('Smoke', { tag: ['@smoke', '@regression'] }, () => {
  test('TC-01 connexion nominale', async ({ page, context }) => {
    await login(page);
    await expect(page).toHaveURL(/\/inventory\.html$/);
    await expect(page.getByTestId('title')).toHaveText('Products');
    await expect(page.getByTestId('inventory-item')).toHaveCount(6);
    const cookies = await context.cookies();
    expect(cookies.find((c) => c.name === 'session-username')?.value).toBe('standard_user');
  });

  test('TC-02 accès direct sans session', async ({ page }) => {
    for (const path of ['/inventory.html', '/cart.html']) {
      await page.goto(path);
      await expect(page).toHaveURL(/\/$/);
      await expect(page.getByTestId('error')).toHaveText(
        `Epic sadface: You can only access '${path}' when you are logged in.`,
      );
    }
  });

  test('TC-03 ajout au panier', async ({ page }) => {
    await login(page);
    await page.getByTestId('add-to-cart-sauce-labs-backpack').click();
    await expect(page.getByTestId('shopping-cart-badge')).toHaveText('1');
    await expect(page.getByTestId('remove-sauce-labs-backpack')).toBeVisible();
  });

  test('TC-04 commande complète', async ({ page }) => {
    await login(page);
    await page.getByTestId('add-to-cart-sauce-labs-backpack').click();
    await page.getByTestId('shopping-cart-link').click();
    await page.getByTestId('checkout').click();
    await page.getByTestId('firstName').fill('Camille');
    await page.getByTestId('lastName').fill('Martin');
    await page.getByTestId('postalCode').fill('69100');
    await page.getByTestId('continue').click();
    await expect(page.getByTestId('payment-info-value')).toBeVisible();
    await expect(page.getByTestId('shipping-info-value')).toBeVisible();
    await page.getByTestId('finish').click();
    await expect(page).toHaveURL(/\/checkout-complete\.html$/);
    await expect(page.getByTestId('complete-header')).toHaveText('Thank you for your order!');
    await expect(page.getByTestId('shopping-cart-badge')).toHaveCount(0);
  });
});
