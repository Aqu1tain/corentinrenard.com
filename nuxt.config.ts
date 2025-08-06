import tailwindcss from '@tailwindcss/vite';

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },

  routeRules: {
    '/': { redirect: '/portfolio' }
  },

  css: ['~/assets/css/main.css'],
  vite: {
    plugins: [
        tailwindcss(),
    ]
  },

  modules: [
    '@nuxt/content',
    '@nuxt/image',
    '@nuxt/icon',
    '@nuxt/fonts',
  ]
})