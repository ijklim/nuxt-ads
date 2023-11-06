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
    const configuration = (imageUrl: string, width: number, height: number) => {
      return { imageUrl, height, width };
    };
    const imagePath = 'https://affiliates.mochahost.com/media/banners/';

    // Note: breakpoint settings in nuxt.config.ts should be larger or equal to configuration width for each case and smaller than next level up
    switch (viewport.breakpoint.value) {
      case 'mochahostImpossible':
        return configuration(`${imagePath}mshared200x200.gif`, 50, 50);
      case 'mochahostMobileExtraSmall':
        // mochahostMobileSmall (200) >= width (200), < next level width (250)
        return configuration(`${imagePath}mshared200x200.gif`, 200, 200);
      case 'mochahostMobileSmall':
        return configuration(`${imagePath}mshared250x250.gif`, 250, 250);
      case 'mochahostMobile':
      case 'mobile':
        return configuration(`${imagePath}mshared300x250.gif`, 298, 248);
      case 'mochahostMobileMedium':
      case 'mobileMedium':
      case 'mobileWide':
        return configuration(`${imagePath}mshared336x280.gif`, 336, 280);
      case 'mochahostTabletMedium':
        return configuration(`${imagePath}mshared468x60.gif`, 468, 60);
      default:
        return configuration(`${imagePath}mshared728x90.gif`, 728, 90);
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
  <div
    style="background-color:palegoldenrod; padding:10px;"
    v-if="false"
  >
    <li>viewport.breakpoint: {{ viewport.breakpoint }}</li>
    <li>viewport.breakpointValue: {{ viewport.breakpointValue(viewport.breakpoint.value) }}</li>
  </div>
</template>
