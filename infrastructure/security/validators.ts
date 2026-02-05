import { ValidationError } from '../../domain/shared/errors';
import { Result } from '../../domain/shared/result';

/**
 * Whitelist of allowed query parameters that can be passed to the ad server
 * Prevents injection attacks and unexpected behavior
 */
const ALLOWED_QUERY_PARAMS = new Set([
  'at',       // at (location tracking)
  'pk',       // pk (publisher key)
  'random',   // random (randomize ad selection)
  'category', // category filtering
  'sb',       // sb (shuffle button - shows refresh button on ad)
]);

/**
 * Validates query parameters against a whitelist
 * @param filters Record of query parameters
 * @returns Result with validated filters or ValidationError
 */
export function validateQueryParameters(
  filters: Record<string, string>
): Result<Record<string, string>, ValidationError> {
  if (!filters || Object.keys(filters).length === 0) {
    return Result.ok({});
  }

  const validatedFilters: Record<string, string> = {};

  for (const [key, value] of Object.entries(filters)) {
    // Check if parameter is in whitelist
    if (!ALLOWED_QUERY_PARAMS.has(key)) {
      return Result.err(
        new ValidationError(`Query parameter "${key}" is not allowed`)
      );
    }

    // Validate value is a string and not empty
    if (typeof value !== 'string' || value.trim() === '') {
      return Result.err(
        new ValidationError(`Query parameter "${key}" must be a non-empty string`)
      );
    }

    // Prevent extremely long values (DOS protection)
    if (value.length > 100) {
      return Result.err(
        new ValidationError(`Query parameter "${key}" exceeds maximum length`)
      );
    }

    validatedFilters[key] = value.trim();
  }

  return Result.ok(validatedFilters);
}

/**
 * Validates runtime configuration on startup
 * Ensures all required environment variables are present and valid
 */
export function validateRuntimeConfig(config: {
  adsServer?: string;
  adClient?: string;
}): Result<void, ValidationError> {
  if (!config.adsServer) {
    return Result.err(
      new ValidationError('Missing required config: NUXT_PUBLIC_ADS_SERVER')
    );
  }

  if (!config.adClient) {
    return Result.err(
      new ValidationError('Missing required config: NUXT_PUBLIC_AD_CLIENT')
    );
  }

  // Validate URL format
  try {
    new URL(config.adsServer);
  } catch {
    return Result.err(
      new ValidationError('Invalid ADS_SERVER URL format')
    );
  }

  // Ensure ad client is not empty
  if (config.adClient.trim() === '') {
    return Result.err(
      new ValidationError('AD_CLIENT cannot be empty')
    );
  }

  return Result.ok(undefined);
}
