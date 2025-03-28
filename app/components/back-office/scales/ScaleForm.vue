<template>
  <UForm v-if="open" :state="modelValue" class="w-full" @submit="handleUpsertScale">
    <UFormField label="Name" class="flex-1" size="sm">
      <UInput v-model="modelValue.scale" class="w-full" />
    </UFormField>
    <div class="flex justify-end mt-2">
      <UButton
        type="submit"
        size="sm"
        :trailing-icon="modelValue.id ? 'bytesize:edit' : 'mingcute:plus-fill'"
        :label="modelValue.id ? 'Edit scale' : 'Save scale'"
        variant="outline"
      />
    </div>
  </UForm>
</template>

<script lang="ts" setup>
import type { Scale } from '~/server/db/types/scales'
import { addItemScale, editItemScale } from '~/services/itemScaleService'

defineProps<{
  open?: boolean
}>()

const emits = defineEmits<{
  (e: 'refresh'): void
}>()

const modelValue = defineModel<Partial<Scale>>({ required: true })

const { itemScaleSuccess, toastError } = useServiceToast()

async function handleUpsertScale() {
  modelValue.value.id ? await editScale() : await addScale()
}

async function editScale() {
  if (!modelValue.value.id || !modelValue.value.scale) {
    return
  }
  try {
    const scaleId = await editItemScale(modelValue.value as Scale)
    itemScaleSuccess(scaleId, 'edited')
    emits('refresh')
  } catch (error: any) {
    toastError(error.statusCode, error.statusMessage)
  }
}

async function addScale() {
  if (!modelValue.value.scale) {
    return
  }
  try {
    const scaleId = await addItemScale(modelValue.value.scale)
    itemScaleSuccess(scaleId, 'added')
    emits('refresh')
  } catch (error: any) {
    toastError(error.statusCode, error.statusMessage)
  }
}
</script>
