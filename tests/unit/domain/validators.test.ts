// tests/unit/domain/validators.test.ts
import { describe, it, expect } from 'vitest';
import { validateAd, validateAmazonAd, validateGoogleAd, validateImageAd } from '../../../domain/ads/validators';

describe('Domain Validators', () => {

  describe('validateAmazonAd', () => {
    it('should validate a correct Amazon ad', () => {
      const raw = {
        ad_type: 'AmazonBanner',
        src: 'https://amazon.com/image.jpg',
        href: 'https://amazon.com/product',
        width: 300,
        height: 250,
        title: 'Buy this'
      };

      const result = validateAmazonAd(raw);
      expect(result.isOk).toBe(true);
      if (result.isOk) {
        expect(result.value.type).toBe('AmazonBanner');
        expect(result.value.imageUrl).toBe(raw.src);
        expect(result.value.displayRatio).toBe(250/300);
      }
    });

    it('should fail with missing src', () => {
      const raw = { ad_type: 'AmazonBanner', href: 'url' };
      const result = validateAmazonAd(raw);
      expect(result.isErr).toBe(true);
    });
  });

  describe('validateGoogleAd', () => {
    it('should validate a correct Google ad', () => {
      const raw = {
        ad_type: 'GoogleAdSense',
        ad_slot: '1234567890',
        ad_layout_key: '-gw-1+2a-9x+5c'
      };

      const result = validateGoogleAd(raw);
      expect(result.isOk).toBe(true);
      if (result.isOk) {
        expect(result.value.type).toBe('GoogleAdSense');
        expect(result.value.layoutKey).toBe(raw.ad_layout_key);
      }
    });

    it('should fail with incorrect type', () => {
      const raw = { ad_type: 'Other', ad_slot: '123' };
      const result = validateGoogleAd(raw);
      expect(result.isErr).toBe(true);
    });
  });

  describe('validateImageAd', () => {
    it('should validate a Mochahost ad as ImageAd', () => {
      const raw = {
        ad_type: 'Mochahost',
        image: 'https://mocha.com/img.png',
        link: 'https://mocha.com',
        width: 100,
        height: 100
      };

      const result = validateImageAd(raw);
      expect(result.isOk).toBe(true);
      if (result.isOk) {
        expect(result.value.type).toBe('ImageAd');
        expect(result.value.imageUrl).toBe(raw.image);
      }
    });
  });

  describe('validateAd Dispatcher', () => {
    it('should dispatch to correct validator based on ad_type', () => {
      const raw = {
        ad_type: 'AmazonBanner',
        src: 'img',
        href: 'link'
      };
      const result = validateAd(raw);
      expect(result.isOk).toBe(true);
      if (result.isOk) {
          expect(result.value.type).toBe('AmazonBanner');
      }
    });

    it('should return error for unknown type', () => {
      const raw = { ad_type: 'Unknown' };
      const result = validateAd(raw);
      expect(result.isErr).toBe(true);
    });
  });

});
