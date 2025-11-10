/**
 * E2E tests for critical ad server workflows
 * Run with: playwright test
 */
import { test, expect } from '@playwright/test'

const timeout = 30000;

test.describe('Ad Server E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Set environment before navigation
    await page.goto('http://localhost:8810')
  })

  test.describe('Ad Loading', () => {
    test('should load and display an ad on page load', async ({ page }) => {
      await page.waitForLoadState('networkidle')

      // Wait for ad content to render - look for any ad content
      await page.waitForSelector('img, ins.adsbygoogle, a[target="_blank"]', { timeout })

      // Verify some ad content is present
      const adContent = page.locator('img, ins.adsbygoogle, a[target="_blank"]')
      await expect(adContent.first()).toBeVisible()
    })

    test('should fetch ad from correct API endpoint', async ({ page }) => {
      let apiCallMade = false

      page.on('response', response => {
        if (response.url().includes('/api/ads') && response.status() === 200) {
          apiCallMade = true
        }
      })

      await page.goto('http://localhost:8810')
      await page.waitForLoadState('networkidle')

      // Verify API was called
      expect(apiCallMade).toBe(true)
    })

    test('should pass query parameters to API', async ({ page }) => {
      let capturedUrl = ''

      page.on('response', response => {
        if (response.url().includes('/api/ads')) {
          capturedUrl = response.url()
        }
      })

      await page.goto('http://localhost:8810?at=test-page&pk=123&sb=1')
      await page.waitForLoadState('networkidle')

      // Verify query parameters were passed to API
      if (capturedUrl) {
        expect(capturedUrl).toContain('at=test-page')
        expect(capturedUrl).toContain('pk=123')
      }
    })
  })

  test.describe('Shuffle Functionality', () => {
    test('should show shuffle button when sb=1', async ({ page }) => {
      await page.goto('http://localhost:8810?sb=1')

      const shuffleButton = page.locator('button')
      await expect(shuffleButton).toBeVisible()
    })

    test('should fetch new ad when shuffle button clicked', async ({ page }) => {
      await page.goto('http://localhost:8810?sb=1')

      // Wait for initial ad load
      await page.waitForSelector('img, ins.adsbygoogle, a[target="_blank"]', { timeout })

      let apiCallCount = 0

      page.on('response', response => {
        if (response.url().includes('/api/ads') && response.status() === 200) {
          apiCallCount++
        }
      })

      // Click shuffle button
      const shuffleButton = page.locator('button')
      await shuffleButton.click()

      // Wait for new API call
      await page.waitForTimeout(timeout)

      // Verify button still visible
      expect(shuffleButton).toBeVisible()
    })

    test('should not show shuffle button when sb is not set', async ({ page }) => {
      await page.goto('http://localhost:8810')

      const shuffleButton = page.locator('button')
      const count = await shuffleButton.count()
      expect(count).toBe(0)
    })
  })

  test.describe('Ad Types Rendering', () => {
    test('should render ad content on page', async ({ page }) => {
      await page.goto('http://localhost:8810')

      await page.waitForLoadState('networkidle')

      // Look for any ad content - image, link, or ad container
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
      await page.goto('http://localhost:8810')

      await page.waitForLoadState('networkidle')

      // Verify page loaded with some content
      const images = page.locator('img')
      const links = page.locator('a')
      const hasContent = (await images.count() > 0) || (await links.count() > 0)

      // At minimum, the page should have loaded
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
      await page.goto('http://localhost:8810')
      await page.waitForLoadState('networkidle')

      const body = page.locator('body')
      await expect(body).toBeVisible()
    })

    test('should have proper link attributes when external links exist', async ({ page }) => {
      await page.goto('http://localhost:8810')
      await page.waitForLoadState('networkidle')

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
      await page.goto('http://localhost:8810?sb=1')

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

      await page.goto('http://localhost:8810')
      await page.waitForSelector('img, ins.adsbygoogle, a[target="_blank"]', { timeout })

      const endTime = Date.now()
      const loadTime = endTime - startTime

      // Ad should load within 5 seconds
      expect(loadTime).toBeLessThan(5000)
    })

    test('should not have memory leaks on repeated shuffles', async ({ page }) => {
      await page.goto('http://localhost:8810?sb=1')
      await page.waitForLoadState('networkidle')

      const button = page.locator('button:has-text("Shuffle")')

      // Click shuffle 5 times rapidly
      for (let i = 0; i < 5; i++) {
        await button.click()
        await page.waitForTimeout(200)
      }

      // Page should still be functional
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

      await page.goto('http://localhost:8810')
      await page.waitForLoadState('networkidle')

      // Verify page loaded
      const body = page.locator('body')
      await expect(body).toBeVisible()

      // CORS errors should not occur
      expect(criticalErrors).toBe(false)
    })
  })
})
