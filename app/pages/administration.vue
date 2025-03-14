<template>
  <div class="grid grid-cols-[3fr_1fr] gap-4">
    <div>
      <!-- <AdminItemAdd :categories="categories" /> -->
    </div>
    <div>
      <ItemsCategories :categories="categories" @refresh="categoriesRefresh" />
    </div>
  </div>
</template>

<script setup lang="ts">
// import ItemsCategories from '~/components/back-office/ItemsCategories.vue'
import type { CategoryWithTranslations } from '~/server/db/schema'

// const { data: items } = await useAsyncData('all-items', () => $fetch('/api/item/all'))

const { data: featchedCategories, refresh: categoriesRefresh } = await useAsyncData(
  'all-categories',
  () => $fetch('/api/category/all')
)

const categories = computed(
  (): CategoryWithTranslations[] | undefined => featchedCategories.value?.categories
)
</script>
