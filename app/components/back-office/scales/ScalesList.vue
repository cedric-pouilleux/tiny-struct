<template>
  <ul v-if="scales?.length" class="text-sm divide-y divide-gray-100 divide-solid">
    <li v-for="scale in scales" :key="scale.id" class="py-2 flex justify-between items-center">
      {{ scale.scale }}
      <UButtonGroup size="xs">
        <UButton
          icon="bytesize:edit"
          variant="outline"
          color="neutral"
          @click="emits('edit', scale)"
        />
        <UButton
          icon="fluent:delete-12-regular"
          color="error"
          variant="outline"
          @click="handleRemove(scale.id)"
        />
      </UButtonGroup>
    </li>
  </ul>
  <div class="text-sm" v-else>No scale</div>
</template>

<script lang="ts" setup>
import type { Scale } from '~/server/db/schema'
import RemoveConfirmModal from '../ui/RemoveConfirmModal.vue'

const overlay = useOverlay()
const modal = overlay.create(RemoveConfirmModal, {
  props: {
    title: 'Are your sure to want delete this scale ?'
  }
})

defineProps<{
  scales: Scale[]
}>()

const emits = defineEmits<{
  (e: 'remove', scaleId: number): void
  (e: 'edit', scale: Scale): void
}>()

async function handleRemove(scaleId: number) {
  const confirm = await modal.open()
  if (confirm) {
    emits('remove', scaleId)
  }
}
</script>
