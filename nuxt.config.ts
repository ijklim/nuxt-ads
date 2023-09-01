// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  // Note: Can't use css here, project extending this app won't compile
  // css: [
  //   '@/assets/css/main.css',
  // ],
  devServer: {
    port: 8810,
  },
  devtools: { enabled: false },
  modules: [
    'nuxt-viewport',
  ],
  ssr: true,
});
