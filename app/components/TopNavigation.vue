<template>
  <UNavigationMenu
    content-orientation="vertical"
    highlight
    highlight-color="primary"
    :items="items"
  >
    <template #account-trailing>
      <AccountDropdown />
    </template>
  </UNavigationMenu>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useI18n, useLocalePath } from '#imports'

const { t } = useI18n()
const localePath = useLocalePath()

const items = ref([
  [
    {
      label: 'Tiny struct',
      to: localePath('index')
    },
    {
      label: t('navigation.shop'),
      to: localePath('shop')
    },
    {
      label: t('navigation.workshop'),
      to: localePath('workshop')
    }
  ],
  [
    {
      label: t('navigation.cart'),
      icon: 'entypo:shopping-bag',
      badge: '0',
      children: [{}]
    },
    {
      slot: 'account'
    }
  ]
])
</script>
