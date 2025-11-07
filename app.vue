<script setup lang="ts">
  // === Composables ===
  const appConfig = useAppConfig();


  // === HTML Head ===
  // Note: iframeResizer replaced by ads.js
  // useHead({
  //   script: [
  //     // Supports iframe resizing in parent iframe
  //     {
  //       async: true,
  //       crossorigin: 'anonymous',
  //       integrity: 'sha512-hBWsS94l8+snzSPo759jDKZ3z3jn3WT4snJZTBaeMPbrCGzDrYdl2pN9EaXjh6IqEZC7wF10qcmp42TPRVgAYQ==',
  //       referrerpolicy: 'no-referrer',
  //       src: 'https://cdnjs.cloudflare.com/ajax/libs/iframe-resizer/4.3.7/iframeResizer.contentWindow.js',
  //       type: 'text/javascript',
  //     },
  //   ],
  // });

  // Set browser tab title
  useSeoMeta({
    title: `${appConfig.appName} v.${appConfig.appVersion}`,
  });

  // Set body classes
  useHead({
    htmlAttrs: {
      'data-version-app': appConfig.appVersion,
    },
  });
</script>

<template>
  <RandomAd />
</template>
