// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
  modules: ['@pinia/nuxt', 'nuxt-auth-utils', '@nuxt/icon', '@nuxt/image'],
  ssr: true,
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  image: {
    domains: ['lh3.googleusercontent.com']
  }
})
