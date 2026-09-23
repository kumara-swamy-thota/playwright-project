import type { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  private readonly usernameInput = this.page.getByPlaceholder('Username');
  private readonly passwordInput = this.page.getByPlaceholder('Password');
  private readonly loginButton = this.page.getByRole('button', { name: 'Login' });
  private readonly errorMessage = this.page.locator('[data-test="error"]');

  constructor(page: Page) {
    super(page);
  }

  async open(): Promise<void> {
    await this.goto('/');
  }

  async login(username: string, password: string): Promise<void> {
    await this.fill(this.usernameInput, username);
    await this.fill(this.passwordInput, password);
    await this.click(this.loginButton);
  }

  async expectLoginError(message: string | RegExp): Promise<void> {
    await this.expectVisible(this.errorMessage);
    await this.expectText(this.errorMessage, message);
  }

  async isLoaded(): Promise<boolean> {
    return this.loginButton.isVisible();
  }
}
