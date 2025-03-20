<template>
  <UForm :state="modelValue" class="">
    <div class="flex justify-between items-center">
      <h3 v-if="!modelValue.id">Add item variant</h3>
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
      <UFormField label="STL File">
        <UInput v-model="modelValue.stlFile" class="w-26" />
      </UFormField>
      <UFormField label="Description" class="flex-grow">
        <UTabs :items="tabsLanguages" class="w-full" size="xs" default-value="fr">
          <template #content="{ item }">
            <UTextarea v-model="modelValue.translations![item.value]" class="w-full" />
          </template>
        </UTabs>
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
        @click="emits('save')"
      />
    </div>
  </UForm>
</template>

<script lang="ts" setup>
import type { ItemVariantInsert } from '~/server/db/schema'

const modelValue = defineModel<Partial<ItemVariantInsert>>({ required: true })

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
</script>
