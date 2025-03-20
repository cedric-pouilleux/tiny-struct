<template>
  <UForm v-if="open" :state="modelValue" class="w-full" @submit="handleUpsertCategory">
    <UFormField label="Name" class="flex-1" size="sm">
      <UButtonGroup class="w-full mb-2" v-for="lang in availableLocales" :key="lang">
        <UBadge
          class="w-10 flex items-center justify-center"
          color="neutral"
          variant="outline"
          :label="lang"
        />
        <UInput v-model="modelValue.translations![lang]" class="w-full" />
      </UButtonGroup>
    </UFormField>
    <div class="flex justify-end mt-2">
      <UButton
        type="submit"
        size="sm"
        :trailing-icon="modelValue.id ? 'bytesize:edit' : 'mingcute:plus-fill'"
        :label="modelValue.id ? 'Edit category' : 'Add category'"
        variant="outline"
      />
    </div>
  </UForm>
</template>

<script setup lang="ts">
import type { CategoryWithTranslations } from '~/server/db/schema'
import { addItemCategory, editItemCategory } from '~/services/itemCategoryService'
const { toastError, itemCategorySuccess } = useServiceToast()

defineProps<{
  open?: boolean
}>()

const emits = defineEmits<{
  (e: 'refresh'): void
}>()

const modelValue = defineModel<Partial<CategoryWithTranslations>>({ required: true })

const { availableLocales } = useI18n()

async function handleUpsertCategory() {
  modelValue.value.id ? await editCategory() : await addCategory()
}

function resetStateCategory() {
  modelValue.value.translations = { fr: '', en: '', es: '' }
  modelValue.value.id = undefined
}

async function addCategory(): Promise<void> {
  try {
    const translationsArray = Object.entries(modelValue.value.translations ?? {}).map(
      ([lang, name]) => ({
        language: lang,
        name
      })
    )
    const addedCategoryId = await addItemCategory({ translations: translationsArray })
    itemCategorySuccess(addedCategoryId, 'added')
    emits('refresh')
    resetStateCategory()
  } catch (error: any) {
    toastError(error.statusCode, error.statusMessage)
  }
}

async function editCategory(): Promise<void> {
  try {
    const translationsArray = Object.entries(modelValue.value.translations ?? {}).map(
      ([lang, name]) => ({
        language: lang,
        name
      })
    )
    const editedCategoryId = await editItemCategory({
      id: modelValue.value.id!,
      translations: translationsArray
    })
    itemCategorySuccess(editedCategoryId, 'edited')
    emits('refresh')
    resetStateCategory()
  } catch (error: any) {
    toastError(error.statusCode, error.statusMessage)
  }
}
</script>
