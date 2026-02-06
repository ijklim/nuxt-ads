/**
 * Unit tests for RandomAd.vue component
 */
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import RandomAd from '@/components/RandomAd.vue'
import type { AmazonAd, GoogleAd, ImageAd } from '@/domain/ads/types'

const amazonAd: AmazonAd = {
  id: 'AMAZON-001',
  type: 'AmazonBanner',
  displayRatio: 1,
  height: 250,
  width: 300,
  href: 'https://amazon.com/dp/B123456789',
  imageUrl: '/ads/amazon/laptop.jpg',
  imageAlt: 'Premium laptop',
  imageDescription: 'Premium laptop',
  price: 999.99,
  discountAmount: '100',
}

const googleAd: GoogleAd = {
  id: 'GOOGLE-001',
  type: 'GoogleAdSense',
  displayRatio: 1,
  format: 'responsive',
  layoutKey: 'google_layout_key',
  slot: 1234567890,
}

const imageAd: ImageAd = {
  id: 'IMAGE-001',
  type: 'ImageAd',
  displayRatio: 1,
  height: 280,
  width: 336,
  href: 'https://mochahost.com',
  imageUrl: '/ads/mochahost/banner.png',
  imageAlt: 'Web hosting services',
}

// Mocks are configured in test/setup.ts

