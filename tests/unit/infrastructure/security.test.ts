import { describe, it, expect, beforeEach, vi } from 'vitest';
import { validateQueryParameters, validateRuntimeConfig } from '../../../infrastructure/security/validators';

describe('Security Validators', () => {
  describe('validateQueryParameters', () => {
    it('allows whitelisted parameters', () => {
      const filters = { at: 'homepage', pk: '123' };
      const result = validateQueryParameters(filters);

      expect(result.isOk).toBe(true);
      if (result.isOk) {
        expect(result.value).toEqual(filters);
      }
    });

    it('rejects non-whitelisted parameters', () => {
      const filters = { malicious: 'payload' };
      const result = validateQueryParameters(filters);

      expect(result.isErr).toBe(true);
      if (result.isErr) {
        expect(result.error.message).toContain('not allowed');
      }
    });

    it('rejects empty or whitespace values', () => {
      const filters = { at: '  ' };
      const result = validateQueryParameters(filters);

      expect(result.isErr).toBe(true);
    });

    it('rejects extremely long values (DOS protection)', () => {
      const filters = { at: 'a'.repeat(101) };
      const result = validateQueryParameters(filters);

      expect(result.isErr).toBe(true);
      if (result.isErr) {
        expect(result.error.message).toContain('exceeds maximum length');
      }
    });

    it('handles empty filters object', () => {
      const result = validateQueryParameters({});
      expect(result.isOk).toBe(true);
    });

    it('trims whitespace from values', () => {
      const filters = { at: '  homepage  ' };
      const result = validateQueryParameters(filters);

      expect(result.isOk).toBe(true);
      if (result.isOk) {
        expect(result.value.at).toBe('homepage');
      }
    });
  });

  describe('validateRuntimeConfig', () => {
    it('accepts valid configuration', () => {
      const config = {
        adsServer: 'https://ads.example.com',
        adClient: 'ca-pub-123456789',
      };

      const result = validateRuntimeConfig(config);
      expect(result.isOk).toBe(true);
    });

    it('rejects missing adsServer', () => {
      const config = { adClient: 'ca-pub-123456789' };

      const result = validateRuntimeConfig(config);
      expect(result.isErr).toBe(true);
      if (result.isErr) {
        expect(result.error.message).toContain('NUXT_PUBLIC_ADS_SERVER');
      }
    });

    it('rejects missing adClient', () => {
      const config = { adsServer: 'https://ads.example.com' };

      const result = validateRuntimeConfig(config);
      expect(result.isErr).toBe(true);
      if (result.isErr) {
        expect(result.error.message).toContain('NUXT_PUBLIC_AD_CLIENT');
      }
    });

    it('rejects invalid URL format', () => {
      const config = {
        adsServer: 'not-a-valid-url',
        adClient: 'ca-pub-123456789',
      };

      const result = validateRuntimeConfig(config);
      expect(result.isErr).toBe(true);
      if (result.isErr) {
        expect(result.error.message).toContain('URL format');
      }
    });

    it('rejects empty adClient', () => {
      const config = {
        adsServer: 'https://ads.example.com',
        adClient: '   ',
      };

      const result = validateRuntimeConfig(config);
      expect(result.isErr).toBe(true);
      if (result.isErr) {
        expect(result.error.message).toContain('empty');
      }
    });
  });
});
