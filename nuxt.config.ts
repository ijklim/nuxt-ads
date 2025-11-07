// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-11-07',

  // Note: Can't use css here if project is to be extended by another app, will cause compilation error
  css: [
    '@/assets/css/main.css',
  ],
  devServer: {
    port: 8810,
  },
  devtools: { enabled: false },
  modules: [
    'nuxt-viewport',
  ],
  viewport: {
    breakpoints: {
      desktop: 1024,
      desktopMedium: 1280,
      desktopWide: 1600,
      mobile: 320,
      mobileMedium: 375,
      mobileWide: 425,
      tablet: 768,
      // === Custom Settings based on Mochahost Banners, same as banner width
      mochahostTabletMedium: 728,
      mochahostMobileMedium: 336,
      mochahostMobile: 298,
      mochahostMobileSmall: 250,
      mochahostMobileExtraSmall: 200,
      mochahostImpossible: 50,
    }
  },
  ssr: true,
});
