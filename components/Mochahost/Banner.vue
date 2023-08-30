<script setup lang="ts">
  // === Composables ===
  // nuxt-viewport module: https://nuxt.com/modules/nuxt-viewport
  const viewport = useViewport();


  // === Props ===
  defineProps({
    // e.g. https://affiliates.mochahost.com/idevaffiliate.php?id=6756&tid1=ivan-lim.com
    href: {
      type: String,
      required: true,
    },
    imageAltText: {
      type: String,
      default: '',
    },
  });


  // === Data ===
  // Mochahost Banners: https://affiliates.mochahost.com/account.php?page=7
  const BREAKPOINT_CONFIGURATIONS = {
    default: {
      height: 90,
      imageUrl: 'https://affiliates.mochahost.com/media/banners/mshared728x90.gif',
      width: 728,
    },
    mobile: {
      height: 200,
      imageUrl: 'https://affiliates.mochahost.com/media/banners/mshared200x200.gif',
      width: 200,
    }
  };
</script>

<template>
  <div>
    <NuxtLink
      rel="nofollow noopener"
      target="_blank"
      :href="href"
    >
      <img
        :alt="imageAltText"
        :height="BREAKPOINT_CONFIGURATIONS[viewport.breakpoint.value.startsWith('mobile') ? 'mobile' : 'default'].height"
        :src="BREAKPOINT_CONFIGURATIONS[viewport.breakpoint.value.startsWith('mobile') ? 'mobile' : 'default'].imageUrl"
        :width="BREAKPOINT_CONFIGURATIONS[viewport.breakpoint.value.startsWith('mobile') ? 'mobile' : 'default'].width"
      />
    </NuxtLink>
  </div>
</template>
