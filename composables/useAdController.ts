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

    const fetchAd = async (filters: Record<string, string> = {}) => {
        isLoading.value = true;
        error.value = null;
        ad.value = null;

        try {
            // Validate query parameters against whitelist (Phase 5 Security)
            const filterValidation = validateQueryParameters(filters);
            if (filterValidation.isErr) {
                error.value = filterValidation.error;
                console.error('Invalid query parameters:', filterValidation.error);
                return;
            }

            // Initialize dependencies
            // Ideally this could be done via a DI container, but manual composition is fine here
            const configProvider = new NuxtConfigProvider();

            // Validate runtime config on first use (Phase 5 Security)
            const config = {
                adsServer: configProvider.getAdsServerUrl(),
                adClient: configProvider.getAdClient()
            };
            const configValidation = validateRuntimeConfig(config);
            if (configValidation.isErr) {
                error.value = configValidation.error;
                console.error('Invalid configuration:', configValidation.error);
                return;
            }

            const repository = new AdRepository(configProvider);
            const useCase = new FetchRandomAdUseCase(repository);

            const result = await useCase.execute(filterValidation.value);

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
