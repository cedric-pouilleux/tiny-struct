<template>
  <UCollapsible v-model:open="isOpenVariant">
    <div class="flex items-center justify-between gap-4">
      <ItemInfos
        :id="item.id"
        :name="item.translations[locale]"
        :category="item.category?.translations[locale]"
        :created-at="getFormatedDate(item.createdAt)"
      />
      <ItemActions
        :variant-count="item.variants.length"
        :last-edit-date="getFormatedDate(item.updatedAt)"
        @remove="emits('remove', item.id)"
        @edit="emits('edit', item)"
        @add="handleOpenNewVariantForm"
      />
    </div>
    <template #content>
      <ItemsVariants
        v-model="isNewVariantFormOpen"
        :item-id="item.id"
        :variants="item.variants"
        @refresh="emits('refresh')"
      />
    </template>
  </UCollapsible>
</template>

<script lang="ts" setup>
import type { ItemReponse } from '~/server/api/item/all.get'
import ItemActions from './ItemActions.vue'
import ItemInfos from './ItemInfos.vue'
import ItemsVariants from './ItemsVariants.vue'

defineProps<{
  item: ItemReponse
}>()

const emits = defineEmits<{
  (e: 'refresh'): void
  (e: 'remove', item: number): void
  (e: 'edit', itemId: ItemReponse): void
}>()

const { locale } = useI18n()
const { getFormatedDate } = useDateUtils()

const isOpenVariant = ref<boolean>(false)
const isNewVariantFormOpen = ref<boolean>(false)

function handleOpenNewVariantForm() {
  isNewVariantFormOpen.value = !isNewVariantFormOpen.value
  isOpenVariant.value = true
}

watch(
  () => isOpenVariant.value,
  (currentState) => {
    if (!currentState) {
      isNewVariantFormOpen.value = false
    }
  }
)
</script>
