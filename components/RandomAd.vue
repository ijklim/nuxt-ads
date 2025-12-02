<!-- === Randomly pick one ad from available ads returned by api call to ad server === -->
<!--
  Query Strings Supported:
  • [laravel-ads::AdController.php::get()] at, pk, random
  • sb: If '1' display Shuffle Button
-->
<script setup lang="ts">
  // === Composables ===
  const { query } = useRoute();
  const runtimeConfig = useRuntimeConfig();
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

  // Should match `ijklim_ads::ad_types::AmazonBanner`
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

  // Should match `ijklim_ads::ad_types::GoogleAdSense`
  interface IGoogleAdObject extends IEmptyAdObject {
    adFormat: string;
    adLayoutKey: string;
    adSlot: number;
  };

  // Obsolete: Replaced IImageAdObject
  // interface IMochahostAdObject extends IEmptyAdObject {
  //   height: number;
  //   href: string;
  //   imageAltText: string;
  //   imageUrl: string;
  // };

  // Should match `ijklim_ads::ad_types::Image`
  interface IImageAdObject extends IEmptyAdObject {
    height: number;
    href: string;
    imageAltText: string;
    imagePath: string;
    width?: number;
  };

  type AdObject = IAmazonAdObject | IEmptyAdObject | IGoogleAdObject | IImageAdObject;

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
    isLoading: boolean;
    whichAdToShow: AdObject;
  }
  const state: IStateObject = reactive({
    isLoading: false,
    whichAdToShow: { adType: 'none', displayRatio: 0 },
  });


  // === Methods ===
  /**
   * Send ad dimension to parent window for auto-resizing
   *
   * Note: The parent-window message listener is registered in ads.js
   */
  const notifyParentOfAdDimensions = (imagePath: string, height: number | null, width: number | null) => {
    const img = new Image();
    img.onload = () => {
      const naturalHeight = img.naturalHeight;
      const naturalWidth = img.naturalWidth;
      const aspectRatio = naturalHeight / naturalWidth;
      let calculatedHeight = height ?? naturalHeight;
      let calculatedWidth = width ?? naturalWidth;

      // If width is set, use it to calculate height base on aspect ratio
      if (width) {
        calculatedHeight = Math.round(width * aspectRatio);
      } else if (height) {
        calculatedWidth = Math.round(height / aspectRatio);
      }

      const message = {
        type: 'ad-dimension',
        height: calculatedHeight,
        width: calculatedWidth,
      };
      // console.log('[Debug Only] message', message);  // For debug purpose only
      window.parent.postMessage(message, '*');
    };
    img.src = imagePath;
  };

  /**
   * Call ads-server api to retrieve a random ad
   *
   * Note: All query strings are passed to server for processing
   */
  const pickRandomAd = async () => {
    state.isLoading = true;

    // useFetch: https://nuxt.com/docs/api/composables/use-fetch
    const params = new URLSearchParams();
    params.append('random', "1");
    // console.log(`[${utility.currentFileName}::pickRandomAd()] query:`, toRaw(query));
    // Add other query strings from url
    Object.keys(query)
      .forEach((key) => {
        params.append(key, `${query[key]}`);
      });

    const url = `${runtimeConfig.public.adsServer}/api/ads?${params.toString()}`;
    // console.log('[Debug Only] pickRandomAd()::runtimeConfig.public', runtimeConfig.public);
    // console.log('[Debug Only] pickRandomAd()::url', url);

    const apiResponse = await $fetch<IResponseFetchAd>(url)
      .catch((error) => {
        console.error(`[${utility.currentFileName}::pickRandomAd()] Fail to retrieve valid ads data, aborting.`, error);
        state.isLoading = false;
        return;
      });

    /**
     * Checking a few Ad properties to ensure response matches Ad type
     *
     * @param {IResponseFetchAd} apiResponse
     */
    const isAd = (apiResponse: IResponseFetchAd) => {
      // console.log('[Debug Only] isAd()::apiResponse', apiResponse);

      return (
        'ad_code' in apiResponse &&
        'ad_type' in apiResponse &&
        'display_ratio' in apiResponse &&
        'url_affiliate' in apiResponse &&
        true
      );
    };

    if (apiResponse && isAd(apiResponse)) {
      const height = parseInt(apiResponse.height);
      const width = parseInt(apiResponse.width);
      const imagePath = apiResponse.url_segment_image ? `${runtimeConfig.public.adsServer}${apiResponse.url_segment_image}` : undefined;

      // console.log(`[${utility.currentFileName}::onMounted] apiResponse:`, toRaw(apiResponse));
      state.whichAdToShow = {
        adFormat: apiResponse.ad_format,
        adLayoutKey: apiResponse.ad_layout_key,
        adSlot: (apiResponse.ad_type === 'GoogleAdSense') ? parseInt(apiResponse.ad_code) : undefined,
        adType: apiResponse.ad_type,
        displayRatio: parseInt(apiResponse.display_ratio),
        height,
        href: apiResponse.url_affiliate,
        imageAltText: apiResponse.title,
        imageDescription: apiResponse.image_description,
        imagePath,
        price: apiResponse.price ? parseFloat(apiResponse.price) : undefined,
        priceDiscountAmount: apiResponse.price_discount_amount,
        width,
      };

      if (imagePath) notifyParentOfAdDimensions(imagePath, height, width);
    }

    state.isLoading = false;
  };

  // === Lifecycle Hooks ===
  onMounted(() => {
    pickRandomAd();
  });
</script>

<template>
  <div class="text-center">
    <!-- === Loader === -->
    <div v-if="state.isLoading" class="loader"></div>

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

    <!-- === ImageAd === -->
    <NuxtLink
      v-if="['MochahostBanner', 'ImageAd'].includes(state.whichAdToShow.adType ?? '')"
      rel="nofollow noopener"
      target="_blank"
      :href="(<IImageAdObject>state.whichAdToShow).href"
    >
      <figure>
        <img
          :alt="(<IImageAdObject>state.whichAdToShow).imageAltText"
          :src="(<IImageAdObject>state.whichAdToShow).imagePath"
          style="max-width: 100%; height: auto;"
        />
      </figure>
    </NuxtLink>

    <button
      density="compact"
      v-if="query?.sb === '1'"
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

  figure {
    margin: 0;
  }

  .loader {
    border: 4px solid #f3f3f3;
    border-top: 4px solid darkgreen;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    animation: spin 1s linear infinite;
    margin: 20px auto;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
</style>