import { Locator, Page, expect } from '@playwright/test';

export class BasePage {
  protected readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  protected async navigateTo(url: string, selector: Locator) {
    await this.page.goto(url);
    await this.page.waitForLoadState('load');
    await this.expectVisible(selector);
  }

  protected async click(selector: Locator) {
    await this.expectVisible(selector);
    await selector.click();
  }

  protected async fill(selector: Locator, text: string) {
    await this.expectVisible(selector);
    await selector.clear();
    await selector.fill(text);
  }

  protected async unusedMethod(selector: Locator, text: string) {
    await selector.selectOption(text);
  }

  protected async expectVisible(selector: Locator) {
    await expect(selector).toBeVisible();
  }
}
