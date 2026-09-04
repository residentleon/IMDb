import { type Page, type Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Top250Page
 * Handles interactions with IMDb Top 250 Movies page
 * Provides methods to navigate and validate movie details from the list
 * Uses Playwright's locator methods for element selection
 */
export class Top250Page extends BasePage {
  private readonly titleList: Locator;
  private readonly firstMovieInList: Locator;

  constructor(page: Page) {
    super(page);
    // Use data-testid and semantic selectors for stable element identification
    this.titleList = page.getByRole('heading', { name: 'Top 250 movies' });
    this.firstMovieInList = page.getByRole('link', { name: /^View title page for .+/ }).first();
  }

  /**
   * Navigate to Top 250 Movies page
   * Can navigate via menu or direct URL
   */
  public async validateToTop250Page() {
    await this.expectVisible(this.titleList);
  }

  /**
   * Click on the first movie in the Top 250 list
   * @returns The movie title extracted from the link text
   */
  public async clickFirstMovieInList(): Promise<string> {
    await this.expectVisible(this.firstMovieInList);
    const ariaLabel = await this.firstMovieInList.getAttribute('aria-label');
    const titleMatch = ariaLabel?.match(/for\s+(.+)/);

    if (!titleMatch) {
      throw new Error(`Could not extract movie title from: "${ariaLabel ?? ''}"`);
    }

    const title = titleMatch[1].trim();
    await this.click(this.firstMovieInList);
    await this.page.waitForLoadState('domcontentloaded');

    return title;
  }

  /**
   * Get the title of the first movie in the list
   * @returns The movie title
   */
  public async getFirstMovieTitle(): Promise<string> {
    return await this.getText(this.firstMovieInList);
  }

  /**
   * Validate that the movie title is visible
   */
  public async validateFirstMovieTitleVisible() {
    await this.expectVisible(this.firstMovieInList);
  }

  /**
   * Unused method for code verification
   * Simulates applying genre filter
   */
  public unusedApplyGenreFilter(genre: string): string {
    return `Filtering by: ${genre}`;
  }
}
