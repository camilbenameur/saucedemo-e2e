import { test, expect, type Page } from '@playwright/test';
import { login } from './support/login';
import { ajouterAuPanier, allerAuResume, montant } from './support/commande';

async function verifierCalcul(page: Page, sousTotalAttendu: number) {
  const sousTotal = await montant(page.getByTestId('subtotal-label'));
  const taxe = await montant(page.getByTestId('tax-label'));
  const total = await montant(page.getByTestId('total-label'));
  expect(sousTotal).toBeCloseTo(sousTotalAttendu, 2);
  expect(taxe).toBeCloseTo(sousTotal * 0.08, 2);
  expect(total).toBeCloseTo(sousTotal + taxe, 2);
}

test.describe('Commande', { tag: '@regression' }, () => {
  test('TC-08 calcul du sous-total, de la taxe et du total', async ({ page }) => {
    await login(page);
    await ajouterAuPanier(page, ['sauce-labs-backpack', 'sauce-labs-bike-light']);
    await allerAuResume(page);
    await expect(page.getByTestId('subtotal-label')).toHaveText('Item total: $39.98');
    await verifierCalcul(page, 39.98);
  });

  test('TC-11 calcul avec 4 produits', async ({ page }) => {
    await login(page);
    await ajouterAuPanier(page, [
      'sauce-labs-bike-light',
      'sauce-labs-bolt-t-shirt',
      'sauce-labs-onesie',
      'sauce-labs-backpack',
    ]);
    await allerAuResume(page);
    // Le site affiche « Item total: $63.959999999999994 » : on compare le nombre, à 2 décimales près.
    await expect(page.getByTestId('subtotal-label')).toBeVisible();
    await verifierCalcul(page, 63.96);
    expect(await montant(page.getByTestId('tax-label'))).toBe(5.12);
    expect(await montant(page.getByTestId('total-label'))).toBe(69.08);
  });

  test('TC-13 étape 1, prénom manquant', async ({ page }) => {
    await login(page);
    await ajouterAuPanier(page, ['sauce-labs-backpack']);
    await page.getByTestId('shopping-cart-link').click();
    await page.getByTestId('checkout').click();
    await page.getByTestId('continue').click();
    await expect(page.getByTestId('error')).toHaveText('Error: First Name is required');
    await expect(page).toHaveURL(/\/checkout-step-one\.html$/);
  });
});
