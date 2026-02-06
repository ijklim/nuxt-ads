import { ref } from 'vue';
import { FetchRandomAdUseCase } from '../application/use-cases/FetchRandomAd';
import { AdRepository } from '../infrastructure/repositories/AdRepository';
import { NuxtConfigProvider } from '../infrastructure/config/NuxtConfigProvider';
import { validateQueryParameters, validateRuntimeConfig } from '../infrastructure/security/validators';
import type { Ad } from '../domain/ads/types';

export const useAdController = () => {
  const isLoading = ref(false);
  const ad = ref<Ad | null>(null);
  const error = ref<Error | null>(null);

  // Validate runtime config once during composable initialization
  const configProvider = new NuxtConfigProvider();
  const config = {
    adsServer: configProvider.getAdsServerUrl(),
    adClient: configProvider.getAdClient()
  };
  const configValidation = validateRuntimeConfig(config);
  const configValid = configValidation.isOk;
  if (!configValid) {
    error.value = configValidation.error;
    console.error('Invalid configuration:', configValidation.error);
  }

  // Initialize dependencies once during composable initialization (if config is valid)
  const repository = configValid ? new AdRepository(configProvider) : null;
  const useCase = configValid ? new FetchRandomAdUseCase(repository!) : null; // Non-null assertion (!): repository is guaranteed non-null when configValid is true

  const fetchAd = async (filters: Record<string, string> = {}) => {
    // If config is invalid, don't attempt to fetch
    if (!configValid) {
      return;
    }

    isLoading.value = true;
    error.value = null; // Clear previous errors
    ad.value = null;

    try {
      // Validate query parameters against whitelist (Phase 5 Security)
      const filterValidation = validateQueryParameters(filters);
      if (filterValidation.isErr) {
        error.value = filterValidation.error;
        console.error('Invalid query parameters:', filterValidation.error);
        return;
      }

      const result = await useCase!.execute(filterValidation.value); // Non-null assertion (!): useCase is guaranteed non-null when configValid is true

      if (result.isOk) {
        ad.value = result.value;
      } else {
        error.value = result.error;
        console.error('Failed to fetch ad:', result.error);
      }
    } catch (e) {
      error.value = e instanceof Error ? e : new Error(String(e));
      console.error('Unexpected error in fetchAd:', e);
    } finally {
      isLoading.value = false;
    }
  };

  return {
    isLoading,
    ad,
    error,
    fetchAd
  };
};
