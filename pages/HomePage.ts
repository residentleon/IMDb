import { type Page, type Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * HomePage
 * Handles interactions with IMDb homepage
 * Implements search functionality using Playwright's locator methods
 */
export class HomePage extends BasePage {
  private readonly searchInput: Locator;
  private readonly movieResult: Locator;
  private readonly menuLabel: Locator;
  private readonly top250MoviesMenuItem: Locator;

  constructor(page: Page) {
    super(page);
    // Use Playwright's getByRole and getByPlaceholder for semantic selection
    this.searchInput = page.getByTestId('suggestion-search');
    this.movieResult = page.getByRole('link');
    this.menuLabel = page.getByLabel('Open navigation drawer');
    this.top250MoviesMenuItem = page.getByLabel('Top 250 movies');
  }

  /**
   * Navigate to IMDb homepage
   */
  public async goToHomePage(homePageUrl: string) {
    await this.navigateTo(homePageUrl, this.searchInput);
  }

  /**
   * Navigate to the Top 250 Movies page via the menu
   */
  public async goToTop250Page() {
    await this.click(this.menuLabel);
    await this.click(this.top250MoviesMenuItem);
  }

  /**
   * Search for a movie by title
   * @param movieTitle The movie title to search for
   */
  public async searchMovie(movieTitle: string) {
    await this.fill(this.searchInput, movieTitle);
  }

  /**
   * Click on a movie from search results
   * @param movieTitle The movie title to click
   */
  public async clickMovieFromResults(movieTitle: string) {
    await this.click(this.movieResult.filter({ hasText: movieTitle }).first());
    await this.page.waitForLoadState('domcontentloaded');
  }

  /**
   * Unused method for code verification
   * Simulates navigating to a saved list
   */
  public async unusedNavigateToWatchlist() {
    // Intentionally unused for verification tooling
    await this.page.goto('/list/watchlist/');
  }

  /**
   * Unused method for code verification
   * Simulates filtering by rating
   */
  public unusedFilterByRating(minRating: number): boolean {
    return minRating > 0 && minRating <= 10;
  }
}
