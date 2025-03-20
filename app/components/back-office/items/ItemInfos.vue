<template>
  <div class="flex items-center gap-3">
    <UTooltip arrow :delay-duration="0" text="Item ID" :content="{ side: 'top', align: 'start' }">
      <UBadge size="sm">{{ id }}</UBadge>
    </UTooltip>
    <div>{{ name || 'No name ' }}</div>
    <UTooltip arrow :delay-duration="0" text="Category" :content="{ side: 'top' }">
      <UBadge variant="outline">{{ category || 'No category' }}</UBadge>
    </UTooltip>
    <UTooltip arrow :delay-duration="0" text="Created at" :content="{ side: 'top' }">
      <UBadge color="neutral" variant="outline">{{ createdAt }}</UBadge>
    </UTooltip>
  </div>
</template>

<script lang="ts" setup>
defineProps<{
  id: number
  name?: string
  category?: string
  createdAt: string
}>()
</script>
