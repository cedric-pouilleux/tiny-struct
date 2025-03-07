<template>
  <img class="avatar" data-testid="login-avatar" :src="avatar" :alt="name" width="24" height="24" />
  <span class="name" data-testid="login-name">{{ name }}</span>
  <button @click="$emit('unlog')" class="nav-button">
    <Icon name="uim:unlock-alt" size="20px" />
    <div>Unlog</div>
  </button>
</template>

<script lang="ts" setup>
export type LoginItemType = {
  name: string
  avatar: string
}

defineProps<LoginItemType>()
defineEmits(['unlog'])
</script>

<style lang="scss" scoped>
:root {
  font-size: 0.8em;
}
.avatar {
  border-radius: 100%;
  margin-right: 4px;
}
.name {
  font-size: 0.8em;
  margin-right: 6px;
}
</style>
