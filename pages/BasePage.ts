import { Locator, Page, expect } from '@playwright/test';

/**
 * BasePage
 * Base class for all page objects, providing common functionality
 * for navigation, interaction, and verification
 */
export class BasePage {
  protected readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Navigate to a specified URL and wait for a selector to be visible
   * @param url The URL to navigate to
   * @param selector The selector to wait for visibility
   */
  protected async navigateTo(url: string, selector: Locator) {
    await this.page.goto(url);
    await this.page.waitForLoadState('domcontentloaded');
    await this.expectVisible(selector);
  }

  /**
   * Click on an element
   * @param selector The selector to click
   */
  protected async click(selector: Locator) {
    await this.expectVisible(selector);
    await selector.click();
  }

  /**
   * Fill input field with text
   * @param selector The input selector
   * @param text The text to fill
   */
  protected async fill(selector: Locator, text: string) {
    await this.expectVisible(selector);
    await selector.clear();
    await selector.fill(text);
  }

  /**
   * Type text into an element without clearing
   * @param selector The input selector
   * @param text The text to type
   */
  protected async type(selector: Locator, text: string) {
    await this.expectVisible(selector);
    await selector.type(text);
  }

  /**
   * Expect element to be visible
   * @param selector The selector to check
   */
  protected async expectVisible(selector: Locator) {
    await expect(selector).toBeVisible();
  }

  /**
   * Expect element to match exact text
   * @param selector The locator to check
   * @param text The exact text to expect
   */
  protected async expectExactText(selector: Locator, text: string) {
    await expect(selector).toHaveText(text);
  }

  /**
   * Get text content of an element
   * @param selector The selector
   * @returns The text content
   */
  protected async getText(selector: Locator): Promise<string> {
    await this.expectVisible(selector);
    return (await selector.textContent()) || '';
  }

  /**
   * Wait for selector to be visible
   * @param selector The selector to wait for
   */
  protected async waitForSelector(selector: Locator) {
    await selector.waitFor({ state: 'visible' });
  }

  /**
   * Generic method to validate a field's visibility and optionally its exact value
   * Reusable for any field validation (text, year, rating, synopsis, etc.)
   * @param selector The locator to validate
   * @param expectedValue Optional expected value to validate against. If not provided, only checks visibility
   */
  protected async validateField(selector: Locator, expectedValue: string) {
    await this.expectExactText(selector, expectedValue);
  }
}
