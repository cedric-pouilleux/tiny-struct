<template>
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
          @click="emits('edit', category)"
        />
        <UButton
          icon="fluent:delete-12-regular"
          color="error"
          variant="outline"
          @click="handleRemove(category.id)"
        />
      </UButtonGroup>
    </li>
  </ul>
  <div class="text-sm border border-orange-200 rounded-md p-1 pl-4" v-else>No categories</div>
</template>

<script lang="ts" setup>
import type { CategoryResponse } from '~/server/api/item/category/all.get'
import RemoveConfirmModal from '~/components/back-office/ui/RemoveConfirmModal.vue'

defineProps<{
  categories: CategoryResponse[]
}>()

const { locale } = useI18n()
const overlay = useOverlay()

const modal = overlay.create(RemoveConfirmModal, {
  props: {
    title: 'Are your sure to want delete this category ?'
  }
})

async function handleRemove(categoryId: number) {
  const confirm = await modal.open()
  if (confirm) {
    emits('remove', categoryId)
  }
}

const emits = defineEmits<{
  (e: 'edit', value: CategoryResponse): void
  (e: 'remove', value: number): void
}>()
</script>
