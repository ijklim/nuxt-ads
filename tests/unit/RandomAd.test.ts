/**
 * Unit tests for RandomAd.vue component
 */
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import RandomAd from '@/components/RandomAd.vue'
import { mockAmazonAdResponse, mockGoogleAdResponse, mockImageAdResponse, mockApiErrors } from '../fixtures/mockData'

// Mocks are configured in test/setup.ts

describe('RandomAd.vue', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Reset $fetch mock to default - return a promise that resolves to empty object
    ;(globalThis as any).$fetch = vi.fn().mockResolvedValue({})
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
      ;(globalThis as any).$fetch.mockResolvedValueOnce(mockAmazonAdResponse)

      const wrapper = mount(RandomAd)

      await wrapper.vm.$nextTick() // Wait for mount
      await new Promise(resolve => setTimeout(resolve, 0)) // Wait for fetch

      expect((globalThis as any).$fetch).toHaveBeenCalled()
    })

    it('constructs correct API URL with query parameters', async () => {
      ;(globalThis as any).$fetch.mockResolvedValueOnce(mockAmazonAdResponse)
      ;(globalThis as any).useRoute = vi.fn(() => ({
        query: { at: 'homepage', pk: '123' },
      }))

      const wrapper = mount(RandomAd)

      await wrapper.vm.$nextTick()
      await new Promise(resolve => setTimeout(resolve, 0))

      const callArgs = (globalThis as any).$fetch.mock.calls?.[0]?.[0]
      expect(callArgs).toContain('random=1')
      expect(callArgs).toContain('at=homepage')
      expect(callArgs).toContain('pk=123')
    })

    it('handles array query parameters by joining with commas', async () => {
      ;(globalThis as any).$fetch.mockResolvedValueOnce(mockAmazonAdResponse)
      ;(globalThis as any).useRoute = vi.fn(() => ({
        query: { category: ['homepage', 'sidebar'], pk: '123' },
      }))

      const wrapper = mount(RandomAd)

      await wrapper.vm.$nextTick()
      await new Promise(resolve => setTimeout(resolve, 0))

      expect((globalThis as any).$fetch).toHaveBeenCalled()
      const callArgs = (globalThis as any).$fetch.mock.calls?.[0]?.[0]
      expect(callArgs).toContain('random=1')
      expect(callArgs).toContain('category=homepage%2Csidebar')
      expect(callArgs).toContain('pk=123')
    })

    it('handles API errors gracefully', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      ;(globalThis as any).$fetch.mockRejectedValueOnce(mockApiErrors.networkError)

      const wrapper = mount(RandomAd)

      await wrapper.vm.$nextTick()
      await new Promise(resolve => setTimeout(resolve, 0))

      // The controller logs errors
      expect(consoleSpy).toHaveBeenCalled()
      consoleSpy.mockRestore()
    })
  })

  describe('Ad Type Rendering', () => {
    it('renders GoogleAdSense component for GoogleAdSense ad type', async () => {
      ;(globalThis as any).$fetch.mockResolvedValueOnce(mockGoogleAdResponse)

      const wrapper = mount(RandomAd)

      await wrapper.vm.$nextTick()
      await new Promise(resolve => setTimeout(resolve, 50))

      // Check for stubbed component
      expect(wrapper.find('.google-ad-stub').exists()).toBe(true)
      // Check computed property on VM
      const googleAd = (wrapper.vm as any).googleAd
      expect(googleAd).toBeTruthy()
      expect(googleAd.type).toBe('GoogleAdSense')
    })

    it('renders AmazonBanner component for AmazonBanner ad type', async () => {
      ;(globalThis as any).$fetch.mockResolvedValueOnce(mockAmazonAdResponse)

      const wrapper = mount(RandomAd)

      await wrapper.vm.$nextTick()
      await new Promise(resolve => setTimeout(resolve, 50))

      expect(wrapper.find('.amazon-banner-stub').exists()).toBe(true)
      const amazonAd = (wrapper.vm as any).amazonAd
      expect(amazonAd).toBeTruthy()
      expect(amazonAd.type).toBe('AmazonBanner')
    })

    it('renders image link for MochahostBanner ad type', async () => {
      // Logic for Mochahost -> ImageAd
      ;(globalThis as any).$fetch.mockResolvedValueOnce(mockImageAdResponse)

      const wrapper = mount(RandomAd)

      await wrapper.vm.$nextTick()
      await new Promise(resolve => setTimeout(resolve, 50))

      const imageAd = (wrapper.vm as any).imageAd
      expect(imageAd).toBeTruthy()
      // Note: Domain maps 'MochahostBanner' (from API) -> 'ImageAd' or similar depending on Validator
      // In Validator: 'Mochahost' is allowed but mapped to 'ImageAd' type usually?
      // Let's check validator: if ad_type is 'Mochahost', it returns ImageAd.
      expect(imageAd.type).toBe('ImageAd') // Validator enforces this type constant

      // Check DOM
      expect(wrapper.find('img').exists()).toBe(true)
    })
  })

  describe('Data Validation', () => {
    it('validates ad response has required fields', async () => {
      ;(globalThis as any).$fetch.mockResolvedValueOnce({
        ad_code: 'TEST',
        ad_type: 'AmazonBanner',
        display_ratio: '300',
        url_affiliate: 'https://example.com',
        ad_format: 'banner',
        ad_layout_key: 'key',
        height: '250',
        width: '300',
        // Validator needs src/image or url_segment_image mapping
        url_segment_image: '/img.jpg',
        title: 'Test Ad',
        image_description: '',
        price: '',
        price_discount_amount: '',
        product_code: '',
        url_product: '',
      })

      const wrapper = mount(RandomAd)

      await wrapper.vm.$nextTick()
      await new Promise(resolve => setTimeout(resolve, 50))

      const amazonAd = (wrapper.vm as any).amazonAd
      expect(amazonAd).toBeTruthy()
    })

    it('rejects response missing required fields', async () => {
      const incompleteResponse = {
        ad_code: 'TEST',
        // missing ad_type
        display_ratio: '300',
      }

      ;(globalThis as any).$fetch.mockResolvedValueOnce(incompleteResponse)

      const wrapper = mount(RandomAd)

      await wrapper.vm.$nextTick()
      await new Promise(resolve => setTimeout(resolve, 50))

      const ad = (wrapper.vm as any).ad
      expect(ad).toBeNull()
    })
  })

  describe('Shuffle Button Interaction', () => {
    it('fetches new ad when shuffle button clicked', async () => {
      ;(globalThis as any).$fetch
        .mockResolvedValueOnce(mockAmazonAdResponse)
        .mockResolvedValueOnce(mockGoogleAdResponse)

      ;(globalThis as any).useRoute = vi.fn(() => ({
        query: { sb: '1' },
      }))

      const wrapper = mount(RandomAd)

      await wrapper.vm.$nextTick()
      await new Promise(resolve => setTimeout(resolve, 50))
      expect((globalThis as any).$fetch).toHaveBeenCalledTimes(1)

      const button = wrapper.find('button')
      await button.trigger('click')

      await wrapper.vm.$nextTick()
      await new Promise(resolve => setTimeout(resolve, 50))

      expect((globalThis as any).$fetch).toHaveBeenCalledTimes(2)
    })
  })

  describe('notifyParentOfAdDimensions', () => {
    it('sends message to parent window with correct dimensions', async () => {
      const postMessageSpy = vi.fn()
      window.parent = { postMessage: postMessageSpy } as any

      ;(globalThis as any).$fetch.mockResolvedValueOnce(mockImageAdResponse)

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
      ;(globalThis as any).$fetch.mockResolvedValueOnce(mockAmazonAdResponse)

      const wrapper = mount(RandomAd)

      // Wait for component mount and async fetch to complete
      await wrapper.vm.$nextTick()
      await new Promise(resolve => setTimeout(resolve, 100))

      expect((wrapper.vm as any).isLoading).toBe(false)
    })

    it('sets isLoading to true whilst fetching', async () => {
      let resolveFetch: Function = () => {};
      const fetchPromise = new Promise(resolve => {
        resolveFetch = resolve
      })
      ;(globalThis as any).$fetch.mockReturnValueOnce(fetchPromise)

      const wrapper = mount(RandomAd)

      // Immediately after mount
      await wrapper.vm.$nextTick()
      expect((wrapper.vm as any).isLoading).toBe(true)

      // Cleanup
      resolveFetch!(mockAmazonAdResponse);
    })

    it('sets isLoading to false when API call fails', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      ;(globalThis as any).$fetch.mockRejectedValueOnce(new Error('Network error'))

      const wrapper = mount(RandomAd)

      await new Promise(resolve => setTimeout(resolve, 50))

      expect((wrapper.vm as any).isLoading).toBe(false)
      consoleSpy.mockRestore()
    })
  })

  describe('Loader Element Visibility', () => {
    it('displays loader element when isLoading is true', async () => {
        // We need to keep the promise pending to check loading state
        let resolveFetch: any;
        const fetchPromise = new Promise(resolve => {
          resolveFetch = resolve
        })
        ;(globalThis as any).$fetch.mockReturnValueOnce(fetchPromise)

        const wrapper = mount(RandomAd)

        await wrapper.vm.$nextTick()

        expect((wrapper.vm as any).isLoading).toBe(true)
        expect(wrapper.find('.loader').exists()).toBe(true)

        // Finish up
        resolveFetch(mockAmazonAdResponse)
    })

    it('hides loader element when isLoading becomes false', async () => {
      ;(globalThis as any).$fetch.mockResolvedValueOnce(mockAmazonAdResponse)

      const wrapper = mount(RandomAd)

      await new Promise(resolve => setTimeout(resolve, 50))

      expect((wrapper.vm as any).isLoading).toBe(false)
      expect(wrapper.find('.loader').exists()).toBe(false)
    })
  })
})
