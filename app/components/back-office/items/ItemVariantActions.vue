<template>
  <div>
    <UButtonGroup size="xs">
      <UTooltip
        arrow
        :delay-duration="0"
        :text="`Last update : ${lastEditDate}`"
        :content="{ side: 'left', align: 'end' }"
      >
        <UButton icon="bytesize:edit" variant="outline" color="neutral" @click="emits('edit')" />
      </UTooltip>
      <!-- <UTooltip
        arrow
        :delay-duration="0"
        text="Duplicate variant" 
        :content="{ side: 'top', align: 'end' }"
      >
        <UButton icon="bx:duplicate" variant="outline" @click="emits('duplicate')" />
      </UTooltip> -->
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
  lastEditDate: string
}>()

const emits = defineEmits<{
  (e: 'edit'): void
  (e: 'remove'): void
  (e: 'duplicate'): void
}>()
</script>
