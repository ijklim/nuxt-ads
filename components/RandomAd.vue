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

  interface IResponseFetchAd {
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
   * Call ads-server api to retrieve a random ad
   *
   * Note: All query strings are passed to server for processing
   */
  const pickRandomAd = async () => {
    // useFetch: https://nuxt.com/docs/api/composables/use-fetch
    const params = new URLSearchParams();
    params.append('random', "1");
    // console.log(`[${utility.currentFileName}::pickRandomAd()] query:`, toRaw(query));
    // Add other query strings from url
    Object.keys(query)
      .forEach((key) => {
        params.append(key, `${query[key]}`);
      });

    const url = `${import.meta.env.VITE_ADS_SERVER}/api/ads?${params.toString()}`;
    const apiResponse = await $fetch<IResponseFetchAd>(url)
      .catch((error) => {
        console.error(`[${utility.currentFileName}::pickRandomAd()] Fail to retrieve valid ads data, aborting.`, error);
      });

    /**
     * Checking a few Ad properties to ensure response matches Ad type
     *
     * @param {IResponseFetchAd} apiResponse
     */
    const isAd = (apiResponse: IResponseFetchAd) => {
      return (
        'ad_code' in apiResponse &&
        'ad_type' in apiResponse &&
        'display_ratio' in apiResponse &&
        'url_affiliate' in apiResponse &&
        true
      );
    };

    if (apiResponse && isAd(apiResponse)) {
      // console.log(`[${utility.currentFileName}::onMounted] apiResponse:`, toRaw(apiResponse));
      state.whichAdToShow = {
        adFormat: apiResponse.ad_format,
        adLayoutKey: apiResponse.ad_layout_key,
        adSlot: (apiResponse.ad_type === 'GoogleAdSense') ? parseInt(apiResponse.ad_code) : undefined,
        adType: apiResponse.ad_type,
        displayRatio: parseInt(apiResponse.display_ratio),
        height: parseInt(apiResponse.height),
        href: apiResponse.url_affiliate,
        imageAltText: apiResponse.title,
        imageDescription: apiResponse.image_description,
        imagePath: apiResponse.url_segment_image ? `${import.meta.env.VITE_ADS_SERVER}${apiResponse.url_segment_image}` : undefined,
        price: apiResponse.price ? parseFloat(apiResponse.price) : undefined,
        priceDiscountAmount: apiResponse.price_discount_amount,
        width: parseInt(apiResponse.width),
      };
    }
  };


  // === Lifecycle Hooks ===
  onMounted(() => {
    pickRandomAd();
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

    <button
      density="compact"
      @click="pickRandomAd"
    >
      Shuffle
    </button>
  </div>
</template>

<style scoped>
  button {
    background-color: darkgreen;
    border: 0;
    border-radius: 3px;
    box-shadow: 0 0 0 1px black;
    color: white;
    cursor: pointer;
    font-family: Verdana, Geneva, Tahoma, sans-serif;
    margin-top: 2px;
    /* margin-bottom needed for iframeResizer to reserve space at the bottom */
    margin-bottom: 5px;
    padding: 2px 10px;
  }

  button:hover {
    background-color: palegreen;
    color: darkgreen;
  }
</style>