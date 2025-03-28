<template>
  <UForm :state="category" class="w-full">
    <UAccordion
      v-model="accordeonSelected"
      :items="accordionLanguages"
      type="multiple"
      :ui="{ trigger: 'py-1.5' }"
    >
      <template #content="{ item }">
        <UFormField size="xs" class="mt-3">
          <UInput v-model="category.names[item.value!]" class="w-full" placeholder="Name" />
        </UFormField>
        <UFormField size="xs" class="mt-3 mb-2">
          <UTextarea
            v-model="category.descriptions[item.value!]"
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
import type { FormCategory } from '~/shared/types/categories'

const category = defineModel<FormCategory>({ required: true })

const { locale } = useI18n()
const { accordionLanguages } = useLanguages()

const accordeonSelected = ref<string[]>([locale.value])
</script>
