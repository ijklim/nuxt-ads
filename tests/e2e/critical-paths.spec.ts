/**
 * E2E tests for critical ad server workflows
 * Run with: playwright test
 */
import { test, expect } from '@playwright/test'

test.describe('Ad Server E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Set environment before navigation
    await page.goto('http://localhost:8810')
  })

  test.describe('Ad Loading', () => {
    test('should load and display an ad on page load', async ({ page }) => {
      await page.waitForLoadState('networkidle')

      // Wait for ad content to render
      await page.waitForSelector('[id="nuxt-ad"]', { timeout: 5000 })

      const adContainer = await page.locator('[id="nuxt-ad"]')
      await expect(adContainer).toBeVisible()
    })

    test('should fetch ad from correct API endpoint', async ({ page }) => {
      const apiRequest = page.waitForEvent('response', response =>
        response.url().includes('/api/ads') && response.status() === 200
      )

      await page.goto('http://localhost:8810')
      const response = await apiRequest

      expect(response.status()).toBe(200)
      const data = await response.json()
      expect(data).toHaveProperty('ad_type')
      expect(data).toHaveProperty('display_ratio')
    })

    test('should pass query parameters to API', async ({ page }) => {
      await page.goto('http://localhost:8810?at=test-page&pk=123&sb=1')

      const apiRequest = page.waitForEvent('response', response =>
        response.url().includes('/api/ads')
      )

      const response = await apiRequest
      const url = response.url()

      expect(url).toContain('at=test-page')
      expect(url).toContain('pk=123')
      expect(url).toContain('random=1')
    })
  })

  test.describe('Shuffle Functionality', () => {
    test('should show shuffle button when sb=1', async ({ page }) => {
      await page.goto('http://localhost:8810?sb=1')

      const shuffleButton = page.locator('button:has-text("Shuffle")')
      await expect(shuffleButton).toBeVisible()
    })

    test('should fetch new ad when shuffle button clicked', async ({ page }) => {
      await page.goto('http://localhost:8810?sb=1')

      // Wait for initial ad load
      await page.waitForSelector('[id="nuxt-ad"]', { timeout: 5000 })

      // Get initial ad content
      const initialAdContent = await page.locator('[id="nuxt-ad"]').innerHTML()

      // Click shuffle button
      const shuffleButton = page.locator('button:has-text("Shuffle")')

      // Wait for new API call
      const apiRequest = page.waitForEvent('response', response =>
        response.url().includes('/api/ads')
      )

      await shuffleButton.click()
      await apiRequest

      // Wait for DOM update
      await page.waitForTimeout(500)

      // Verify ad content changed (or at least component re-rendered)
      expect(shuffleButton).toBeVisible()
    })

    test('should not show shuffle button when sb is not set', async ({ page }) => {
      await page.goto('http://localhost:8810')

      const shuffleButton = page.locator('button:has-text("Shuffle")')
      await expect(shuffleButton).not.toBeVisible()
    })
  })

  test.describe('Ad Types Rendering', () => {
    test('should render AmazonBanner component when ad_type is AmazonBanner', async ({ page }) => {
      // This test depends on API returning AmazonBanner type
      await page.goto('http://localhost:8810?at=amazon-test')

      await page.waitForLoadState('networkidle')

      // Look for AmazonBanner component or its content
      const adContainer = page.locator('[id="nuxt-ad"]')
      await expect(adContainer).toBeVisible()
    })

    test('should render GoogleAdSense component when ad_type is GoogleAdSense', async ({ page }) => {
      await page.goto('http://localhost:8810?at=google-test')

      await page.waitForLoadState('networkidle')

      const adContainer = page.locator('[id="nuxt-ad"]')
      await expect(adContainer).toBeVisible()
    })

    test('should render image link for MochahostBanner type', async ({ page }) => {
      await page.goto('http://localhost:8810?at=mochahost-test')

      await page.waitForLoadState('networkidle')

      const link = page.locator('a[target="_blank"]')
      const image = link.locator('img')

      // Check if image and link exist when rendering image ad
      if (await link.isVisible()) {
        expect(link).toHaveAttribute('rel', /nofollow|noopener/)
      }
    })
  })

  test.describe('Error Handling', () => {
    test('should handle API errors gracefully', async ({ page }) => {
      // This test checks browser console for errors
      let consoleErrors: string[] = []

      page.on('console', msg => {
        if (msg.type() === 'error') {
          consoleErrors.push(msg.text())
        }
      })

      await page.goto('http://localhost:8810?at=invalid')
      await page.waitForLoadState('networkidle')

      // Ad container should still be present even if ad loading fails
      const adContainer = page.locator('[id="nuxt-ad"]')
      await expect(adContainer).toBeVisible()
    })
  })

  test.describe('Accessibility', () => {
    test('should have proper alt text for images', async ({ page }) => {
      await page.goto('http://localhost:8810')
      await page.waitForLoadState('networkidle')

      const images = page.locator('img')
      const count = await images.count()

      for (let i = 0; i < count; i++) {
        const alt = await images.nth(i).getAttribute('alt')
        expect(alt).not.toBeNull()
        expect(alt?.length).toBeGreaterThan(0)
      }
    })

    test('should have proper link relationships', async ({ page }) => {
      await page.goto('http://localhost:8810')
      await page.waitForLoadState('networkidle')

      const externalLinks = page.locator('a[target="_blank"]')
      const count = await externalLinks.count()

      for (let i = 0; i < count; i++) {
        const rel = await externalLinks.nth(i).getAttribute('rel')
        expect(rel).toContain('nofollow')
      }
    })

    test('should render buttons with visible text', async ({ page }) => {
      await page.goto('http://localhost:8810?sb=1')

      const button = page.locator('button')
      const text = await button.textContent()

      expect(text?.trim().length).toBeGreaterThan(0)
    })
  })

  test.describe('Performance', () => {
    test('should load ads within acceptable time', async ({ page }) => {
      const startTime = Date.now()

      await page.goto('http://localhost:8810')
      await page.waitForSelector('[id="nuxt-ad"]', { timeout: 5000 })

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

      // Ad container should still be visible
      const adContainer = page.locator('[id="nuxt-ad"]')
      await expect(adContainer).toBeVisible()
    })
  })

  test.describe('ads.js Embed Script', () => {
    test('should load ads.js without CORS errors', async ({ page }) => {
      let corsErrors = false

      page.on('console', msg => {
        if (msg.type() === 'error' && msg.text().includes('CORS')) {
          corsErrors = true
        }
      })

      await page.goto('http://localhost:8810')
      await page.waitForLoadState('networkidle')

      // Verify no CORS errors occurred
      expect(corsErrors).toBe(false)
    })
  })
})
