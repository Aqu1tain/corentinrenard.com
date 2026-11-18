import tailwindcss from "@tailwindcss/vite"
import { SITE_URL } from './shared/utils/site'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: [
    '@nuxt/content',
    '@nuxt/icon',
    '@nuxtjs/color-mode',
    '@nuxtjs/i18n',
    '@nuxt/image',
  ],

  icon: {
    cssLayer: 'icons',
  },

  css: ['~/assets/css/main.css'],

  vite: {
    plugins: [tailwindcss()],
  },

  content: {
    experimental: { nativeSqlite: process.env.NODE_ENV === 'production' },
    _localDatabase: {
      type: 'sqlite',
      filename: process.env.NODE_ENV === 'production'
        ? '.data/content/build.sqlite'
        : '.data/content/dev.sqlite',
    },
  },

  colorMode: {
    classSuffix: '',
    preference: 'system',
    fallback: 'light',
  },

  i18n: {
    baseUrl: SITE_URL,
    locales: [
      { code: 'fr', language: 'fr-FR', file: 'fr.json', name: 'Français' },
      { code: 'en', language: 'en-US', file: 'en.json', name: 'English' },
    ],
    defaultLocale: 'fr',
    langDir: 'locales',
    strategy: 'prefix_except_default',
    // No browser-language redirect: pages are prerendered, and switching locale
    // on the client before hydration left attributes (CV link, work links) in
    // the prerendered language. The URL alone decides the language.
    detectBrowserLanguage: false,
  },

  nitro: {
    prerender: {
      crawlLinks: true,
      routes: ['/', '/en', '/sitemap.xml', '/robots.txt'],
    },
  },

  app: {
    pageTransition: { name: 'page', mode: 'out-in' },
    head: {
      htmlAttrs: { lang: 'fr' },
      titleTemplate: '%s | Corentin Renard',
      link: [
        { rel: 'icon', type: 'image/png', href: '/favicon-32x32.png' },
        { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=DM+Serif+Display:wght@400&family=Inter:wght@400;500;600&subset=latin,latin-ext&display=swap' },
      ],
    },
  },
})
