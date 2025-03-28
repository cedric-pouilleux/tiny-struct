<template>
  <UCard>
    <template #header>
      <RightColumnHeader
        :model-value="isOpenForm"
        title="Categories"
        @update:model-value="handleNew"
      />
    </template>
    <CategoryForm v-if="isOpenForm" v-model="category">
      <FormActions :edit-mode="!!category.id" @upsert="handleUpsert" @close="isOpenForm = false" />
    </CategoryForm>
    <RightColumnList
      :data="currentLocaleCategories"
      @edit="handleEditCategory"
      @remove="handleRemoveCategory"
    />
  </UCard>
</template>

<script lang="ts" setup>
import { useCategoryStore } from '~/stores/useCategory.store'
import CategoryForm from './CategoryForm.vue'
import type { FormCategory } from '~/shared/types/categories'
import RightColumnHeader from '../ui/RightColumnHeader.vue'
import RightColumnList from '../ui/RightColumnList.vue'
import FormActions from '../ui/FormActions.vue'

const { locale } = useI18n()
const categoryStore = useCategoryStore()
const { categoriesWithRecordTranslation } = storeToRefs(categoryStore)
const { toastError, defaultSuccessToaster } = useServiceToast()
const { recordLanguageDefaultField } = useLanguages()

const category = reactive<FormCategory>({
  id: undefined,
  descriptions: recordLanguageDefaultField(),
  names: recordLanguageDefaultField()
})

const isOpenForm = ref<boolean>(false)

const currentLocaleCategories = computed<{ id: number; value: string }[]>(() =>
  categoriesWithRecordTranslation.value.map((category) => ({
    id: category.id,
    value: category.names[locale.value]
  }))
)

function handleEditCategory(categoryId: number) {
  if (isOpenForm.value && category.id === categoryId) {
    isOpenForm.value = false
  } else {
    isOpenForm.value = true
  }
  Object.assign(
    category,
    categoriesWithRecordTranslation.value.find((category) => category.id === categoryId)
  )
}

function handleNew() {
  if (isOpenForm.value && !category.id) {
    isOpenForm.value = false
  } else {
    isOpenForm.value = true
    Object.assign(category, {
      id: undefined,
      descriptions: recordLanguageDefaultField(),
      names: recordLanguageDefaultField()
    })
  }
}

async function handleRemoveCategory(id: number): Promise<void> {
  try {
    const removedCategoryId = await categoryStore.remove(id)
    defaultSuccessToaster(`Category with id ${removedCategoryId} successfull removed`)
  } catch (error: any) {
    toastError(error.statusCode, error.statusMessage)
  }
}

async function handleUpsert() {
  if (!category.descriptions && category.names) {
    return
  }
  if (category.id) {
    // await materialStore.edit(material)
  } else {
    try {
      const addedCategoryId = await categoryStore.add(category)
      defaultSuccessToaster(`Category with id ${addedCategoryId} successfull added`)
    } catch (error: any) {
      toastError(error.statusCode, error.statusMessage)
    }
  }
}
</script>
