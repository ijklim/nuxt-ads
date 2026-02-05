/**
 * Vitest setup file for mocking Nuxt composables and components
 */
import { vi } from 'vitest'
import { config } from '@vue/test-utils'
import { reactive, ref, computed, watch, onMounted, onUnmounted } from 'vue'

// Create mocked functions
const mockUseRoute = vi.fn(() => ({
  query: {},
}))

const mockUseRuntimeConfig = vi.fn(() => ({
  public: {
    adClient: 'test-client-id',
    adsServer: 'http://localhost/api',
  },
}))

const mockUseUtility = vi.fn(() => ({
  currentFileName: 'RandomAd.vue',
}))

import { useAdController } from '../composables/useAdController'

// Make mocked functions and Vue functions available globally
vi.stubGlobal('useRoute', mockUseRoute)
vi.stubGlobal('useRuntimeConfig', mockUseRuntimeConfig)
vi.stubGlobal('useUtility', mockUseUtility)
vi.stubGlobal('useAdController', useAdController)
vi.stubGlobal('reactive', reactive)
vi.stubGlobal('ref', ref)
vi.stubGlobal('computed', computed)
vi.stubGlobal('watch', watch)
vi.stubGlobal('onMounted', onMounted)
vi.stubGlobal('onUnmounted', onUnmounted)

// Mock global $fetch
vi.stubGlobal('$fetch', vi.fn())

// Configure global stubs for Nuxt/Vue components
config.global.stubs = {
  GoogleAdSense: {
    template: '<div class="google-ad-stub"><slot /></div>',
  },
  AmazonBanner: {
    template: '<div class="amazon-banner-stub"><slot /></div>',
  },
  NuxtLink: {
    template: '<a class="nuxt-link-stub"><slot /></a>',
    props: ['to'],
  },
}
