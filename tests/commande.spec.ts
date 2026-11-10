import { test, expect, type Locator } from '@playwright/test';
import { login } from './support/login';

async function amount(locator: Locator): Promise<number> {
  const text = (await locator.textContent()) ?? '';
  return Number(text.replace(/[^0-9.]/g, ''));
}

test.describe('Commande', { tag: '@regression' }, () => {
  test('TC-08 calcul du sous-total, de la taxe et du total', async ({ page }) => {
    await login(page);
    await page.getByTestId('add-to-cart-sauce-labs-backpack').click();
    await page.getByTestId('add-to-cart-sauce-labs-bike-light').click();
    await page.getByTestId('shopping-cart-link').click();
    await page.getByTestId('checkout').click();
    await page.getByTestId('firstName').fill('Camille');
    await page.getByTestId('lastName').fill('Martin');
    await page.getByTestId('postalCode').fill('69100');
    await page.getByTestId('continue').click();

    await expect(page.getByTestId('subtotal-label')).toHaveText('Item total: $39.98');
    const subtotal = await amount(page.getByTestId('subtotal-label'));
    const tax = await amount(page.getByTestId('tax-label'));
    const total = await amount(page.getByTestId('total-label'));

    expect(tax).toBeCloseTo(subtotal * 0.08, 2);
    expect(total).toBeCloseTo(subtotal + tax, 2);
  });
});
