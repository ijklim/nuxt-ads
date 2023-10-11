<!-- === Randomly pick one ad from available Google or Amazon ads === -->
<!-- Supports route query `adtype` to include (e.g. MochahostBanner) or exclude (e.g. -GoogleAdSense) an AdType from being picked -->
<script setup lang="ts">
  import { Script } from '@unhead/vue';


  // === Composables ===
  const { query } = useRoute();
  const utility = useUtility(import.meta);
  // console.log(`[${utility.currentFileName}] query:`, query);

  // === Data ===
  /**
   * Ad Types that could be displayed
   */
  type AdType = 'none' | 'AmazonBanner' | 'GoogleAdSense' | 'MochahostBanner';

  // Core Ad Object
  interface IEmptyAdObject {
    adType?: AdType;
    displayRatio: number;
  }

  interface IAmazonAdObject extends IEmptyAdObject {
    height?: number;
    href: string;
    imageAltText: string;
    imageDescription?: string;
    imagePath: string;
    price?: number;
    priceDiscountAmount?: string;
    width?: number;
  };

  interface IGoogleAdObject extends IEmptyAdObject {
    adFormat: string;
    adLayoutKey: string;
    adSlot: number;
  };

  interface IMochahostAdObject extends IEmptyAdObject {
    href: string;
    imageAltText: string;
    imageUrl: string;
  };

  type AdObject = IAmazonAdObject | IEmptyAdObject | IGoogleAdObject | IMochahostAdObject;

  interface AdsObject {
    [key: string]: AdObject[];
  };

  const state = reactive({
    whichAdToShow: { adType: 'none', displayRatio: 0 },
  });


  // === Methods ===
  const getImageUrl = (imagePath: string) => {
    // Note: Path must start with a static folder (e.g. ./images/) for Vite to process the image in Production build
    // https://vitejs.dev/guide/assets.html
    const result = `/img/${imagePath}`;
    return result;
  };

  /**
   * Randomly pick an ad from `ads` considering displayRatio
   */
  const pickRandomAd = (ads: AdsObject) => {
    // Filter by url query `adtype` if exists
    const filterAdType = query?.adtype;

    // availableAds e.g. [{ adType: AmazonBanner, ... }, { adType: AmazonBanner, ... }, { adType: GoogleAdSense, ... }, ...]
    const availableAds = (Object.keys(ads) as string[])
      .filter((adType) => {
        if (!filterAdType) {
          return true;
        }

        if ((filterAdType as string).startsWith('-')) {
          // If adtype starts with '-', filter out the key that matches the string that comes after
          return adType.toLowerCase() !== (filterAdType.slice(1) as string).toLowerCase();
        }

        // True if adType matches query 'adtype'
        return adType.toLowerCase() === (filterAdType as string).toLowerCase();
      })
      .flatMap((adType) => {
        return ads[adType]
          .flatMap((ad) => (Array(ad.displayRatio).fill({ adType, ...ad })));
      });
    // console.log(`[${utility.currentFileName}::pickRandomAd] availableAds:`, availableAds);

    if (!availableAds.length) {
      // No available ad, most likely filter has removed all available ads
      return Object.values(ads)[0];
    }

    const indexRandom = Math.floor(Math.random() * availableAds.length);
    // console.log(`[${utility.currentFileName}::pickRandomAd] indexRandom:`, indexRandom);

    return availableAds[indexRandom];
  };


  // === Lifecycle Hooks ===
  onMounted(async () => {
    const ads = await $fetch('/ads.json').catch((error) => error.data);

    state.whichAdToShow = pickRandomAd(ads as AdsObject);

    const scripts: Script[] = [
      // Supports iframe resizing on parent window
      {
        async: true,
        crossorigin: 'anonymous',
        integrity: 'sha512-R7Piufj0/o6jG9ZKrAvS2dblFr2kkuG4XVQwStX+/4P+KwOLUXn2DXy0l1AJDxxqGhkM/FJllZHG2PKOAheYzg==',
        referrerpolicy: 'no-referrer',
        src: 'https://cdnjs.cloudflare.com/ajax/libs/iframe-resizer/4.3.6/iframeResizer.contentWindow.min.js',
        type: 'text/javascript',
      },
    ];

    // Add Google AdSense script only if necessary
    if (state.whichAdToShow.adType === 'GoogleAdSense') {
      // Important: `.env::VITE_AD_CLIENT` must be set in the importing project, the one in the current project will be ignored
      const srcScriptGoogleAdSense = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${import.meta.env.VITE_AD_CLIENT}`;
      scripts.push({
        async: true,
        crossorigin: 'anonymous',
        src: srcScriptGoogleAdSense,
      });
    }

    useHead({
      script: scripts,
    });
  });
</script>

<template>
  <div id="nuxt-ad" class="text-center">
    <!-- === Google AdSense === -->
    <GoogleAdSense
      v-if="state.whichAdToShow.adType === 'GoogleAdSense'"
      :adFormat="(<IGoogleAdObject>state.whichAdToShow).adFormat"
      :adLayoutKey="(<IGoogleAdObject>state.whichAdToShow).adLayoutKey"
      :adSlot="(<IGoogleAdObject>state.whichAdToShow).adSlot"
    />

    <!-- === Amazon Banner === -->
    <AmazonBanner
      v-if="state.whichAdToShow.adType === 'AmazonBanner'"
      :height="(<IAmazonAdObject>state.whichAdToShow)?.height ?? undefined"
      :href="(<IAmazonAdObject>state.whichAdToShow).href"
      :image="getImageUrl((<IAmazonAdObject>state.whichAdToShow).imagePath)"
      :imageAltText="(<IAmazonAdObject>state.whichAdToShow).imageAltText"
      :imageDescription="(<IAmazonAdObject>state.whichAdToShow)?.imageDescription ?? undefined"
      :price="(<IAmazonAdObject>state.whichAdToShow)?.price ?? undefined"
      :priceDiscountAmount="(<IAmazonAdObject>state.whichAdToShow)?.priceDiscountAmount ?? undefined"
    />

    <!-- === Mochahost Banner === -->
    <MochahostBanner
      v-if="state.whichAdToShow.adType === 'MochahostBanner'"
      :href="(<IMochahostAdObject>state.whichAdToShow).href"
      :imageAltText="(<IMochahostAdObject>state.whichAdToShow).imageAltText"
    />
  </div>
</template>
