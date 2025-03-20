<template>
  <div class="flex items-center gap-2">
    <UIcon name="mdi:navigate-next" />
    <UTooltip
      arrow
      :delay-duration="0"
      text="Variant ID"
      :content="{ side: 'top', align: 'start' }"
    >
      <UBadge variant="outline" size="sm">{{ id }}</UBadge>
    </UTooltip>
    <UBadge
      variant="outline"
      :icon="publish ? 'el:ok' : 'icon-park-solid:error'"
      :color="publish ? 'primary' : 'error'"
      >Publish</UBadge
    >
    <div class="w-16">{{ price }} €</div>
    <UBadge>{{ scale }}</UBadge>
    <UTooltip arrow :delay-duration="0" text="Created at" :content="{ side: 'top' }">
      <UBadge color="neutral" variant="outline">{{ createdAt }}</UBadge>
    </UTooltip>
  </div>
</template>

<script lang="ts" setup>
defineProps<{
  id: number
  price: string
  scale: string
  createdAt: string
  publish: boolean
}>()
</script>
