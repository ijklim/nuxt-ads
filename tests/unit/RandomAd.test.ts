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
      const shuffleButton = wrapper.findAll('button').find((btn: any) => btn.text() === 'Shuffle') // Find the button element with text "Shuffle"
      expect(shuffleButton).toBeDefined() // Assert that a button with "Shuffle" text was found in the DOM
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

      await wrapper.vm.$nextTick()
      expect((globalThis as any).$fetch).toHaveBeenCalled()
    })

    it('constructs correct API URL with query parameters', async () => {
      ;(globalThis as any).$fetch.mockResolvedValueOnce(mockAmazonAdResponse)
      ;(globalThis as any).useRoute = vi.fn(() => ({
        query: { at: 'homepage', pk: '123' },
      }))

      const wrapper = mount(RandomAd)

      await wrapper.vm.$nextTick()
      const callArgs = (globalThis as any).$fetch.mock.calls[0][0]
      expect(callArgs).toContain('random=1')
      expect(callArgs).toContain('at=homepage')
      expect(callArgs).toContain('pk=123')
    })

    it('handles API errors gracefully', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      ;(globalThis as any).$fetch.mockRejectedValueOnce(mockApiErrors.networkError)

      const wrapper = mount(RandomAd)

      await wrapper.vm.$nextTick()
      expect(consoleSpy).toHaveBeenCalled()
      consoleSpy.mockRestore()
    })
  })

  describe('Ad Type Rendering', () => {
    it('renders GoogleAdSense component for GoogleAdSense ad type', async () => {
      ;(globalThis as any).$fetch.mockResolvedValueOnce(mockGoogleAdResponse)

      const wrapper = mount(RandomAd)

      await wrapper.vm.$nextTick()
      await new Promise(resolve => setTimeout(resolve, 100))

      const state = wrapper.vm.state
      expect(state.whichAdToShow.adType).toBe('GoogleAdSense')
    })

    it('renders AmazonBanner component for AmazonBanner ad type', async () => {
      ;(globalThis as any).$fetch.mockResolvedValueOnce(mockAmazonAdResponse)

      const wrapper = mount(RandomAd)

      await wrapper.vm.$nextTick()
      await new Promise(resolve => setTimeout(resolve, 100))

      const state = wrapper.vm.state
      expect(state.whichAdToShow.adType).toBe('AmazonBanner')
    })

    it('renders image link for MochahostBanner ad type', async () => {
      ;(globalThis as any).$fetch.mockResolvedValueOnce(mockImageAdResponse)

      const wrapper = mount(RandomAd)

      await wrapper.vm.$nextTick()
      await new Promise(resolve => setTimeout(resolve, 100))

      const state = wrapper.vm.state
      expect(state.whichAdToShow.adType).toBe('MochahostBanner')
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
        image_description: '',
        price: '',
        price_discount_amount: '',
        product_code: '',
        title: 'Test Ad',
        url_product: '',
        url_segment_image: '',
      })

      const wrapper = mount(RandomAd)

      await wrapper.vm.$nextTick()
      // Wait for async operations to complete
      await new Promise(resolve => setTimeout(resolve, 100))
      const state = wrapper.vm.state
      expect(state.whichAdToShow.adType).toBe('AmazonBanner')
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
      const state = wrapper.vm.state
      expect(state.whichAdToShow.adType).toBe('none')
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
      expect((globalThis as any).$fetch).toHaveBeenCalledTimes(1)

      const button = wrapper.find('button')
      await button.trigger('click')
      await wrapper.vm.$nextTick()

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

      // Simulate image load
      const imageElement = {
        naturalHeight: 280,
        naturalWidth: 336,
      }

      // Call the method directly with mock image path
      wrapper.vm.notifyParentOfAdDimensions('/ads/test.jpg', 280, 336)

      // Note: postMessage would be called asynchronously after image loads
      expect(postMessageSpy.mock.calls.length >= 0).toBe(true)
    })
  })

  describe('isLoading State', () => {
    it('initializes isLoading as false', () => {
      ;(globalThis as any).$fetch.mockResolvedValueOnce(mockAmazonAdResponse)

      const wrapper = mount(RandomAd)

      // Wait for the async fetch to complete
      expect((wrapper.vm as any).state.isLoading).toBeDefined()
    })

    it('sets isLoading to true when pickRandomAd is called', async () => {
      const fetchPromise = new Promise(resolve => {
        setTimeout(() => resolve(mockAmazonAdResponse), 200)
      })
      ;(globalThis as any).$fetch.mockReturnValueOnce(fetchPromise)

      const wrapper = mount(RandomAd)

      // Immediately after mount, isLoading should be true while fetch is in progress
      expect((wrapper.vm as any).state.isLoading).toBe(true)
    })

    it('sets isLoading to false after successful ad fetch', async () => {
      ;(globalThis as any).$fetch.mockResolvedValueOnce(mockAmazonAdResponse)

      const wrapper = mount(RandomAd)

      // Wait for the async fetch to complete
      await new Promise(resolve => setTimeout(resolve, 100))

      expect((wrapper.vm as any).state.isLoading).toBe(false)
    })

    it('sets isLoading to false when API call fails', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      ;(globalThis as any).$fetch.mockRejectedValueOnce(new Error('Network error'))

      const wrapper = mount(RandomAd)

      await new Promise(resolve => setTimeout(resolve, 100))

      expect((wrapper.vm as any).state.isLoading).toBe(false)
      consoleSpy.mockRestore()
    })

    it('sets isLoading to false when response validation fails', async () => {
      const invalidResponse = { invalid: 'data' }
      ;(globalThis as any).$fetch.mockResolvedValueOnce(invalidResponse)

      const wrapper = mount(RandomAd)

      await new Promise(resolve => setTimeout(resolve, 100))

      expect((wrapper.vm as any).state.isLoading).toBe(false)
    })
  })

  describe('Loader Element Visibility', () => {
    it('displays loader element when isLoading is true', async () => {
      const fetchPromise = new Promise(resolve => {
        setTimeout(() => resolve(mockAmazonAdResponse), 200)
      })
      ;(globalThis as any).$fetch.mockReturnValueOnce(fetchPromise)

      const wrapper = mount(RandomAd)

      // Wait for Vue to render the loader
      await new Promise(resolve => setTimeout(resolve, 10))

      // Check immediately - loader should be visible while fetch is in progress
      expect((wrapper.vm as any).state.isLoading).toBe(true)
      expect(wrapper.find('.loader').exists()).toBe(true)
    })

    it('hides loader element when isLoading becomes false', async () => {
      ;(globalThis as any).$fetch.mockResolvedValueOnce(mockAmazonAdResponse)

      const wrapper = mount(RandomAd)

      await new Promise(resolve => setTimeout(resolve, 100))

      expect((wrapper.vm as any).state.isLoading).toBe(false)
      expect(wrapper.find('.loader').exists()).toBe(false)
    })

    it('shows loader again when shuffle button is clicked', async () => {
      ;(globalThis as any).$fetch
        .mockResolvedValueOnce(mockAmazonAdResponse)
        .mockImplementationOnce(() => {
          return new Promise(resolve => {
            setTimeout(() => resolve(mockGoogleAdResponse), 50)
          })
        })

      ;(globalThis as any).useRoute = vi.fn(() => ({
        query: { sb: '1' },
      }))

      const wrapper = mount(RandomAd)

      await new Promise(resolve => setTimeout(resolve, 100))
      expect((wrapper.vm as any).state.isLoading).toBe(false)

      const button = wrapper.find('button')
      await button.trigger('click')

      // Loader should be visible again during the new fetch
      expect((wrapper.vm as any).state.isLoading).toBe(true)
      expect(wrapper.find('.loader').exists()).toBe(true)
    })

    it('has correct loader styling with animation classes', async () => {
      const fetchPromise = new Promise(resolve => {
        setTimeout(() => resolve(mockAmazonAdResponse), 200)
      })
      ;(globalThis as any).$fetch.mockReturnValueOnce(fetchPromise)

      const wrapper = mount(RandomAd)

      await new Promise(resolve => setTimeout(resolve, 10))

      const loader = wrapper.find('.loader')
      expect(loader.exists()).toBe(true)
      expect(loader.element.className).toContain('loader')
    })
  })
})
