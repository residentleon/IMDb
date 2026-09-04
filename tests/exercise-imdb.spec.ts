import { test } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { MovieDetailsPage } from '../pages/MovieDetailsPage';
import { Top250Page } from '../pages/Top250Page';
import data from '../data/data.json';

/**
 * IMDb Test Suite
 * Automated tests for IMDb website using Page Object Model
 * Tests common user flows: searching for movies and navigating Top 250
 */

test('@smoke TC01 - Search and Validate Movie', async ({ page }) => {
  const homePage = new HomePage(page);
  const movieDetailsPage = new MovieDetailsPage(page);

  await test.step('Navigate to the IMDb homepage', async () => {
    await homePage.goToHomePage(data.homePage);
  });

  await test.step(`Search for movie "${data.TC01.movie}"`, async () => {
    await homePage.searchMovie(data.TC01.movie);
  });

  await test.step(`Click on the movie from search results`, async () => {
    await homePage.clickMovieFromResults(data.TC01.movie);
  });

  await test.step(`Validate that the movie title matches the search keyword "${data.TC01.movie}"`, async () => {
    await movieDetailsPage.validateMovieDetails(data.TC01.movie, data.TC01.synopsis);
  });
});

test('@regression TC02 - Navigate Top 250 Movies', async ({ page }) => {
  const homePage = new HomePage(page);
  const top250Page = new Top250Page(page);
  const movieDetailsPage = new MovieDetailsPage(page);
  let movieTitle = '';

  await test.step('Go to the IMDb Top 250 Movies page', async () => {
    await homePage.goToHomePage(data.homePage);
    await homePage.goToTop250Page();
    await top250Page.validateToTop250Page();
  });

  await test.step('Validate first movie title is visible in the list', async () => {
    await top250Page.validateFirstMovieTitleVisible();
  });

  await test.step('Click on the first movie in the list', async () => {
    movieTitle = await top250Page.clickFirstMovieInList();
  });

  await test.step('Validate: Movie title is visible', async () => {
    await movieDetailsPage.validateMovieTitle(movieTitle);
  });

  await test.step('Validate: Rating is displayed', async () => {
    await movieDetailsPage.validateRatingIsDisplayed();
  });

  await test.step('Validate: Year of release is shown', async () => {
    await movieDetailsPage.validateYearIsDisplayed();
  });
});
