<!-- Doc: https://support.google.com/adsense/answer/9274025?sjid=15958214024945695758-NA -->
<script setup lang="ts">
  // === Props ===
  // The props below are required by Google AdSense
  defineProps({
    adFormat: {
      type: String,
      default: 'auto',
    },
    // For In-feed only
    adLayoutKey: {
      type: String,
      default: '',
    },
    adSlot: {
      type: Number,
      required: true,
    },
  });


  // === Data ===
  const adClient = ref(import.meta.env.VITE_AD_CLIENT);


  // === Lifecycle Hooks ===
  // Add `adsbygoogle` as a valid window property for Typescript
  declare global {
    interface Window {
        adsbygoogle: {[key: string]: unknown}[]
    }
  }

  onMounted(() => {
    window.adsbygoogle = window?.adsbygoogle || [];

    // Slight delay before showing ad
    setTimeout(() => {
      window.adsbygoogle.push({});
    }, 3000);
  });


  // === HTML Head ===
  useHead({
    script: [
      // Supports Google AdSense
      {
        async: true,
        crossorigin: 'anonymous',
        referrerpolicy: 'origin',
        src: 'https://api.ivan-lim.com/?a=pagead2_googlesyndication',
        type: 'text/javascript',
      },
    ],
  });
</script>

<template>
  <ins
    class="adsbygoogle"
    style="display:block"
    data-full-width-responsive="true"
    :data-ad-client="adClient"
    :data-ad-format="adFormat"
    :data-ad-layout-key="adLayoutKey"
    :data-ad-slot="adSlot"
  ></ins>
</template>

<style scoped>
  ins {
    /* Centers the ad */
    margin: auto;
    max-width: 800px;
  }
</style>