# IMDb Test Automation Suite

Automated test suite for the [IMDb website](https://www.imdb.com), built with Playwright and TypeScript.

## Tech Stack

- [Playwright](https://playwright.dev/) for end-to-end browser automation
- TypeScript for type-safe test code
- Allure 2 for test reporting
- Page Object Model for separating test logic from page interactions

## Project Structure

```text
├── data/
│   └── data.json                 # Test data and configuration
├── pages/
│   ├── BasePage.ts               # Shared page-object methods
│   ├── HomePage.ts               # IMDb homepage interactions
│   ├── MovieDetailsPage.ts       # Movie detail validations
│   └── Top250Page.ts             # Top 250 movie interactions
├── tests/
│   └── exercise-imdb.spec.ts     # Test suite
├── find-unused-methods.ts        # Unused-code verification script
├── playwright.config.ts          # Playwright configuration
├── package.json                  # Project scripts and dependencies
├── tsconfig.json                 # TypeScript configuration
└── README.md                     # Project documentation
```

## Features

- Search for a movie and validate its title and synopsis.
- Navigate to the Top 250 Movies page through the IMDb menu.
- Extract the first movie title from its `aria-label` using a regular expression.
- Validate the movie title, rating, and release year independently.
- Store locators and page interactions inside their corresponding page objects.

## Test Cases

| ID   | Description                                                       | Type |
| ---- | ----------------------------------------------------------------- | ---- |
| TC01 | Search for Inception and validate its title and synopsis          | E2E  |
| TC02 | Open the Top 250 Movies page and validate title, rating, and year | E2E  |

## Prerequisites

- Node.js 22 or higher
- npm or yarn
- Java/JDK 8 or higher for Allure report generation

## Setup

```bash
npm install
npx playwright install chromium
```

## Running Tests

```bash
# Run all tests
npm test

# Run smoke tests
npm run test:smoke

# Run regression tests
npm run test:regression

# Run tests with the browser visible
npm run test:headed

# Run a specific test file
npx playwright test tests/exercise-imdb.spec.ts
```

## Reports

```bash
# Open the Playwright HTML report
npm run test:report

# Generate and open the Allure report
npm run allure:generate
npm run allure:open
```

To clear previous reports in PowerShell:

```powershell
Remove-Item -Recurse -Force .\allure-results, .\allure-report -ErrorAction SilentlyContinue
```

## Verification

```bash
# Type check TypeScript
npm run typecheck

# Verify unused methods
npm run find-unused-methods

# Run ESLint
npx eslint . --ext .ts

# Check formatting
npm run format:check
```

## Configuration

The Playwright configuration uses:

- IMDb as the base URL
- Chromium as the browser
- A 30-second test timeout
- A 10-second action timeout
- A 15-second navigation timeout
- HTML and Allure reporters
- Tracing and video recording on failure

## Extending the Framework

1. Create or update a page object in `pages/`.
2. Define its locators in the page-object constructor.
3. Add reusable interactions or validations to the page object.
4. Create or update a test in `tests/`.
5. Add test data to `data/data.json` when appropriate.

## References

- [Playwright Locators](https://playwright.dev/docs/locators)
- [Playwright Page Object Models](https://playwright.dev/docs/pom)
- [Allure Documentation](https://docs.qameta.io/allure/)

**Note**: Before pushing to a repository, add `.env`, `node_modules/`, and `playwright-report/` to `.gitignore`.

## Assumptions & Tradeoffs

- **Single browser:** Chromium is used for this exercise. A production suite could add Firefox and WebKit.
- **External test data:** Movie inputs and expected values are stored in `data/data.json`.
- **Semantic locators:** Page objects use Playwright role, label, and test-id locators instead of CSS or XPath selectors.
