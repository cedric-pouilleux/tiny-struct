<template>
  <ClientOnly>
    <!-- <Background /> -->
    <ProtectedRustStl />
  </ClientOnly>
</template>

<script lang="js" setup>
// import Background from '~/components/back-office/items/Background.vue'
import ProtectedRustStl from '~/components/back-office/items/ProtectedRustStl.vue'
// import ItemModelViewer from '~/components/back-office/items/ItemModelViewer.vue'

const users = await $fetch('/api/users/users', {
  method: 'GET'
})
</script>

<style scoped lang="scss"></style>