describe('RandomAd.vue', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    ;(globalThis as any).__mockAdController.reset()
    // Reset useRoute mock to default
    ;(globalThis as any).useRoute = vi.fn(() => ({
      query: {},
    }))
  })


  describe('Component Rendering', () => {
    it('renders the component with default state', () => {
      const wrapper = mount(RandomAd)
      expect(wrapper.find('.text-center').exists()).toBe(true)
    })

    it('displays shuffle button when query param sb=1', async () => {
      // Override useRoute to return query with sb=1
      ;(globalThis as any).useRoute = vi.fn(() => ({
        query: { sb: '1' },
      }))

      const wrapper = mount(RandomAd)

      await wrapper.vm.$nextTick()
      const shuffleButton = wrapper.findAll('button').find((btn: any) => btn.text() === 'Shuffle')
      expect(shuffleButton).toBeDefined()
    })

    it('does not display shuffle button when sb param is absent', async () => {
      const wrapper = mount(RandomAd)

      await wrapper.vm.$nextTick()
      const buttons = wrapper.findAll('button')
      expect(buttons.length).toBe(0)
    })
  })

  describe('Ad Fetching', () => {
    it('fetches ad on component mount', async () => {
      const wrapper = mount(RandomAd)
      await wrapper.vm.$nextTick()

      expect((globalThis as any).__mockAdController.fetchAd).toHaveBeenCalledTimes(1)
    })

    it('passes query parameters to fetchAd', async () => {
      ;(globalThis as any).useRoute = vi.fn(() => ({
        query: { at: 'homepage', pk: '123' },
      }))

      const wrapper = mount(RandomAd)

      await wrapper.vm.$nextTick()

      const callArgs = (globalThis as any).__mockAdController.fetchAd.mock.calls?.[0]?.[0]
      expect(callArgs).toEqual({ at: 'homepage', pk: '123' })
    })

    it('handles array query parameters by joining with commas', async () => {
      ;(globalThis as any).useRoute = vi.fn(() => ({
        query: { category: ['homepage', 'sidebar'], pk: '123' },
      }))

      const wrapper = mount(RandomAd)

      await wrapper.vm.$nextTick()

      const callArgs = (globalThis as any).__mockAdController.fetchAd.mock.calls?.[0]?.[0]
      expect(callArgs).toEqual({ category: 'homepage,sidebar', pk: '123' })
    })

    it('handles API errors gracefully', async () => {
      const mockController = (globalThis as any).__mockAdController
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      mockController.fetchAd.mockImplementationOnce(async () => {
        mockController.state.error.value = new Error('Network request failed')
        console.error('Failed to fetch ad:', mockController.state.error.value)
      })

      const wrapper = mount(RandomAd)

      await wrapper.vm.$nextTick()

      expect(consoleSpy).toHaveBeenCalled()
      consoleSpy.mockRestore()
    })
  })

  describe('Ad Type Rendering', () => {
    it('renders GoogleAdSense component for GoogleAdSense ad type', async () => {
      ;(globalThis as any).__mockAdController.state.ad.value = googleAd

      const wrapper = mount(RandomAd)

      await wrapper.vm.$nextTick()

      // Check for stubbed component
      expect(wrapper.find('.google-ad-stub').exists()).toBe(true)
      // Check computed property on VM
      const googleAdValue = (wrapper.vm as any).googleAd
      expect(googleAdValue).toBeTruthy()
      expect(googleAdValue.type).toBe('GoogleAdSense')
    })

    it('renders AmazonBanner component for AmazonBanner ad type', async () => {
      ;(globalThis as any).__mockAdController.state.ad.value = amazonAd

      const wrapper = mount(RandomAd)

      await wrapper.vm.$nextTick()

      expect(wrapper.find('.amazon-banner-stub').exists()).toBe(true)
      const amazonAdValue = (wrapper.vm as any).amazonAd
      expect(amazonAdValue).toBeTruthy()
      expect(amazonAdValue.type).toBe('AmazonBanner')
    })

    it('renders image link for MochahostBanner ad type', async () => {
      ;(globalThis as any).__mockAdController.state.ad.value = imageAd

      const wrapper = mount(RandomAd)

      await wrapper.vm.$nextTick()

      const imageAdValue = (wrapper.vm as any).imageAd
      expect(imageAdValue).toBeTruthy()
      expect(imageAdValue.type).toBe('ImageAd') // Validator enforces this type constant

      // Check DOM
      expect(wrapper.find('img').exists()).toBe(true)
    })
  })

  describe('Data Validation', () => {
    it('renders no ad content when ad is null', async () => {
      const wrapper = mount(RandomAd)

      await wrapper.vm.$nextTick()

      expect(wrapper.find('.google-ad-stub').exists()).toBe(false)
      expect(wrapper.find('.amazon-banner-stub').exists()).toBe(false)
      expect(wrapper.find('img').exists()).toBe(false)
    })
  })

  describe('Shuffle Button Interaction', () => {
    it('fetches new ad when shuffle button clicked', async () => {
      ;(globalThis as any).useRoute = vi.fn(() => ({
        query: { sb: '1' },
      }))

      const wrapper = mount(RandomAd)

      await wrapper.vm.$nextTick()
      expect((globalThis as any).__mockAdController.fetchAd).toHaveBeenCalledTimes(1)

      const button = wrapper.find('button')
      await button.trigger('click')

      await wrapper.vm.$nextTick()

      expect((globalThis as any).__mockAdController.fetchAd).toHaveBeenCalledTimes(2)
    })
  })

  describe('notifyParentOfAdDimensions', () => {
    it('sends message to parent window with correct dimensions', async () => {
      const postMessageSpy = vi.fn()
      window.parent = { postMessage: postMessageSpy } as any

      const wrapper = mount(RandomAd)

      await wrapper.vm.$nextTick()
      // Wait for async fetch to complete
      await new Promise(resolve => setTimeout(resolve, 100))

      // Mock Image constructor to simulate image loading
      const originalImage = (globalThis as any).Image
      ;(globalThis as any).Image = class MockImage {
        onload: (() => void) | null = null
        naturalHeight = 280
        naturalWidth = 336

        constructor() {
          // Simulate immediate image load
          setTimeout(() => {
            if (this.onload) this.onload()
          }, 0)
        }
      }

      try {
        // Call the method directly with mock image path
        (wrapper.vm as any).notifyParentOfAdDimensions('/ads/test.jpg', 280, 336)

        // Wait for mocked image load to trigger onload callback
        await new Promise(resolve => setTimeout(resolve, 50))

        // Verify postMessage was called
        expect(postMessageSpy).toHaveBeenCalled()
      } finally {
        // Restore original Image
        ;(globalThis as any).Image = originalImage
      }
    })
  })

  describe('isLoading State', () => {
    it('initializes isLoading as false after fetch completes', async () => {
      const mockController = (globalThis as any).__mockAdController
      mockController.fetchAd.mockImplementationOnce(async () => {
        mockController.state.isLoading.value = true
        await Promise.resolve()
        mockController.state.isLoading.value = false
      })

      const wrapper = mount(RandomAd)

      // Wait for component mount and async fetch to complete
      await wrapper.vm.$nextTick()
      await new Promise(resolve => setTimeout(resolve, 100))

      expect((wrapper.vm as any).isLoading).toBe(false)
    })

    it('sets isLoading to true whilst fetching', async () => {
      const mockController = (globalThis as any).__mockAdController
      let resolveFetch: Function = () => {}
      const fetchPromise = new Promise(resolve => {
        resolveFetch = resolve
      })
      mockController.fetchAd.mockImplementationOnce(async () => {
        mockController.state.isLoading.value = true
        await fetchPromise
        mockController.state.isLoading.value = false
      })

      const wrapper = mount(RandomAd)

      // Immediately after mount
      await wrapper.vm.$nextTick()
      expect((wrapper.vm as any).isLoading).toBe(true)

      // Cleanup
      resolveFetch!(undefined)
    })

    it('sets isLoading to false when API call fails', async () => {
      const mockController = (globalThis as any).__mockAdController
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      mockController.fetchAd.mockImplementationOnce(async () => {
        mockController.state.isLoading.value = true
        mockController.state.error.value = new Error('Network error')
        console.error('Failed to fetch ad:', mockController.state.error.value)
        mockController.state.isLoading.value = false
      })

      const wrapper = mount(RandomAd)

      await new Promise(resolve => setTimeout(resolve, 50))

      expect((wrapper.vm as any).isLoading).toBe(false)
      consoleSpy.mockRestore()
    })

    it('sets isLoading to false when query parameters are invalid', async () => {
      const mockController = (globalThis as any).__mockAdController
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      ;(globalThis as any).useRoute = vi.fn(() => ({
        query: { malicious: 'payload' },
      }))

      mockController.fetchAd.mockImplementationOnce(async (filters: Record<string, string>) => {
        if ('malicious' in filters) {
          mockController.state.isLoading.value = true
          mockController.state.error.value = new Error('Invalid query parameters')
          console.error('Invalid query parameters:', mockController.state.error.value)
          mockController.state.isLoading.value = false
          return
        }
      })

      const wrapper = mount(RandomAd)

      await wrapper.vm.$nextTick()
      await new Promise(resolve => setTimeout(resolve, 50))

      expect((wrapper.vm as any).isLoading).toBe(false)
      consoleSpy.mockRestore()
    })
  })

  describe('Loader Element Visibility', () => {
    it('displays loader element when isLoading is true', async () => {
        const mockController = (globalThis as any).__mockAdController
        mockController.state.isLoading.value = true

        const wrapper = mount(RandomAd)

        await wrapper.vm.$nextTick()

        expect((wrapper.vm as any).isLoading).toBe(true)
        expect(wrapper.find('.loader').exists()).toBe(true)

        // Finish up
        mockController.state.isLoading.value = false
    })

    it('hides loader element when isLoading becomes false', async () => {
      const mockController = (globalThis as any).__mockAdController
      mockController.state.isLoading.value = true

      const wrapper = mount(RandomAd)

      mockController.state.isLoading.value = false
      await wrapper.vm.$nextTick()

      expect((wrapper.vm as any).isLoading).toBe(false)
      expect(wrapper.find('.loader').exists()).toBe(false)
    })
  })
})
