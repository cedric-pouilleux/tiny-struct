<template>
  <UApp :locale="locales[locale]">
    <UContainer>
      <TopNavigation class="z-50 relative" />
      <NuxtPage />
    </UContainer>
  </UApp>
</template>

<script lang="ts" setup>
import * as locales from '@nuxt/ui/locale'

const { locale } = useI18n()
</script>
