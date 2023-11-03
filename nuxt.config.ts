// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
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
      // Custom Settings based on Mochahost Banners, 1px smaller than banner width
      mochahostTabletMedium: 727,
      mochahostMobileMedium: 335,
      mochahostMobile: 299,
      mochahostMobileSmall: 249,
    }
  },
  ssr: true,
});
