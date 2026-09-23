import type { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class CartPage extends BasePage {
  private readonly cartItems = this.page.locator('.cart_item');
  private readonly checkoutButton = this.page.getByRole('button', { name: 'Checkout' });

  constructor(page: Page) {
    super(page);
  }

  async getItemCount(): Promise<number> {
    return this.cartItems.count();
  }

  async proceedToCheckout(): Promise<void> {
    await this.click(this.checkoutButton);
  }
}
