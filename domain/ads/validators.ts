import { Result } from '../shared/result';
import { ValidationError } from '../shared/errors';
import type { Ad, AmazonAd, GoogleAd, ImageAd } from './types';

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

export function validateAmazonAd(data: unknown): Result<AmazonAd, ValidationError> {
  if (!isObject(data)) {
    return Result.err(new ValidationError('Invalid data: must be an object'));
  }

  // Required fields check
  if (data.ad_type !== 'AmazonBanner') {
    return Result.err(new ValidationError('Invalid type for AmazonAd'));
  }
  if (!data.src || typeof data.src !== 'string') {
    return Result.err(new ValidationError('Missing or invalid "src" (imageUrl)'));
  }
  if (!data.href || typeof data.href !== 'string') {
    return Result.err(new ValidationError('Missing or invalid "href"'));
  }

  // Mapping and strict typing
  const ad: AmazonAd = {
    id: data.id ? String(data.id) : crypto.randomUUID(), // Assuming global crypto or polyfilled
    type: 'AmazonBanner',
    displayRatio: 0, // Should calculate or be provided. Defaulting for now.
    height: Number(data.height) || 0,
    width: Number(data.width) || 0,
    href: data.href,
    imageUrl: data.src,
    imageAlt: typeof data.title === 'string' ? data.title : 'Ad',
    imageDescription: typeof data.description === 'string' ? data.description : undefined,
    price: data.price ? Number(data.price) : undefined,
    discountAmount: typeof data.discount_amount === 'string' ? data.discount_amount : undefined,
  };

  if (ad.width > 0 && ad.height > 0) {
      ad.displayRatio = ad.height / ad.width;
  }

  return Result.ok(ad);
}

export function validateGoogleAd(data: unknown): Result<GoogleAd, ValidationError> {
  if (!isObject(data)) {
    return Result.err(new ValidationError('Invalid data: must be an object'));
  }

  if (data.ad_type !== 'GoogleAdSense') {
    return Result.err(new ValidationError('Invalid type for GoogleAd'));
  }
  if (!data.ad_slot) {
    return Result.err(new ValidationError('Missing ad_slot'));
  }
  if (!data.ad_layout_key && !data.data_ad_layout_key) {
      // Some flexibility for API variations
      return Result.err(new ValidationError('Missing layout key'));
  }

  const ad: GoogleAd = {
    id: data.id ? String(data.id) : crypto.randomUUID(),
    type: 'GoogleAdSense',
    displayRatio: 0, // Not typically used for responsive Google ads
    format: typeof data.ad_format === 'string' ? data.ad_format : 'auto',
    layoutKey: String(data.ad_layout_key || data.data_ad_layout_key),
    slot: Number(data.ad_slot)
  };

  return Result.ok(ad);
}

export function validateImageAd(data: unknown): Result<ImageAd, ValidationError> {
  if (!isObject(data)) {
    return Result.err(new ValidationError('Invalid data: must be an object'));
  }

  if (data.ad_type !== 'ImageAd' && data.ad_type !== 'Mochahost') {
      // Supporting legacy 'Mochahost' mapping if needed, or strict?
      // Let's stick to the types, but maybe the API returns 'Mochahost'.
      // For now, strict on what we expect, or flexible?
      // Let's assume the API might say 'Mochahost' for ImageAd equivalent.
      if (data.ad_type !== 'Mochahost') {
         return Result.err(new ValidationError('Invalid type for ImageAd'));
      }
  }

  if (!data.image || typeof data.image !== 'string') {
      return Result.err(new ValidationError('Missing image URL'));
  }
  if (!data.link || typeof data.link !== 'string') {
      return Result.err(new ValidationError('Missing link URL'));
  }

  const ad: ImageAd = {
      id: data.id ? String(data.id) : crypto.randomUUID(),
      type: 'ImageAd',
      displayRatio: 0,
      height: Number(data.height) || 0,
      width: Number(data.width) || 0,
      href: data.link,
      imageUrl: data.image,
      imageAlt: typeof data.title === 'string' ? data.title : 'Ad'
  };

  if (ad.width > 0 && ad.height > 0) {
      ad.displayRatio = ad.height / ad.width;
  }

  return Result.ok(ad);
}

export function validateAd(data: unknown): Result<Ad, ValidationError> {
    if (!isObject(data)) {
        return Result.err(new ValidationError('Invalid data'));
    }

    switch (data.ad_type) {
        case 'AmazonBanner':
            return validateAmazonAd(data);
        case 'GoogleAdSense':
            return validateGoogleAd(data);
        case 'Mochahost':
        case 'ImageAd':
            return validateImageAd(data);
        default:
            return Result.err(new ValidationError(`Unknown ad type: ${data.ad_type}`));
    }
}
