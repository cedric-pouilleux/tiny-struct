// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
  modules: ['@pinia/nuxt', 'nuxt-auth-utils', '@nuxt/icon', '@nuxt/image', '@nuxt/fonts'],
  ssr: true,
  compatibilityDate: '2024-11-01',
  devtools: { enabled: process.env.ENV === 'development' },
  css: ['@/assets/design-system/global.scss', '@/assets/design-system/buttons.scss'],
  image: {
    domains: ['lh3.googleusercontent.com']
  }
})
