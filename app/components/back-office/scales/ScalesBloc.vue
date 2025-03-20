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
        <h2>Scales</h2>
        <UButton
          icon="mingcute:plus-fill"
          size="xs"
          label="New"
          :variant="isFormOpen ? 'outline' : 'solid'"
          @click="handleAdd"
        />
      </header>
    </template>
    <ScaleForm :open="isFormOpen" v-model="stateScale" @refresh="scaleStore.refreshScales()" />
    <ScalesList :scales="scales" @remove="handleRemove" @edit="handleEdit" />
  </UCard>
</template>

<script lang="ts" setup>
import type { Scale } from '~/server/db/schema'
import { removeItemScale } from '~/services/itemScaleService'
import ScalesList from './ScalesList.vue'
import ScaleForm from './ScaleForm.vue'

const scaleStore = useScaleStore()
const { scales } = storeToRefs(scaleStore)
const { itemScaleSuccess, toastError } = useServiceToast()

const stateScale = reactive<Partial<Scale>>({
  scale: undefined,
  id: undefined
})

const isFormOpen = ref<boolean>(false)

function resetState() {
  stateScale.id = undefined
  stateScale.scale = ''
}

function handleAdd(): void {
  if (isFormOpen.value && stateScale.id) {
    return resetState()
  }
  isFormOpen.value = !isFormOpen.value
}

function handleEdit(pScale: Scale) {
  stateScale.id = pScale.id
  stateScale.scale = pScale.scale
  isFormOpen.value = true
}

async function handleRemove(scaleId: number) {
  try {
    const removedScaleId = await removeItemScale(scaleId)
    itemScaleSuccess(removedScaleId, 'removed')
    await scaleStore.refreshScales()
  } catch (error: any) {
    toastError(error.statusCode, error.statusMessage)
  }
}
</script>
