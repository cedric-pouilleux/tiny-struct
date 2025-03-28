<template>
  <header class="flex justify-between items-center">
    <h2>{{ title }}</h2>
    <UButton
      icon="mingcute:plus-fill"
      size="xs"
      label="New"
      :variant="open ? 'outline' : 'solid'"
      @click="open = !open"
    />
  </header>
</template>

<script lang="ts" setup>
defineProps<{
  title: string
}>()

const open = defineModel<boolean>({ required: true })
</script>
