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
    <UTooltip arrow :delay-duration="0" text="Open STL" :content="{ side: 'top', align: 'start' }">
      <UButtonGroup>
        <UButton variant="solid" size="xs" @click="handleStlView('master')">Master STL</UButton>
        <UButton variant="solid" size="xs" @click="handleStlView('mold')">Mold STL</UButton>
        <UButton variant="solid" size="xs" @click="handleStlView('final')">Final STL</UButton>
      </UButtonGroup>
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
import ItemStlViewModal from './ItemStlViewModal.vue'

const props = defineProps<{
  id: number
  price: string
  scale: string
  createdAt: string
  publish: boolean
  stlMold: string
  stlFinal: string
  stlMaster: string
}>()

const modal = useOverlay().create(ItemStlViewModal)

async function handleStlView(stlType: string) {
  switch (stlType) {
    case 'master':
      await modal.open({ stlUrl: getStlUrl(props.stlMaster) })
      break
    case 'mold':
      await modal.open({ stlUrl: getStlUrl(props.stlMold) })
      break
    case 'final':
      await modal.open({ stlUrl: getStlUrl(props.stlFinal) })
      break
  }
}

function getStlUrl(name: string): string {
  return `/api/stl/${name.replace(/\.stl$/i, '')}`
}
</script>
