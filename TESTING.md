# Testing Guide

This document outlines the testing strategy and how to run tests for the Nuxt Ads application.

## Test Structure

```
tests/
├── unit/                      # Unit tests for components and composables
│   └── RandomAd.test.ts       # Component unit tests
├── e2e/
│   └── critical-paths.spec.ts # End-to-end tests (Playwright)
└── fixtures/
    └── mockData.ts            # Mock data and API responses

vitest.config.ts               # Vitest configuration for unit tests
playwright.config.ts           # Playwright configuration for E2E tests
```

## Why This Testing Stack?

This project uses **Vitest + Vue Test Utils + Playwright** instead of **@nuxt/test-utils** for the following reasons:

### Vitest vs @nuxt/test-utils

**Advantages of Our Stack:**

1. **Framework Agnostic**
   - Vitest is not Nuxt-specific, making tests more portable and reusable
   - Tests can easily migrate to other Vue frameworks or tools
   - Skills transfer directly to non-Nuxt projects

2. **Better Performance**
   - Vitest is powered by Vite, providing lightning-fast compilation and hot module reloading
   - @nuxt/test-utils is built on Jest/Vitest but adds Nuxt-specific overhead
   - Faster feedback loop during development (seconds vs. minutes for some setups)

3. **Finer Control**
   - Direct control over jsdom configuration and test environment
   - Flexible mocking without Nuxt's default mocks
   - Easier to test edge cases and override specific behaviors

4. **Production-Grade Tools**
   - Playwright provides real cross-browser testing (Chrome, Firefox, WebKit)
   - E2E tests run against actual browsers, not simulated environments
   - Better detection of real-world issues

5. **Clarity of Responsibility**
   - Unit tests (Vitest) test isolated components
   - E2E tests (Playwright) test full workflows
   - Clear separation reduces confusion about what each test verifies
   - Easier to debug failures when you know which layer is broken

6. **Ecosystem Support**
   - Both Vitest and Playwright are industry-standard tools
   - Larger community, more Stack Overflow answers, more plugins
   - Better IDE integration and debugging support

**When @nuxt/test-utils Would Be Better:**
- If we were testing Nuxt plugins, middleware, or server routes
- If we needed server-side rendering specific testing
- If the project was heavily Nuxt-specific without portability concerns

**Our Recommendation:**
For component testing in a modern Vue application, our stack is more flexible, faster, and teaches transferable testing skills. We use Nuxt's SSR and build system, but test the application layer independently of Nuxt's test utilities.

## Setup

### Install Test Dependencies

All test dependencies are already configured in `package.json`:

```bash
pnpm install
```

This installs:
- **vitest** ^4.0.8 - Unit test framework
- **@vue/test-utils** ^2.4.6 - Vue component testing utilities
- **jsdom** ^27.1.0 - Simulated browser environment
- **@vitest/coverage-v8** ^4.0.8 - Code coverage reporting
- **@playwright/test** ^1.56.1 - E2E testing in real browsers

### Configuration Files

- **`vitest.config.ts`** - Vitest configuration with Vue 3 support and jsdom environment
- **`playwright.config.ts`** - Playwright configuration for E2E tests (auto-generated if needed)

## Running Tests

### Unit Tests

```bash
# Run all unit tests
pnpm test

# Run tests in watch mode (re-run on file changes)
pnpm test:watch

# Run tests with coverage report
pnpm test:coverage

# Run specific test file
pnpm test tests/unit/RandomAd.test.ts
```

### E2E Tests

```bash
# Run all E2E tests
pnpm test:e2e

# Run E2E tests in UI mode (interactive browser)
pnpm test:e2e:ui

# Run specific test file
pnpm exec playwright test tests/e2e/critical-paths.spec.ts

# Run in headed mode (see browser)
pnpm exec playwright test --headed

# Run all tests (unit + E2E)
pnpm run test && pnpm test:e2e
```

### Test Scripts in package.json

```json
{
  "scripts": {
    "test": "vitest",
    "test:watch": "vitest --watch",
    "test:coverage": "vitest --coverage",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui"
  }
}
```

## Test Coverage

### Unit Tests (RandomAd.test.ts)

**Component Rendering:**
- ✅ Default state rendering
- ✅ Shuffle button visibility based on query params
- ✅ Dynamic component rendering

**Ad Fetching:**
- ✅ API call on mount
- ✅ Query parameter construction
- ✅ Error handling

