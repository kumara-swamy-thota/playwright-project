import { test, expect } from '../../src/fixtures/test-fixtures';
import { products } from '../../src/utils/test-data';

// Runs already authenticated, courtesy of the `setup` project + storageState.
test.describe('Shopping cart @regression', () => {
  test('adds a single item to the cart', async ({ inventoryPage }) => {
    await inventoryPage.goto('/inventory.html');
    await inventoryPage.expectLoaded();

    await inventoryPage.addItemToCart(products.backpack);

    expect(await inventoryPage.getCartCount()).toBe(1);
  });

  test('adds multiple items and reflects the running count', async ({ inventoryPage }) => {
    await inventoryPage.goto('/inventory.html');

    await inventoryPage.addItemToCart(products.backpack);
    await inventoryPage.addItemToCart(products.bikeLight);
    await inventoryPage.addItemToCart(products.boltTShirt);

    expect(await inventoryPage.getCartCount()).toBe(3);
  });

  test('removes an item from the cart', async ({ inventoryPage }) => {
    await inventoryPage.goto('/inventory.html');

    await inventoryPage.addItemToCart(products.backpack);
    expect(await inventoryPage.getCartCount()).toBe(1);

    await inventoryPage.removeItemFromCart(products.backpack);
    expect(await inventoryPage.getCartCount()).toBe(0);
  });

  test('cart page shows the items that were added', async ({ inventoryPage, cartPage }) => {
    await inventoryPage.goto('/inventory.html');
    await inventoryPage.addItemToCart(products.backpack);
    await inventoryPage.addItemToCart(products.bikeLight);

    await inventoryPage.goToCart();

    expect(await cartPage.getItemCount()).toBe(2);
  });

  test('sorting price low to high orders items ascending', async ({ inventoryPage }) => {
    await inventoryPage.goto('/inventory.html');

    await inventoryPage.sortBy('lohi');
    const prices = await inventoryPage.getItemPrices();
    const sorted = [...prices].sort((a, b) => a - b);

    expect(prices).toEqual(sorted);
  });
});
