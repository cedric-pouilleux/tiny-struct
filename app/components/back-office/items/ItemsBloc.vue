<template>
  <UCard
    variant="outline"
    :ui="{
      root: 'rounded-[calc(var(--ui-radius)*1.8)]',
      header: 'p-2 sm:px-3',
      body: 'sm:p-0 sm:pl-3 sm:pr-3'
    }"
  >
    <template #header>
      <div class="flex justify-between items-center">
        <h3>Shop items</h3>
        <UButton size="xs" label="New" icon="mingcute:plus-fill" @click="toggleNewForm()" />
      </div>
    </template>
    <ItemForm
      class="mb-4"
      v-if="isOpenForm"
      v-model="itemState"
      :categories="formattedSelectCategories"
      @refresh="refresh"
      @close="closeForm"
    />
    <Item
      class="border-b border-gray-200 py-2 last:border-b-0"
      v-for="item in data"
      :key="item.id"
      :item="item"
      @refresh="refresh"
      @edit="openForm(item)"
      @remove="handleRemoveItem"
    />
  </UCard>
</template>

<script setup lang="ts">
import type { ItemReponse } from '~/server/api/item/all.get'
import Item from './Item.vue'
import { getItems } from '~/services/itemService'
import ItemForm from './ItemForm.vue'
import type { ItemAddPayload } from '~/server/api/item/add'

const { data, error, refresh } = await useAsyncData<ItemReponse[]>('all-items', () => getItems())
const { availableLocales } = useI18n()

type ItemFormPayload = Partial<Pick<ItemAddPayload, 'categoryId'>> & {
  id?: number
  translations: Record<string, string>
}

const itemState = reactive<ItemFormPayload>({
  id: undefined,
  categoryId: undefined,
  translations: Object.fromEntries(availableLocales.map((lang) => [lang, '']))
})

const isOpenForm = ref<boolean>(false)

const categoryStore = useCategoryStore()
const { formattedSelectCategories } = storeToRefs(categoryStore)

function resetItemState() {
  Object.assign(itemState, {
    id: undefined,
    categoryId: undefined,
    translations: Object.fromEntries(availableLocales.map((lang) => [lang, '']))
  })
}

function openForm(item?: ItemReponse) {
  if (item) {
    itemState.id = item.id
    itemState.categoryId = item.categoryId!
    itemState.translations = { ...item.translations }
  } else {
    resetItemState()
  }
  isOpenForm.value = true
}

function toggleNewForm() {
  if (isOpenForm.value && !itemState.id) {
    closeForm()
  } else {
    openForm()
  }
}

function closeForm() {
  isOpenForm.value = false
  resetItemState()
}

async function handleRemoveItem(id: number) {
  await refresh()
}
</script>
