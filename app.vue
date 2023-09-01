<script setup lang="ts">
  const appConfig = useAppConfig();

  // Set browser tab title
  useSeoMeta({
    title: `${appConfig.appName} v.${appConfig.appVersion}`,
  });
</script>

<template>
  <RandomAd />
</template>
