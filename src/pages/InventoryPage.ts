import type { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class InventoryPage extends BasePage {
  private readonly pageTitle = this.page.locator('.title');
  private readonly inventoryItems = this.page.locator('.inventory_item');
  private readonly cartBadge = this.page.locator('.shopping_cart_badge');
  private readonly cartLink = this.page.locator('.shopping_cart_link');
  private readonly sortDropdown = this.page.locator('[data-test="product-sort-container"]');

  constructor(page: Page) {
    super(page);
  }

  async expectLoaded(): Promise<void> {
    await this.expectText(this.pageTitle, 'Products');
  }

  itemByName(name: string) {
    return this.inventoryItems.filter({ hasText: name });
  }

  async addItemToCart(name: string): Promise<void> {
    const item = this.itemByName(name);
    await this.click(item.getByRole('button', { name: /add to cart/i }));
  }

  async removeItemFromCart(name: string): Promise<void> {
    const item = this.itemByName(name);
    await this.click(item.getByRole('button', { name: /remove/i }));
  }

  async getCartCount(): Promise<number> {
    if (!(await this.cartBadge.isVisible())) return 0;
    return Number(await this.cartBadge.textContent());
  }

  async goToCart(): Promise<void> {
    await this.click(this.cartLink);
  }

  async sortBy(option: 'az' | 'za' | 'lohi' | 'hilo'): Promise<void> {
    await this.sortDropdown.selectOption(option);
  }

  async getItemNames(): Promise<string[]> {
    return this.inventoryItems.locator('.inventory_item_name').allTextContents();
  }

  async getItemPrices(): Promise<number[]> {
    const texts = await this.inventoryItems.locator('.inventory_item_price').allTextContents();
    return texts.map((t) => Number(t.replace('$', '')));
  }
}
