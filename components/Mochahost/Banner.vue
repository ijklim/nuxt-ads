<script setup lang="ts">
  defineProps({
    height: {
      type: Number,
      default: 90,
    },
    // e.g. https://affiliates.mochahost.com/idevaffiliate.php?id=6756&tid1=ivan-lim.com
    href: {
      type: String,
      required: true,
    },
    imageAltText: {
      type: String,
      default: '',
    },
    // Example image url: https://affiliates.mochahost.com/media/banners/mshared728x90.gif
    imageUrl: {
      type: String,
      required: true,
    },
    width: {
      type: Number,
      default: 728,
    },
  });
</script>

<template>
  <div>
    <a
      target="_blank"
      :href="href"
    >
      <img
        :alt="imageAltText"
        :height="height"
        :src="imageUrl"
        :width="width"
      />
    </a>
  </div>
</template>
