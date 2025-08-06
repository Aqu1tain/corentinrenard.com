// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },

  tailwindcss: {
    exposeConfig: true,
    viewer: true,
  },

  routeRules: {
    '/': { redirect: '/portfolio' }
  },

  modules: [
    '@nuxt/content',
    '@nuxt/image',
    '@nuxt/icon',
    '@nuxt/fonts',
    '@nuxtjs/tailwindcss'
  ]
})