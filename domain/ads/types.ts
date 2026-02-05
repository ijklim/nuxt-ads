export type AdType = 'AmazonBanner' | 'GoogleAdSense' | 'ImageAd';

export interface BaseAd {
  id: string; // Often synthesized or from DB
  type: AdType;
  displayRatio: number; // e.g. 0.5 for 2:1
}

export interface AmazonAd extends BaseAd {
  type: 'AmazonBanner';
  height: number;
  width: number;
  href: string;
  imageUrl: string;
  imageAlt: string;
  imageDescription?: string;
  price?: number;
  discountAmount?: string;
}

export interface GoogleAd extends BaseAd {
  type: 'GoogleAdSense';
  format: string; // 'auto', 'fluid', 'rectangle'
  layoutKey: string;
  slot: number;
}

export interface ImageAd extends BaseAd {
  type: 'ImageAd';
  height: number;
  width: number;
  href: string;
  imageUrl: string;
  imageAlt: string;
}

export type Ad = AmazonAd | GoogleAd | ImageAd;

// Type guards
export function isAmazonAd(ad: Ad): ad is AmazonAd {
  return ad.type === 'AmazonBanner';
}

export function isGoogleAd(ad: Ad): ad is GoogleAd {
  return ad.type === 'GoogleAdSense';
}

export function isImageAd(ad: Ad): ad is ImageAd {
  return ad.type === 'ImageAd';
}
