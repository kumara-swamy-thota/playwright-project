import type { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export interface CheckoutInfo {
  firstName: string;
  lastName: string;
  postalCode: string;
}

export class CheckoutPage extends BasePage {
  private readonly firstNameInput = this.page.locator('[data-test="firstName"]');
  private readonly lastNameInput = this.page.locator('[data-test="lastName"]');
  private readonly postalCodeInput = this.page.locator('[data-test="postalCode"]');
  private readonly continueButton = this.page.getByRole('button', { name: 'Continue' });
  private readonly finishButton = this.page.getByRole('button', { name: 'Finish' });
  private readonly completeHeader = this.page.locator('.complete-header');

  constructor(page: Page) {
    super(page);
  }

  async fillShippingInfo(info: CheckoutInfo): Promise<void> {
    await this.fill(this.firstNameInput, info.firstName);
    await this.fill(this.lastNameInput, info.lastName);
    await this.fill(this.postalCodeInput, info.postalCode);
    await this.click(this.continueButton);
  }

  async finishOrder(): Promise<void> {
    await this.click(this.finishButton);
  }

  async expectOrderComplete(): Promise<void> {
    await this.expectText(this.completeHeader, /Thank you for your order/i);
  }
}
