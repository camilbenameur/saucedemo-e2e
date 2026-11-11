import { test, expect } from '@playwright/test';
import { login } from './support/login';
import { ajouterAuPanier } from './support/commande';

test.describe('Panier', { tag: '@regression' }, () => {
  test('TC-09 contenu du panier et retour aux produits', async ({ page }) => {
    await login(page);
    await ajouterAuPanier(page, ['sauce-labs-backpack', 'sauce-labs-bike-light']);
    await page.getByTestId('shopping-cart-link').click();

    const lignes = page.getByTestId('inventory-item');
    await expect(lignes).toHaveCount(2);
    await expect(lignes.getByTestId('inventory-item-name')).toHaveText([
      'Sauce Labs Backpack',
      'Sauce Labs Bike Light',
    ]);
    await expect(lignes.getByTestId('inventory-item-price')).toHaveText(['$29.99', '$9.99']);
    await expect(lignes.getByTestId('item-quantity')).toHaveText(['1', '1']);

    await page.getByTestId('remove-sauce-labs-backpack').click();
    await expect(lignes).toHaveCount(1);
    await expect(page.getByTestId('shopping-cart-badge')).toHaveText('1');

    await page.getByTestId('continue-shopping').click();
    await expect(page).toHaveURL(/\/inventory\.html$/);
  });

  test('TC-10 le panier survit au rechargement et à la déconnexion', async ({ page }) => {
    await login(page);
    await ajouterAuPanier(page, ['sauce-labs-backpack']);
    await expect(page.getByTestId('shopping-cart-badge')).toHaveText('1');

    await page.reload();
    await expect(page.getByTestId('shopping-cart-badge')).toHaveText('1');

    await page.getByRole('button', { name: 'Open Menu' }).click();
    await page.getByTestId('logout-sidebar-link').click();
    await expect(page).toHaveURL(/\/$/);

    await login(page);
    await expect(page.getByTestId('shopping-cart-badge')).toHaveText('1');
  });
});
