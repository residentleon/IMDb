import { type Page, type Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * MovieDetailsPage
 * Handles interactions and validations on IMDb movie details page
 * Provides methods to verify movie information (title, rating, year)
 * Uses Playwright's locator methods for element selection
 */
export class MovieDetailsPage extends BasePage {
  private readonly movieHeading: Locator;
  private readonly movieRating: Locator;
  private readonly movieYear: Locator;
  private readonly synopsis: Locator;

  constructor(page: Page) {
    super(page);
    // Use semantic selectors - elements that are stable across UI updates
    this.movieHeading = page.getByTestId('hero__primary-text');
    this.movieRating = page.getByRole('link', { name: 'View User Ratings' });
    this.movieYear = page.getByTestId('hero-parent').getByRole('link', { name: /^\d{4}$/ });
    this.synopsis = page.getByTestId('plot-xl');
  }

  /**
   * Validate all key movie details at once
   * @param title The expected movie title
   * @param synopsis The expected movie synopsis
   */
  public async validateMovieDetails(title: string, synopsis: string) {
    await this.validateField(this.movieHeading, title);
    await this.validateField(this.synopsis, synopsis);
  }

  /**
   * Validate that the movie title exists and matches the expected title
   * @param title The expected movie title
   */
  public async validateMovieTitle(title: string) {
    await this.validateField(this.movieHeading, title);
  }

  /**
   * Validate that the movie rating is displayed
   */
  public async validateRatingIsDisplayed() {
    await this.expectVisible(this.movieRating);
  }

  /**
   * Validate that the movie release year is displayed
   */
  public async validateYearIsDisplayed() {
    await this.expectVisible(this.movieYear);
  }

  /**
   * Unused method for code verification
   * Simulates adding movie to watchlist
   */
  public async unusedAddToWatchlist() {
    // Intentionally unused for verification tooling
    await this.click(this.synopsis);
  }
}
