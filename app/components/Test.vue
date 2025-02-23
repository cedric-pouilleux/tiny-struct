<template>
  <h1 data-testid="title">{{ title }}</h1>
</template>

<script lang="ts" setup>
defineProps<{
  title: string
}>()
</script>
