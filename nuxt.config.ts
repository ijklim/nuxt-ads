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
  ssr: true,
});
