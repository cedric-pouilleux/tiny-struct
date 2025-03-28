<template>
  <UForm :state="material" class="w-full">
    <UAccordion
      v-model="accordeonSelected"
      :items="accordionLanguages"
      type="multiple"
      :ui="{ trigger: 'py-1.5' }"
    >
      <template #content="{ item }">
        <UFormField size="xs" class="mt-3">
          <UInput v-model="material.names[item.value!]" class="w-full" placeholder="Name" />
        </UFormField>
        <UFormField size="xs" class="mt-3 mb-2">
          <UTextarea
            v-model="material.descriptions[item.value!]"
            class="w-full"
            placeholder="Description"
          />
        </UFormField>
      </template>
    </UAccordion>
    <slot />
  </UForm>
</template>

<script setup lang="ts">
import type { FormMaterial } from '~/shared/types/materials'

const material = defineModel<FormMaterial>({ required: true })

const { locale } = useI18n()
const { accordionLanguages } = useLanguages()

const accordeonSelected = ref<string[]>([locale.value])
</script>
