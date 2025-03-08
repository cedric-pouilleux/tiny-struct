<template>
  {{ users }}
</template>

<script lang="js" setup>
const users = await $fetch('/api/users/users', {
  method: 'GET'
})
</script>

<style scoped lang="scss"></style>
