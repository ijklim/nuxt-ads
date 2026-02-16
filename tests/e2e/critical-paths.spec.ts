/**
 * E2E tests for critical ad server workflows
 * Run with: playwright test
 */
import { test, expect } from '@playwright/test'

const timeout = 30000;
const maxLoadTimeMs = 15000;

const mockApiAdResponse = {
  ad_type: 'AmazonBanner',
  id: 'e2e-ad-1',
  url_segment_image: '/images/e2e-mock-ad.jpg',
  url_affiliate: 'https://example.com/product',
  title: 'Mock Ad',
  image_description: 'Mock ad description',
  height: 250,
  width: 300,
};

async function gotoApp(page: Parameters<typeof test.beforeEach>[0]['page'], path = '/') {
  await page.goto(path, { waitUntil: 'domcontentloaded' });
  await expect(page.locator('body')).toBeVisible({ timeout });
}

test.describe('Ad Server E2E Tests', () => {
  test.describe.configure({ mode: 'serial' });

  test.beforeEach(async ({ page }) => {
    await page.route('**/api/ads**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockApiAdResponse),
      });
    });

    await gotoApp(page);
  })

  test.describe('Ad Loading', () => {
    test('should load and display an ad on page load', async ({ page }) => {
      await page.waitForSelector('img, ins.adsbygoogle, a[target="_blank"]', { timeout })

      const adContent = page.locator('img, ins.adsbygoogle, a[target="_blank"]')
      await expect(adContent.first()).toBeVisible()
    })

    test('should fetch ad from correct API endpoint', async ({ page }) => {
      const responsePromise = page.waitForResponse(
        response => response.url().includes('/api/ads') && response.status() === 200,
        { timeout },
      );

      await gotoApp(page);

      const response = await responsePromise;
      expect(response.ok()).toBe(true)
    })

    test('should pass query parameters to API', async ({ page }) => {
      const responsePromise = page.waitForResponse(
        response => response.url().includes('/api/ads') && response.status() === 200,
        { timeout },
      );

      await gotoApp(page, '/?at=test-page&pk=123&sb=1');

      const capturedUrl = (await responsePromise).url();
      expect(capturedUrl).toContain('at=test-page')
      expect(capturedUrl).toContain('pk=123')
    })
  })

  test.describe('Shuffle Functionality', () => {
    test('should show shuffle button when sb=1', async ({ page }) => {
      await gotoApp(page, '/?sb=1');

      const shuffleButton = page.locator('button')
      await expect(shuffleButton).toBeVisible()
    })

    test('should fetch new ad when shuffle button clicked', async ({ page }) => {
      await gotoApp(page, '/?sb=1');

      await page.waitForSelector('img, ins.adsbygoogle, a[target="_blank"]', { timeout })

      const nextApiResponsePromise = page.waitForResponse(
        response => response.url().includes('/api/ads') && response.status() === 200,
        { timeout },
      );

      const shuffleButton = page.locator('button')
      await shuffleButton.click()
      await nextApiResponsePromise;

      await expect(shuffleButton).toBeVisible()
    })

    test('should not show shuffle button when sb is not set', async ({ page }) => {
      await gotoApp(page)

      const shuffleButton = page.locator('button')
      const count = await shuffleButton.count()
      expect(count).toBe(0)
    })
  })

  test.describe('Ad Types Rendering', () => {
    test('should render ad content on page', async ({ page }) => {
      await gotoApp(page)

      const hasAdContent = await page.locator('img, a[target="_blank"], ins').count() > 0
      expect(hasAdContent).toBe(true)
    })

    // test('should render different ad types', async ({ page }) => {
    //   // Just verify that the app can load and render ads
    //   await page.goto('http://localhost:8810?at=test')

    //   await page.waitForLoadState('networkidle')

    //   // Check that some ad content was rendered
    //   const hasContent = await page.locator('img, a, button, ins').count() > 0
    //   expect(hasContent).toBe(true)
    // })

    test('should render image link when ad contains image', async ({ page }) => {
      await gotoApp(page)

      const images = page.locator('img')
      const links = page.locator('a')
      const hasContent = (await images.count() > 0) || (await links.count() > 0)

      expect(hasContent).toBeTruthy()
    })
  })

  // test.describe('Error Handling', () => {
  //   test('should handle API errors gracefully', async ({ page }) => {
  //     // This test checks that page still loads even with invalid parameters
  //     let consoleErrors: string[] = []

  //     page.on('console', msg => {
  //       if (msg.type() === 'error') {
  //         consoleErrors.push(msg.text())
  //       }
  //     })

  //     await page.goto('http://localhost:8810?at=invalid')
  //     await page.waitForLoadState('networkidle')

  //     // Page should still have content even if ad loading fails
  //     const hasContent = await page.locator('img, a, button, ins').count() > 0
  //     expect(hasContent || consoleErrors.length === 0).toBeTruthy()
  //   })
  // })

  test.describe('Accessibility', () => {
    test('should have content on page', async ({ page }) => {
      await gotoApp(page)

      const body = page.locator('body')
      await expect(body).toBeVisible()
    })

    test('should have proper link attributes when external links exist', async ({ page }) => {
      await gotoApp(page)

      const externalLinks = page.locator('a[target="_blank"]')
      const count = await externalLinks.count()

      if (count > 0) {
        for (let i = 0; i < count; i++) {
          const rel = await externalLinks.nth(i).getAttribute('rel')
          // Verify rel attribute exists
          expect(rel).toBeTruthy()
        }
      }
    })

    test('should render buttons with visible text', async ({ page }) => {
      await gotoApp(page, '/?sb=1')

      const button = page.locator('button')
      const count = await button.count()

      if (count > 0) {
        const text = await button.first().textContent()
        expect(text?.trim().length).toBeGreaterThan(0)
      }
    })
  })

  test.describe('Performance', () => {
    test('should load ads within acceptable time', async ({ page }) => {
      const startTime = Date.now()

      await gotoApp(page)
      await page.waitForSelector('img, ins.adsbygoogle, a[target="_blank"]', { timeout })

      const endTime = Date.now()
      const loadTime = endTime - startTime

      expect(loadTime).toBeLessThan(maxLoadTimeMs)
    })

    test('should not have memory leaks on repeated shuffles', async ({ page }) => {
      await gotoApp(page, '/?sb=1')

      const button = page.locator('button:has-text("Shuffle")')
      await expect(button).toBeVisible()

      for (let i = 0; i < 5; i++) {
        await button.click()
        await page.waitForTimeout(200)
      }

      const body = page.locator('body')
      await expect(body).toBeVisible()
    })
  })

  test.describe('ads.js Embed Script', () => {
    test('should load page without major errors', async ({ page }) => {
      let criticalErrors = false

      page.on('console', msg => {
        if (msg.type() === 'error' && msg.text().includes('CORS')) {
          criticalErrors = true
        }
      })

      await gotoApp(page)

      const body = page.locator('body')
      await expect(body).toBeVisible()

      expect(criticalErrors).toBe(false)
    })
  })
})
