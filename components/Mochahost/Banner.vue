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


  // === Computed Field ===
  /**
   * Select the most appropriate configuration based on current breakpoint
   *
   * Valid Breakpoints: desktopWide, desktopMedium, desktop, tablet, mobileWide, mobileMedium, mobile
   */
  const activeBreakpointConfiguration = computed(() => {
    switch (viewport.breakpoint.value) {
      case 'mobile':
        // Smallest width
        return {
          height: 200,
          imageUrl: 'https://affiliates.mochahost.com/media/banners/mshared200x200.gif',
          width: 200,
        };
      case 'mobileMedium':
        return {
          height: 250,
          imageUrl: 'https://affiliates.mochahost.com/media/banners/mshared300x250.gif',
          width: 300,
        };
      case 'mobileWide':
        return {
          height: 280,
          imageUrl: 'https://affiliates.mochahost.com/media/banners/mshared336x280.gif',
          width: 336,
        };
      default:
        return {
          height: 90,
          imageUrl: 'https://affiliates.mochahost.com/media/banners/mshared728x90.gif',
          width: 728,
        };
    }
  });
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
        :height="activeBreakpointConfiguration.height"
        :src="activeBreakpointConfiguration.imageUrl"
        :width="activeBreakpointConfiguration.width"
      />
    </NuxtLink>
  </div>

  <!-- Debug Only -->
  <div style="display:none; background-color:palegoldenrod; padding:10px;">
    viewport.breakpoint: {{ viewport.breakpoint }}
  </div>
</template>
