import { test, expect } from '@playwright/test';
import { login } from './support/login';

test.describe('Inventaire', { tag: '@regression' }, () => {
  test('TC-07 tri par prix croissant', async ({ page }) => {
    await login(page);
    await page.getByTestId('product-sort-container').selectOption('lohi');
    const prices = (await page.getByTestId('inventory-item-price').allTextContents()).map((p) =>
      Number(p.replace('$', '')),
    );
    expect(prices).toHaveLength(6);
    expect(prices).toEqual([...prices].sort((a, b) => a - b));
    expect(prices[0]).toBe(7.99);
    expect(prices[5]).toBe(49.99);
  });
});
