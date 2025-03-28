<template>
  <UCard>
    <template #header>
      <RightColumnHeader
        :model-value="isOpenForm"
        title="Materials"
        @update:model-value="handleNew"
      />
    </template>
    <MaterialsForm v-if="isOpenForm" v-model="material">
      <FormActions :edit-mode="!!material.id" @upsert="handleUpsert" @close="isOpenForm = false" />
    </MaterialsForm>
    <RightColumnList
      :data="currentLocaleMaterials"
      @edit="handleEditMaterial"
      @remove="handleRemoveMaterial"
    />
  </UCard>
</template>

<script lang="ts" setup>
import type { FormMaterial } from '~/shared/types/materials'
import MaterialsForm from './MaterialsForm.vue'
import { useMaterialsStore } from '~/stores/useMaterials.store'
import RightColumnList from '../ui/RightColumnList.vue'
import RightColumnHeader from '../ui/RightColumnHeader.vue'
import FormActions from '../ui/FormActions.vue'
import { useLanguages } from '~/composables/useLanguages'
import { useServiceToast } from '~/composables/useServiceToast'

const { locale } = useI18n()
const { recordLanguageDefaultField } = useLanguages()
const { defaultSuccessToaster, toastError } = useServiceToast()

const defaultMaterial: FormMaterial = {
  id: undefined,
  descriptions: recordLanguageDefaultField(),
  names: recordLanguageDefaultField()
}

const material = reactive<FormMaterial>({ ...defaultMaterial })

const materialStore = useMaterialsStore()
const { materialsWithRecordTranslation } = storeToRefs(materialStore)

const currentLocaleMaterials = computed<{ id: number; value: string }[]>(() =>
  materialsWithRecordTranslation.value.map((material) => ({
    id: material.id,
    value: material.names[locale.value]
  }))
)

const isOpenForm = ref<boolean>(false)

function handleEditMaterial(id: number) {
  if (isOpenForm.value && material.id === id) {
    isOpenForm.value = false
  } else {
    isOpenForm.value = true
  }
  Object.assign(
    material,
    materialsWithRecordTranslation.value.find((material) => material.id === id)
  )
}

function handleNew() {
  if (isOpenForm.value && !material.id) {
    isOpenForm.value = false
  } else {
    isOpenForm.value = true
    Object.assign(material, {
      id: undefined,
      descriptions: recordLanguageDefaultField(),
      names: recordLanguageDefaultField()
    })
  }
}

async function handleUpsert() {
  try {
    const materialId = material.id
      ? await materialStore.edit(material as Required<FormMaterial>)
      : await materialStore.add(material)
    defaultSuccessToaster(
      `Material with id ${materialId} successfull ${material.id ? 'edited' : 'added'}`
    )
    isOpenForm.value = false
  } catch (error: any) {
    toastError(error.statusCode, error.statusMessage)
  }
}

async function handleRemoveMaterial(id: number) {
  try {
    const materialId = await materialStore.remove(id)
    defaultSuccessToaster(`Material with id ${materialId} successfull removed`)
  } catch (error: any) {
    toastError(error.statusCode, error.statusMessage)
  }
}
</script>
