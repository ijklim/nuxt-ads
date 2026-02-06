import type { IAdRepository } from '../../application/ports/IAdRepository';
import type { IConfigProvider } from '../../application/ports/IConfigProvider';
import { Result } from '../../domain/shared/result';
import { validateAd } from '../../domain/ads/validators';
import type { Ad } from '../../domain/ads/types';

/**
 * API response shape from Laravel backend
 */
interface ApiAdResponse {
  ad_type: 'GoogleAdSense' | 'AmazonBanner' | 'Mochahost' | 'ImageAd' | 'MochahostBanner';
  ad_code?: string;
  ad_layout_key?: string;
  ad_format?: string;
  url_segment_image?: string;
  url_affiliate?: string;
  url_product?: string;
  title?: string;
  image_description?: string;
  price_discount_amount?: number;
  [key: string]: any;
}

export class AdRepository implements IAdRepository {
  constructor(private configProvider: IConfigProvider) {}

  async fetchRandom(filters?: Record<string, string>): Promise<Result<Ad, Error>> {
    try {
      const baseUrl = this.configProvider.getAdsServerUrl();
      if (!baseUrl) {
        return Result.err(new Error('Ads server URL is not configured'));
      }

      const params = new URLSearchParams();
      params.append('random', '1');

      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          params.append(key, value);
        });
      }

      const url = `${baseUrl}/api/ads?${params.toString()}`;

      // Using global $fetch provided by Nuxt
      const response = await $fetch<ApiAdResponse>(url);

      const mappedData = this.mapApiResponse(response, baseUrl);

      // Using the Domain Validator
      const validationResult = validateAd(mappedData);

      return validationResult;

    } catch (error) {
      return Result.err(error instanceof Error ? error : new Error(String(error)));
    }
  }

  private mapApiResponse(data: ApiAdResponse, baseUrl: string): any {
    if (!data || typeof data !== 'object') return data;

    // Common transformations
    const mapped: any = { ...data };

    // Validates against what domain/ads/validators.ts expects

    // Map 'url_segment_image' to 'image/src'
    // Validator expects: 'image' (ImageAd) or 'src' (Amazon)
    // Let's standardize based on ad_type

    if (data.ad_type === 'AmazonBanner') {
       mapped.src = data.url_segment_image ? `${baseUrl}${data.url_segment_image}` : undefined;
       mapped.href = data.url_affiliate || data.url_product;
       mapped.title = data.title; // Validator uses title if available
       mapped.description = data.image_description;
       mapped.discount_amount = data.price_discount_amount;
    } else if (data.ad_type === 'GoogleAdSense') {
       // Validator expects: ad_slot, ad_layout_key, ad_format
       // API response has these keys in snake_case likely matching what we need
       // But validator checks data.ad_slot etc.
       // In RandomAd.vue: apiResponse.ad_code was mapped to adSlot
       mapped.ad_slot = data.ad_code;
       mapped.ad_layout_key = data.ad_layout_key;
       mapped.ad_format = data.ad_format;
     } else if (data.ad_type === 'Mochahost' || data.ad_type === 'ImageAd' || data.ad_type === 'MochahostBanner') {
       // Normalize MochahostBanner to Mochahost for backward compatibility
       if (data.ad_type === 'MochahostBanner') {
        mapped.ad_type = 'Mochahost';
       }
       mapped.image = data.url_segment_image ? `${baseUrl}${data.url_segment_image}` : undefined;
       mapped.link = data.url_affiliate || data.url_product;
    }

    return mapped;
  }
}
