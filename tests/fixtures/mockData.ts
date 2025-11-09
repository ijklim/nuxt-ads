/**
 * Test fixtures and mock data for ad server testing
 */

export const mockAmazonAdResponse = {
  ad_code: 'AMAZON-001',
  ad_format: 'banner',
  ad_layout_key: 'amazon_layout',
  ad_type: 'AmazonBanner',
  display_ratio: '300x250',
  height: '250',
  image_description: 'Premium laptop',
  price: '999.99',
  price_discount_amount: '100',
  product_code: 'PROD-123',
  title: 'High-performance Laptop',
  url_affiliate: 'https://amazon.com/dp/B123456789',
  url_product: 'https://amazon.com/dp/B123456789',
  url_segment_image: '/ads/amazon/laptop.jpg',
  width: '300',
};

export const mockGoogleAdResponse = {
  ad_code: '1234567890',
  ad_format: 'responsive',
  ad_layout_key: 'google_layout_key',
  ad_type: 'GoogleAdSense',
  display_ratio: '728x90',
  height: '90',
  image_description: '',
  price: '',
  price_discount_amount: '',
  product_code: '',
  title: 'Google AdSense Ad',
  url_affiliate: '',
  url_product: '',
  url_segment_image: '',
  width: '728',
};

export const mockImageAdResponse = {
  ad_code: '',
  ad_format: 'image',
  ad_layout_key: '',
  ad_type: 'MochahostBanner',
  display_ratio: '336x280',
  height: '280',
  image_description: 'Web hosting services',
  price: '',
  price_discount_amount: '',
  product_code: '',
  title: 'Reliable Web Hosting',
  url_affiliate: 'https://mochahost.com',
  url_product: 'https://mochahost.com',
  url_segment_image: '/ads/mochahost/banner.png',
  width: '336',
};

export const mockEmptyAdResponse = {
  ad_code: '',
  ad_format: '',
  ad_layout_key: '',
  ad_type: 'none',
  display_ratio: '0',
  height: '0',
  image_description: '',
  price: '',
  price_discount_amount: '',
  product_code: '',
  title: '',
  url_affiliate: '',
  url_product: '',
  url_segment_image: '',
  width: '0',
};

export const mockApiErrors = {
  networkError: new Error('Network request failed'),
  timeoutError: new Error('Request timeout'),
  serverError: {
    status: 500,
    message: 'Internal server error',
  },
  notFoundError: {
    status: 404,
    message: 'Ads not found',
  },
};

export const testQueryParams = {
  valid: {
    random: '1',
    at: 'homepage',
    pk: '123',
    sb: '1',
  },
  empty: {},
  withSpecialChars: {
    at: 'test%20page',
    pk: 'id&value=123',
  },
};
