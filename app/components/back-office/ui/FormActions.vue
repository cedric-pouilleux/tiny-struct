<template>
  <div class="flex justify-end mt-2">
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
      size="sm"
      :trailing-icon="editMode ? 'bytesize:edit' : 'mingcute:plus-fill'"
      :label="editMode ? 'Edit' : 'Add'"
      variant="outline"
      @click="emits('upsert')"
    />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  editMode: boolean
}>()

const emits = defineEmits<{
  (e: 'upsert'): void
  (e: 'close'): void
}>()
</script>
