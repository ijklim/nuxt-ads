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

  interface IResponseFetchAds {
    ad_code: string,
    ad_format: string,
    ad_layout_key: string,
    ad_type: AdType,
    display_ratio: string,
    height: string,
    image_description: string,
    price: string,
    price_discount_amount: string,
    product_code: string,
    title: string,
    url_affiliate: string,
    url_product: string,
    url_segment_image: string,
    width: string,
  }

  interface IStateObject {
    whichAdToShow: AdObject;
  }
  const state: IStateObject = reactive({
    whichAdToShow: { adType: 'none', displayRatio: 0 },
  });


  // === Methods ===
  /**
   * Randomly pick an ad from `ads` considering displayRatio
   */
  const pickRandomAd = (ads: AdObject[]) => {
    // Filter by url query `adtype` if exists
    const filterAdType = query?.adtype;

    // availableAds e.g. [{ adType: AmazonBanner, ... }, { adType: AmazonBanner, ... }, { adType: GoogleAdSense, ... }, ...]
    const availableAds = (ads)
      .filter((ad) => {
        if (!filterAdType) {
          return true;
        }

        const adType = (ad.adType as AdType).toLowerCase() ;

        if ((filterAdType as string).startsWith('-')) {
          // If adtype starts with '-', filter out the key that matches the string that comes after
          return adType !== (filterAdType.slice(1) as string).toLowerCase();
        }

        // True if adType matches query 'adtype'
        return adType === (filterAdType as string).toLowerCase();
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
    // useFetch: https://nuxt.com/docs/api/composables/use-fetch
    const url = `${import.meta.env.VITE_ADS_SERVER}/api/json/ads`;
    const apiResponse = await $fetch<IResponseFetchAds[]>(url)
      .catch((error) => {
        console.error(`[${utility.currentFileName}::onMounted] Fail to retrieve valid ads data, aborting.`, error);
      });

    if (apiResponse && Array.isArray(apiResponse)) {
      // console.log(`[${utility.currentFileName}::onMounted] apiResponse:`, toRaw(apiResponse));
      const ads: AdObject[] = apiResponse
        .map((item): AdObject => ({
          adFormat: item.ad_format,
          adLayoutKey: item.ad_layout_key,
          adType: item.ad_type,
          displayRatio: parseInt(item.display_ratio),
          height: parseInt(item.height),
          href: item.url_affiliate,
          imageAltText: item.title,
          imageDescription: item.image_description,
          imagePath: item.url_segment_image ? `${import.meta.env.VITE_ADS_SERVER}${item.url_segment_image}` : undefined,
          price: item.price ? parseFloat(item.price) : undefined,
          priceDiscountAmount: item.price_discount_amount,
          width: parseInt(item.width),
        }));

      state.whichAdToShow = pickRandomAd(ads);
    }
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
      :image="(<IAmazonAdObject>state.whichAdToShow).imagePath"
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
