// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
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
