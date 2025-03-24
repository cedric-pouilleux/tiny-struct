<template>
  <UCard
    variant="outline"
    :ui="{
      root: 'rounded-[calc(var(--ui-radius)*1.8)] my-2 mb-3',
      header: 'p-3 sm:px-3',
      body: 'sm:p-3'
    }"
  >
    <template #header>
      <div class="flex justify-between items-center">
        <h3>{{ modelValue.id ? 'Edit' : 'Add' }} item {{ modelValue.id }}</h3>
      </div>
    </template>
    <UForm :state="modelValue">
      <div class="flex gap-4">
        <UFormField label="Category">
          <USelect v-model="modelValue.categoryId" :items="categories" class="w-50" />
        </UFormField>
        <UFormField label="Name" class="flex-grow">
          <UButtonGroup class="w-full mb-2" v-for="lang in tabsLanguages" :key="lang.value">
            <UBadge
              class="w-10 flex items-center justify-center"
              color="neutral"
              variant="outline"
              :label="lang.value"
            />
            <UInput v-model="modelValue.translations[lang.value]" class="w-full" />
          </UButtonGroup>
        </UFormField>
      </div>
      <div class="flex justify-end mt-4">
        <UButton
          class="mr-3"
          icon="nrk:back"
          variant="link"
          color="error"
          label="Close"
          size="xs"
          @click="emits('close')"
        />
        <UButton
          icon="mingcute:plus-fill"
          :label="modelValue.id ? 'Save' : 'Add'"
          size="xs"
          @click="handleUpsertItem"
        />
      </div>
    </UForm>
  </UCard>
</template>

<script lang="ts" setup>
import { UInput } from '#components'
import type { ItemAddPayload } from '~/server/api/item/add'
import { addItem, editItem } from '~/services/itemService'

const { toastError, itemSuccess } = useServiceToast()
const { tabsLanguages } = useLanguages()

type ItemFormPayload = Partial<Pick<ItemAddPayload, 'categoryId'>> & {
  id?: number
  translations: Record<string, string>
}

defineProps<{
  categories: {
    label: string
    value: number
  }[]
}>()

const emits = defineEmits<{
  (e: 'refresh'): void
  (e: 'close'): void
}>()

const modelValue = defineModel<ItemFormPayload>({ required: true })

async function handleUpsertItem() {
  modelValue.value.id ? await handleEditItem() : await handleAddItem()
}

async function handleAddItem(): Promise<void> {
  try {
    if (!modelValue.value.categoryId) {
      return
    }
    const addedItemId = await addItem({
      categoryId: modelValue.value.categoryId,
      translations: Object.entries(modelValue.value.translations).map(([language, name]) => ({
        language,
        name
      }))
    })
    itemSuccess(addedItemId, 'added')
    emits('refresh')
  } catch (error: any) {
    toastError(error.statusCode, error.statusMessage)
  }
}

async function handleEditItem(): Promise<void> {
  try {
    if (!modelValue.value.id) {
      return
    }
    const addedItemId = await editItem({
      id: modelValue.value.id,
      categoryId: modelValue.value.categoryId,
      translations: Object.entries(modelValue.value.translations).map(([language, name]) => ({
        language,
        name
      }))
    })
    itemSuccess(addedItemId, 'edited')
    emits('refresh')
  } catch (error: any) {
    toastError(error.statusCode, error.statusMessage)
  }
}
</script>
