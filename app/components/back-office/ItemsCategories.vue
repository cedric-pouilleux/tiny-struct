<template>
  <header class="flex justify-between items-center border-b border-gray-100 py-2 mb-3">
    <h2>Categories</h2>
    <UButton
      icon="mingcute:plus-fill"
      size="xs"
      label="New"
      :variant="isOpenCategoryForm ? 'outline' : 'solid'"
      @click="handleAddNewCategory"
    />
  </header>
  <section
    v-if="isOpenCategoryForm"
    data-testid="category-form"
    class="mb-4 border-b border-gray-100 pb-4"
  >
    <UForm :state="category" class="w-full" @submit="addCategory">
      <UFormField label="Name" class="flex-1" size="sm">
        <UButtonGroup class="w-full mb-2" v-for="lang in supportedLanguages" :key="lang">
          <UBadge
            class="w-10 flex items-center justify-center"
            color="neutral"
            variant="outline"
            :label="lang"
          />
          <UInput v-model="category.translations![lang]" class="w-full" />
        </UButtonGroup>
      </UFormField>
      <div class="flex justify-end mt-2">
        <UButton
          type="submit"
          size="sm"
          :trailing-icon="category.id ? 'bytesize:edit' : 'mingcute:plus-fill'"
          :label="category.id ? 'Edit category' : 'Save category'"
          variant="outline"
        />
      </div>
    </UForm>
  </section>

  <ul v-if="categories?.length" class="text-sm divide-y divide-gray-100 divide-solid">
    <li
      v-for="category in categories"
      :key="category.id"
      class="py-2 flex justify-between items-center"
    >
      {{ category.translations[locale] || 'No translation' }}
      <UButtonGroup size="xs">
        <UButton
          icon="bytesize:edit"
          variant="outline"
          color="neutral"
          @click="handleEditCategory(category)"
        />
        <UButton
          icon="fluent:delete-12-regular"
          color="error"
          variant="outline"
          @click="handleRemoveCategory(category.id)"
        />
      </UButtonGroup>
    </li>
  </ul>
  <div class="text-sm border border-orange-200 rounded-md p-1 pl-4" v-else>No categories</div>
</template>

<script lang="ts" setup>
import type { CategoryWithTranslations } from '~/server/db/schema'
import RemoveConfirmModal from '~/components/back-office/RemoveConfirmModal.vue'
import { useI18n } from '#i18n'

defineProps<{
  categories?: CategoryWithTranslations[]
}>()

const emits = defineEmits<{
  (e: 'refresh'): void
}>()

const { locale } = useI18n()

const overlay = useOverlay()

const modal = overlay.create(RemoveConfirmModal, {
  props: {
    title: 'Are your sure to want delete this category ?'
  }
})

const supportedLanguages = ['fr', 'en', 'es']

const category = reactive<Partial<CategoryWithTranslations>>({
  id: undefined,
  translations: Object.fromEntries(supportedLanguages.map((lang) => [lang, ''])) as Record<
    string,
    string
  >
})

const isOpenCategoryForm = ref<boolean>(false)
const toast = useToast()

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
  const confirm = await modal.open()

  if (!confirm) {
    return
  }

  try {
    const data = await $fetch('/api/category/delete', {
      method: 'POST',
      body: {
        id
      }
    })
    toast.add({
      title: 'Category remove successfull',
      icon: 'mdi:success-bold',
      description: `Category id ${data.category.id} successfull deleted`,
      color: 'success'
    })
    emits('refresh')
  } catch (error: any) {
    toast.add({
      title: `Status code : ${error.statusCode}`,
      description: error.statusMessage || 'Unknown error',
      icon: 'fa:remove',
      color: 'error'
    })
  }
}

async function addCategory(): Promise<void> {
  try {
    const translationsArray = Object.entries(category.translations ?? {}).map(([lang, name]) => ({
      language: lang,
      name
    }))

    const data = await $fetch('/api/category/add', {
      method: 'POST',
      body: { id: category.id, translations: translationsArray }
    })

    toast.add({
      title: data.message,
      icon: 'mdi:success-bold',
      description: `Category ID: ${data.category?.id} with all translations`,
      color: 'success'
    })

    emits('refresh')
    category.translations = { fr: '', en: '', es: '' }
    category.id = undefined
  } catch (error: any) {
    toast.add({
      title: `Status code : ${error.statusCode ?? 'Unknown'}`,
      description: error.statusMessage || 'Unknown error',
      icon: 'fa:remove',
      color: 'error'
    })
  }
}
</script>
