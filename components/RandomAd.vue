<!-- === Randomly pick one ad from available ads returned by api call to ad server === -->
<!--
  Query Strings Supported:
  • [laravel-ads::AdController.php::get()] at, pk, random
  • sb: If '1' display Shuffle Button

  Domain Type Alignment:
  • GoogleAd: format, layoutKey, slot
  • AmazonAd: height, href, imageUrl, imageAlt, imageDescription, price, discountAmount
  • ImageAd: height, width, href, imageUrl, imageAlt
-->
<script setup lang="ts">
  import type { AmazonAd, GoogleAd, ImageAd } from '@/domain/ads/types';
  import { sendSafeMessage } from '@/infrastructure/security/messaging';

  // === Composables ===
  const { query } = useRoute();
  const { ad, isLoading, error, fetchAd } = useAdController();

  // === Computed for Template ===
  const amazonAd = computed(() => ad.value?.type === 'AmazonBanner' ? ad.value as AmazonAd : null);
  const googleAd = computed(() => ad.value?.type === 'GoogleAdSense' ? ad.value as GoogleAd : null);
  const imageAd = computed(() => ad.value?.type === 'ImageAd' ? ad.value as ImageAd : null);
  const showShuffle = computed(() => query.sb === '1');

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
      // Use safe messaging with origin validation (Phase 5 Security)
      sendSafeMessage(message);
    };
    img.src = imagePath;
  };

  /**
   * Load a random ad based on query parameters
   * Note: Array values are joined with commas (backend expects comma-separated values, not repeated keys)
   */
  const loadAd = async () => {
      const filters: Record<string, string> = {};
      Object.entries(query).forEach(([key, value]) => {
        if (typeof value === 'string') {
          filters[key] = value;
        } else if (Array.isArray(value)) {  // Handle array values (e.g., multiple categories)
          filters[key] = value.join(','); // Backend expects comma-separated string
        }
      });

      await fetchAd(filters);

      if (ad.value) {
          if (ad.value.type === 'AmazonBanner' || ad.value.type === 'ImageAd') {
               // Safe cast because of type check
               const imgAd = ad.value as AmazonAd | ImageAd;
               // Ensure imageUrl is present (required by domain but verify for safety)
               if (imgAd.imageUrl) {
                 notifyParentOfAdDimensions(imgAd.imageUrl, imgAd.height, imgAd.width);
               }
          }
      }
  };

  // === Lifecycle Hooks ===
  onMounted(() => {
    loadAd();
  });
</script>

<template>
  <div class="text-center">
    <!-- === Loader === -->
    <div
      v-if="isLoading"
      aria-label="Loading advertisement"
      class="loader"
      role="status"
    />

    <!-- === Google AdSense === -->
    <GoogleAdSense
      v-if="googleAd"
      :adFormat="googleAd.format"
      :adLayoutKey="googleAd.layoutKey"
      :adSlot="googleAd.slot"
    />

    <!-- === Amazon Banner === -->
    <AmazonBanner
      v-if="amazonAd"
      :height="amazonAd.height"
      :href="amazonAd.href"
      :image="amazonAd.imageUrl"
      :imageAltText="amazonAd.imageAlt"
      :imageDescription="amazonAd.imageDescription"
      :price="amazonAd.price"
      :priceDiscountAmount="amazonAd.discountAmount"
    />

    <!-- === ImageAd === -->
    <NuxtLink
      v-if="imageAd"
      rel="nofollow noopener"
      target="_blank"
      :href="imageAd.href"
    >
      <figure>
        <img
          :alt="imageAd.imageAlt"
          :src="imageAd.imageUrl"
          style="max-width: 100%; height: auto;"
        />
      </figure>
    </NuxtLink>

    <!-- === Shuffle Button === -->
    <button
      density="compact"
      v-if="showShuffle"
      @click="loadAd"
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