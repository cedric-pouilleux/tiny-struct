<template>
  <UModal :close="{ onClick: () => emits('close') }" :title="stlUrl">
    <template #description> STL item viewer </template>
    <template #body>
      <div class="w-full h-[400px]">
        <Suspense>
          <TresCanvas preset="realistic" clear-color="#111111" render-mode="on-demand">
            <ModelScene :url="stlUrl" />
          </TresCanvas>
        </Suspense>
      </div>
    </template>

    <template #footer>
      <div class="flex gap-2">
        <UButton label="Close" @click="emits('close')" />
      </div>
    </template>
  </UModal>
</template>

<script setup lang="ts">
import ModelScene from './ModelScene.vue'

defineProps<{
  stlUrl: string
}>()

const emits = defineEmits<{
  (e: 'close'): void
}>()
</script>
