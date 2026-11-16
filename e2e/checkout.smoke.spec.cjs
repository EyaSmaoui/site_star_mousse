const { test, expect } = require('@playwright/test');

test('catalogue to empty checkout has an explicit recovery path', async ({ page }) => {
  await page.goto('/products');
  await expect(page).toHaveTitle(/Star Mousse|matelas/i);

  await page.goto('/checkout');
  await expect(page.getByText(/panier.*vide/i)).toBeVisible();
  await expect(page.getByRole('button', { name: /découvrir nos produits/i })).toBeVisible();
});

test('product page exposes an explicit add-to-cart action', async ({ page }) => {
  await page.goto('/product/relax-plus');
  await expect(page.getByRole('button', { name: /panier|ajouter/i }).first()).toBeVisible();
});
