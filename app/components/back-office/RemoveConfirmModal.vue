<template>
  <UModal :close="{ onClick: () => emit('close', false) }" :title="title">
    <template #footer>
      <div class="flex gap-2">
        <UButton label="Yes" color="error" variant="outline" @click="emit('close', true)" />
        <UButton variant="outline" label="No" @click="emit('close', false)" />
      </div>
    </template>
  </UModal>
</template>

<script setup lang="ts">
defineProps<{
  title: string
}>()

const emit = defineEmits<{ close: [boolean] }>()
</script>
