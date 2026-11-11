import type { Locator, Page } from '@playwright/test';

export async function ajouterAuPanier(page: Page, produits: string[]) {
  for (const produit of produits) {
    await page.getByTestId(`add-to-cart-${produit}`).click();
  }
}

export async function allerAuResume(page: Page) {
  await page.getByTestId('shopping-cart-link').click();
  await page.getByTestId('checkout').click();
  await page.getByTestId('firstName').fill('Camille');
  await page.getByTestId('lastName').fill('Martin');
  await page.getByTestId('postalCode').fill('69100');
  await page.getByTestId('continue').click();
}

export async function montant(locator: Locator): Promise<number> {
  const texte = (await locator.textContent()) ?? '';
  return Number(texte.replace(/[^0-9.]/g, ''));
}
