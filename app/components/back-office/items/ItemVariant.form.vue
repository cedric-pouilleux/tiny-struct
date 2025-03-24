<template>
  <UForm :state="modelValue">
    <div class="flex justify-between items-center">
      <h3 v-if="!modelValue.id" class="my-4">Add item variant</h3>
    </div>
    <div class="flex gap-4">
      <UFormField label="Publish" class="text-center">
        <USwitch v-model="modelValue.publish" class="inline-block" size="xl" />
      </UFormField>
      <UFormField label="Scale">
        <USelect v-model="modelValue.scaleId" :items="formattedScales" class="w-20" />
      </UFormField>
      <UFormField label="Price">
        <UButtonGroup>
          <UBadge color="neutral" variant="outline" size="lg" label="€" />
          <UInput v-model="modelValue.price" :items="formattedScales" class="w-16" />
        </UButtonGroup>
      </UFormField>
      <UFormField label="STL Master File">
        <UInput type="file" accept=".stl" @change="onStlMasterChange" />
      </UFormField>
      <UFormField label="STL Mold File">
        <UInput type="file" accept=".stl" @change="onStlMoldChange" />
      </UFormField>
      <UFormField label="STL Final File">
        <UInput type="file" accept=".stl" @change="onStlFinalChange" />
      </UFormField>
    </div>
    <UFormField label="Description" class="flex-grow">
      <UTabs :items="tabsLanguages" class="w-full" size="xs" default-value="fr">
        <template #content="{ item }">
          <UTextarea v-model="modelValue.translations![item.value]" class="w-full" />
        </template>
      </UTabs>
    </UFormField>
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
        @click="handleSave"
      />
    </div>
  </UForm>
</template>

<script lang="ts" setup>
import type { ItemVariantAddPayload } from '~/server/api/item/variant/add'
import type { ItemVariantEditPayload } from '~/server/api/item/variant/edit'

const modelValue = defineModel<Partial<ItemVariantAddPayload & ItemVariantEditPayload>>({
  required: true
})

const scaleStore = useScaleStore()
const { scales } = storeToRefs(scaleStore)
const { tabsLanguages } = useLanguages()

const emits = defineEmits<{
  (e: 'save'): void
  (e: 'close'): void
}>()

const formattedScales = computed(() =>
  scales.value.map((item) => ({
    label: item.scale,
    value: item.id
  }))
)

// TODO => Use one event callback for all STL files
function onStlMasterChange(e: Event) {
  const target = e.target as HTMLInputElement
  if (target.files && target.files.length > 0) {
    modelValue.value.stlMasterFile = target.files[0]
  }
}
function onStlMoldChange(e: Event) {
  const target = e.target as HTMLInputElement
  if (target.files && target.files.length > 0) {
    modelValue.value.stlMoldFile = target.files[0]
  }
}
function onStlFinalChange(e: Event) {
  const target = e.target as HTMLInputElement
  if (target.files && target.files.length > 0) {
    modelValue.value.stlFinalFile = target.files[0]
  }
}

function handleSave() {
  emits('save')
}
</script>
