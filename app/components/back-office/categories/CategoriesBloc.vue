<template>
  <UCard
    :ui="{
      root: 'rounded-lg shadow-xs',
      header: 'sm:pt-2 sm:pb-2 sm:pl-4 sm:pr-4',
      body: 'sm:pt-2 sm:pb-2 sm:pl-4 sm:pr-4'
    }"
  >
    <template #header>
      <header class="flex justify-between items-center">
        <h2>Categories</h2>
        <UButton
          icon="mingcute:plus-fill"
          size="xs"
          label="New"
          :variant="isOpenCategoryForm ? 'outline' : 'solid'"
          @click="handleAddNewCategory"
        />
      </header>
    </template>
    <CategoryForm
      v-model="category"
      :open="isOpenCategoryForm"
      @refresh="categoryStore.refreshCategories()"
    />
    <CategoriesList
      :categories="categories"
      @edit="handleEditCategory"
      @remove="handleRemoveCategory"
    />
  </UCard>
</template>

<script lang="ts" setup>
import type { CategoryWithTranslations } from '~/server/db/schema'
import { useCategoryStore } from '~/stores/useCategory.store'
import { removeItemCategory } from '~/services/itemCategoryService'
import CategoriesList from './CategoriesList.vue'
import CategoryForm from './CategoryForm.vue'

const categoryStore = useCategoryStore()
const { categories } = storeToRefs(categoryStore)
const { toastError, itemCategorySuccess } = useServiceToast()

const { availableLocales } = useI18n()

const category = reactive<Partial<CategoryWithTranslations>>({
  id: undefined,
  translations: Object.fromEntries(availableLocales.map((lang) => [lang, '']))
})

const isOpenCategoryForm = ref<boolean>(false)

function handleEditCategory(pCategory: CategoryWithTranslations) {
  category.id = pCategory.id
  category.translations = structuredClone(toRaw(pCategory.translations)) ?? {
    fr: '',
    en: '',
    es: ''
  }
  isOpenCategoryForm.value = true
}

function handleAddNewCategory(): void {
  if (isOpenCategoryForm.value) {
    const hasContent =
      Object.values(category.translations ?? {}).some((name) => name.length) || category.id
    if (hasContent && category.translations) {
      Object.keys(category.translations).forEach((lang) => {
        if (category.translations) {
          category.translations[lang] = ''
        }
      })
      category.id = undefined
    } else {
      isOpenCategoryForm.value = false
    }
  } else {
    isOpenCategoryForm.value = true
  }
}

async function handleRemoveCategory(id: number): Promise<void> {
  try {
    const removedCategoryId = await removeItemCategory(id)
    itemCategorySuccess(removedCategoryId, 'removed')
    await categoryStore.refreshCategories()
  } catch (error: any) {
    toastError(error.statusCode, error.statusMessage)
  }
}
</script>
