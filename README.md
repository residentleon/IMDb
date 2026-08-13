# TodoMVC - Playwright Automation Suite

Automated test suite for the [Playwright TodoMVC demo](https://demo.playwright.dev/todomvc/), built with Playwright and TypeScript following the Page Object Model.

## Tech Stack

- [Playwright](https://playwright.dev/) — E2E automation framework
- TypeScript — scripting language
- Allure 2 — test reporting
- Page Object Model — framework architecture

## Project Structure

```text
├── data/
│   └── data.json                 # Test data
├── pages/
│   ├── locators/
│   │   └── TodoPage.ts           # Element selectors
│   ├── BasePage.ts               # Shared page actions
│   └── TodoActions.ts            # Todo-specific actions
├── tests/
│   └── exercise-todo.spec.ts     # Test suite
├── find-unused-methods.ts        # Custom unused-code check
├── playwright.config.ts          # Playwright configuration
├── package.json                  # Scripts and dependencies
└── tsconfig.json                 # TypeScript configuration
```

## Prerequisites

- Node.js 22+
- npm
- Java/JDK 8+ (required by Allure 2)

## Setup

```bash
# Install project dependencies, including Allure
npm install

# Install the browser configured for this project
npx playwright install chromium
```

## Run Tests

```bash
# Run all tests
npm test

# Run smoke tests
npm run test:smoke

# Run regression tests
npm run test:regression

# Run all tests in headed mode
npm run test:headed

# Run a specific test file
npx playwright test tests/exercise-todo.spec.ts
```

## View Reports

Run the tests before generating an Allure report so that `allure-results` contains the latest execution results.

```bash
# Generate and open the Allure report
npm test
npm run allure:generate
npm run allure:open

# Open the Playwright HTML report
npm run test:report
```

To discard previous report data before a new run, use PowerShell:

```powershell
Remove-Item -Recurse -Force .\allure-results, .\allure-report -ErrorAction SilentlyContinue
```

## Verify Code

```bash
# Check TypeScript compilation and unused local declarations
npm run typecheck

# Check unused methods, locators, and local variables
npm run find-unused-methods

# Run ESLint across TypeScript files
npx eslint . --ext .ts

# Check or apply Prettier formatting
npm run format:check
npm run format
```

## Test Cases

| ID   | Description                                        | Type |
| ---- | -------------------------------------------------- | ---- |
| TC01 | Full todo workflow (add, complete, filter, delete) | E2E  |
| TC02 | Clear completed items updates count correctly      | E2E  |

## Assumptions & Tradeoffs

- **Single browser (Chromium):** Kept to Chromium for this exercise. In a production suite, Firefox and WebKit would be enabled for cross-browser coverage.
- **TC01 as a single E2E flow:** The exercise described a sequential workflow, so it is implemented as one test with `test.step()` for report readability. In a larger project, it would be split into focused, independent tests.
- **External test data:** All test inputs and expected values live in `data.json` to keep tests clean and make data changes easy without touching test logic.
- **TC02 additional test:** “Clear completed” is a destructive bulk action that simultaneously affects item count and filter state, making it a high-risk user flow worth explicit coverage.
