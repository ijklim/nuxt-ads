import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { AdRepository } from '../../../infrastructure/repositories/AdRepository';
import type { IConfigProvider } from '../../../application/ports/IConfigProvider';

// Mock ConfigProvider
const mockConfigProvider: IConfigProvider = {
  getAdsServerUrl: vi.fn(() => 'http://test-server.com'),
  getAdClient: vi.fn(() => 'test-client'),
};

describe('AdRepository', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    // Reset mapped implementation of config provider methods if needed
    (mockConfigProvider.getAdsServerUrl as any).mockReturnValue('http://test-server.com');
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should fetch data using correct URL and parameters', async () => {
    // Mock global $fetch
    const mockFetch = vi.fn().mockResolvedValue({
      ad_type: 'AmazonBanner',
      id: '123',
      url_segment_image: '/img.png',
      url_affiliate: 'http://amazon.com',
      title: 'Amazon Ad',
      height: 100,
      width: 100
    });
    (globalThis as any).$fetch = mockFetch;

    const repo = new AdRepository(mockConfigProvider);
    await repo.fetchRandom({ foo: 'bar' });

    expect(mockFetch).toHaveBeenCalledTimes(1);
    // URL check: http://test-server.com/api/ads?random=1&foo=bar
    // Note: URLSearchParams order might vary, so we check inclusion
    const calledUrl = mockFetch.mock.calls?.[0]?.[0] as string;
    expect(calledUrl).toBeDefined();
    expect(calledUrl).toContain('http://test-server.com/api/ads?');
    expect(calledUrl).toContain('random=1');
    expect(calledUrl).toContain('foo=bar');
  });

  it('should return a valid Ad when API returns valid Amazon schema', async () => {
    const mockData = {
      ad_type: 'AmazonBanner',
      id: 999,
      url_segment_image: '/amazon.jpg',
      url_affiliate: 'http://amazon.com/product',
      title: 'Buy This',
      height: '50',
      width: '300',
      price: '19.99'
    };

    (globalThis as any).$fetch = vi.fn().mockResolvedValue(mockData);

    const repo = new AdRepository(mockConfigProvider);
    const result = await repo.fetchRandom();

    expect(result.isOk).toBe(true);
    if (result.isOk && result.value.type === 'AmazonBanner') {
       expect(result.value.imageUrl).toBe('http://test-server.com/amazon.jpg'); // Mapped
       expect(result.value.href).toBe('http://amazon.com/product');
    }
  });

  it('should return a valid Ad when API returns valid Google schema', async () => {
     const mockData = {
        ad_type: 'GoogleAdSense',
        ad_code: '123456',
        ad_layout_key: 'key-abc',
        ad_format: 'auto'
     };

    (globalThis as any).$fetch = vi.fn().mockResolvedValue(mockData);

     const repo = new AdRepository(mockConfigProvider);
     const result = await repo.fetchRandom();

     expect(result.isOk).toBe(true);
     if (result.isOk && result.value.type === 'GoogleAdSense') {
         expect(result.value.slot).toBe(123456);
         expect(result.value.layoutKey).toBe('key-abc');
     }
  });

  it('should return errorResult if fetch fails', async () => {
    (globalThis as any).$fetch = vi.fn().mockRejectedValue(new Error('Network Error'));

     const repo = new AdRepository(mockConfigProvider);
     const result = await repo.fetchRandom();

     expect(result.isErr).toBe(true);
     if (result.isErr) {
         expect(result.error.message).toBe('Network Error');
     }
  });

  it('should return errorResult if validation fails', async () => {
      // Missing required fields
      (globalThis as any).$fetch = vi.fn().mockResolvedValue({ ad_type: 'AmazonBanner' });

      const repo = new AdRepository(mockConfigProvider);
      const result = await repo.fetchRandom();

      expect(result.isErr).toBe(true);
      // ValidationError
  });
});
