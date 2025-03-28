<template>
  <ul v-if="data?.length" class="text-sm divide-y divide-gray-100 divide-solid">
    <li v-for="item in data" :key="item.id" class="py-2 flex justify-between items-center">
      {{ item.value }}
      <UButtonGroup size="xs">
        <UButton
          icon="bytesize:edit"
          variant="outline"
          color="neutral"
          @click="emits('edit', item.id)"
        />
        <UButton
          icon="fluent:delete-12-regular"
          color="error"
          variant="outline"
          @click="handleOpenRemoveModal(item.id)"
        />
      </UButtonGroup>
    </li>
  </ul>
  <div class="text-sm" v-else>No data in database</div>
</template>

<script lang="ts" setup>
import RemoveConfirmModal from '~/components/back-office/ui/RemoveConfirmModal.vue'

defineProps<{
  data: { id: number; value: string }[]
}>()

const overlay = useOverlay()

const modal = overlay.create(RemoveConfirmModal, {
  props: {
    title: 'Are your sure to want delete this data ?'
  }
})

async function handleOpenRemoveModal(id: number) {
  const confirm = await modal.open()
  if (confirm) {
    emits('remove', id)
  }
}

const emits = defineEmits<{
  (e: 'edit', value: number): void
  (e: 'remove', value: number): void
}>()
</script>
