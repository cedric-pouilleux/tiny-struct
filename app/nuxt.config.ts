// https://nuxt.com/docs/api/configuration/nuxt-config

import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  modules: ['@nuxt/ui', '@pinia/nuxt', 'nuxt-auth-utils', '@nuxtjs/i18n'],
  ssr: true,
  compatibilityDate: '2024-11-01',
  devtools: { enabled: process.env.ENV === 'development' },
  css: ['@/assets/main.css'],
  i18n: {
    lazy: true,
    customRoutes: 'page',
    defaultLocale: 'en',
    locales: [
      {
        code: 'fr',
        name: 'Français',
        file: 'fr.json'
      },
      {
        code: 'es',
        name: 'Spanish',
        file: 'es.json'
      },
      {
        code: 'en',
        name: 'English',
        file: 'en.json'
      }
    ]
  }
})