**Ad Type Rendering:**
- ✅ GoogleAdSense component
- ✅ AmazonBanner component
- ✅ Image ad rendering

**Data Validation:**
- ✅ Required field validation
- ✅ Invalid response handling

**User Interactions:**
- ✅ Shuffle button click handling
- ✅ Multiple shuffle clicks

**PostMessage Communication:**
- ✅ Parent window notifications with dimensions

### E2E Tests (critical-paths.spec.ts)

**Ad Loading:**
- ✅ Ad loads on page load
- ✅ Correct API endpoint is called
- ✅ Query parameters are passed to API

**Shuffle Functionality:**
- ✅ Shuffle button shows when sb=1
- ✅ New ad fetches on shuffle
- ✅ Button hidden when not requested

**Ad Types:**
- ✅ AmazonBanner rendering
- ✅ GoogleAdSense rendering
- ✅ Image ad rendering

**Error Handling:**
- ✅ Graceful degradation on API errors

**Accessibility:**
- ✅ Alt text on images
- ✅ Link relationships (nofollow, noopener)
- ✅ Button text visibility

**Performance:**
- ✅ Load time < 5 seconds
- ✅ No memory leaks on repeated shuffles

**ads.js Embed:**
- ✅ No CORS errors
- ⚠️ CORS handling depends on hosting/CDN configuration; server middleware was removed from the repository — ensure the deploy environment sets appropriate CORS headers to avoid embed failures

## Mock Data

Mock API responses are defined in `tests/fixtures/mockData.ts`:

- `mockAmazonAdResponse` - Amazon banner ad
- `mockGoogleAdResponse` - Google AdSense ad
- `mockImageAdResponse` - Image/Mochahost ad
- `mockEmptyAdResponse` - Empty ad (fallback)
- `mockApiErrors` - Common API errors
- `testQueryParams` - Various query parameter combinations

## Best Practices

### Unit Testing
1. **Test behavior, not implementation** - Focus on what users see, not internal details
2. **Mock external dependencies** - API calls, route, composables
3. **Use fixtures** - Realistic test data that mirrors production
4. **Clear test names** - Describe what is tested and expected outcome
5. **Arrange-Act-Assert** - Setup → Execute → Verify

### E2E Testing
1. **Test critical paths only** - Don't test every possible state
2. **Use data-testid attributes** - More reliable than CSS selectors
3. **Wait for elements properly** - Use `waitForLoadState`, `waitForSelector`
4. **Test real workflows** - From user perspective
5. **Keep tests independent** - Each test should work in isolation

## Debugging Tests

### Vitest
```bash
# Debug mode with node inspector
node --inspect-brk ./node_modules/vitest/vitest.mjs

# Watch mode for development
pnpm test:watch
```

### Playwright
```bash
# UI mode (recommended for debugging)
pnpm test:e2e:ui

# Headed mode (see browser)
pnpm exec playwright test --headed

# Debug mode
pnpm exec playwright test --debug
```

## CI/CD Integration

### GitHub Actions

This project has two GitHub Actions workflows:

#### Pull Request Tests (`.github/workflows/pr-tests.yml`)
Automatically runs on every pull request to ensure code quality:

**Unit Tests Job:**
- Runs Vitest test suite
- Must pass before PR can be merged
- Duration: ~30-60 seconds

**E2E Tests Job:**
- Runs Playwright browser tests
- Must pass before PR can be merged
- Duration: ~2-5 minutes
- Uploads test report on failure

**Branch Protection:**
Both test jobs are required status checks. See [BRANCH_PROTECTION.md](./BRANCH_PROTECTION.md) for setup instructions.

#### Deployment Workflow (`.github/workflows/nuxt-build-scp-deploy.yml`)
Runs on pushes to `main` branch:
- Runs unit tests before building
- Builds and deploys to shared hosting
- Only deploys if tests pass

## Coverage Goals

- **Overall**: 80% minimum
- **Critical paths**: 100% (ad loading, shuffling, error handling)
- **Components**: 85% minimum
- **Utilities**: 90% minimum

## Resources

- [Branch Protection Setup](./BRANCH_PROTECTION.md) - Configure required status checks and approvals
- [Vitest Documentation](https://vitest.dev/)
- [Vue Test Utils](https://test-utils.vuejs.org/)
- [Playwright Documentation](https://playwright.dev/)
- [Testing Library Best Practices](https://testing-library.com/docs/)
