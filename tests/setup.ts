/**
 * Vitest setup file for mocking Nuxt composables and components
 */
import { vi } from 'vitest';
import { config } from '@vue/test-utils';
import { reactive, ref, computed, watch, onMounted, onUnmounted } from 'vue';

// Create mocked functions
const mockUseRoute = vi.fn(() => ({
  query: {},
}));

const mockUseRuntimeConfig = vi.fn(() => ({
  public: {
    adClient: 'test-client-id',
    adsServer: 'http://localhost/api',
  },
}));

const mockUseUtility = vi.fn(() => ({
  currentFileName: 'RandomAd.vue',
}));

const mockAdControllerState = {
  isLoading: ref(false),
  ad: ref(null),
  error: ref(null),
};

const mockFetchAd = vi.fn(async () => {});

const resetMockAdController = () => {
  mockAdControllerState.isLoading.value = false;
  mockAdControllerState.ad.value = null;
  mockAdControllerState.error.value = null;
  mockFetchAd.mockReset();
  mockFetchAd.mockImplementation(async () => {});
};

const mockUseAdController = vi.fn(() => ({
  isLoading: mockAdControllerState.isLoading,
  ad: mockAdControllerState.ad,
  error: mockAdControllerState.error,
  fetchAd: mockFetchAd,
}));

// Make mocked functions and Vue functions available globally
(globalThis as any).useRoute = mockUseRoute;
(globalThis as any).useRuntimeConfig = mockUseRuntimeConfig;
(globalThis as any).useUtility = mockUseUtility;
(globalThis as any).useAdController = mockUseAdController;
(globalThis as any).reactive = reactive;
(globalThis as any).ref = ref;
(globalThis as any).computed = computed;
(globalThis as any).watch = watch;
(globalThis as any).onMounted = onMounted;
(globalThis as any).onUnmounted = onUnmounted;

// Mock global $fetch
(globalThis as any).$fetch = () => Promise.resolve({});

// Expose mock controller for tests
(globalThis as any).__mockAdController = {
  state: mockAdControllerState,
  fetchAd: mockFetchAd,
  reset: resetMockAdController,
};

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
};
