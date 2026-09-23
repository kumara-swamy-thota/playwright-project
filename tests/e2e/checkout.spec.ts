import { test, expect } from '../../src/fixtures/test-fixtures';
import { products, checkoutInfo } from '../../src/utils/test-data';

test.describe('Checkout @regression', () => {
  test('completes a full purchase end-to-end', async ({
    inventoryPage,
    cartPage,
    checkoutPage,
  }) => {
    await inventoryPage.goto('/inventory.html');
    await inventoryPage.addItemToCart(products.backpack);
    await inventoryPage.addItemToCart(products.bikeLight);

    await inventoryPage.goToCart();
    await cartPage.proceedToCheckout();

    await checkoutPage.fillShippingInfo(checkoutInfo);
    await checkoutPage.finishOrder();

    await checkoutPage.expectOrderComplete();
  });

  test('requires shipping details before continuing', async ({ inventoryPage, cartPage, page }) => {
    await inventoryPage.goto('/inventory.html');
    await inventoryPage.addItemToCart(products.backpack);
    await inventoryPage.goToCart();
    await cartPage.proceedToCheckout();

    await page.getByRole('button', { name: 'Continue' }).click();

    await expect(page.locator('[data-test="error"]')).toContainText(/first name is required/i);
  });
});
