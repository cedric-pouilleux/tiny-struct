<template>
  <div>
    <UButton
      size="xs"
      variant="link"
      icon="i-lucide-chevron-down"
      color="neutral"
      class="pr-4 mr-2"
      :label="`${variantCount || 0} variants`"
    />
    <UButtonGroup size="xs">
      <UTooltip
        arrow
        :delay-duration="0"
        text="Add new variant"
        :content="{ side: 'left', align: 'end' }"
      >
        <UButton variant="outline" icon="mingcute:plus-fill" @click.capture.stop="emits('add')" />
      </UTooltip>
      <UTooltip
        arrow
        :delay-duration="0"
        :text="`Last update : ${lastEditDate}`"
        :content="{ side: 'top', align: 'end' }"
      >
        <UButton
          icon="bytesize:edit"
          variant="outline"
          color="neutral"
          @click.capture.stop="emits('edit')"
        />
      </UTooltip>
      <UButton
        icon="fluent:delete-12-regular"
        variant="outline"
        color="error"
        @click="emits('remove')"
      />
    </UButtonGroup>
  </div>
</template>

<script lang="ts" setup>
defineProps<{
  variantCount?: number
  lastEditDate: string
}>()

const emits = defineEmits<{
  (e: 'edit'): void
  (e: 'remove'): void
  (e: 'add'): void
}>()
</script>
