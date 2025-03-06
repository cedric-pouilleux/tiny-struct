<template>
  <h1>Tiny Struct</h1>
  <div v-if="loggedIn">
    <div class="account">
      <div class="avatar">
        <img :src="user.picture" :alt="user.name" width="24" height="24" />
      </div>
      <span>{{ user.name }}</span>
      <button @click="clear">
        <Icon name="uim:unlock-alt" size="20px" />
        <span>Unlog</span>
      </button>
    </div>
  </div>

  <div v-else>
    <div class="login">
      <button @click="openInPopup('/api/auth/google')">
        <Icon name="uil:google" size="22px" />
        <span>Login with Google</span>
      </button>
    </div>
  </div>
</template>

<script setup>
const { loggedIn, user, openInPopup, clear } = useUserSession()
</script>

<style lang="scss">
button {
  cursor: pointer;
  border-radius: 20px;
  background: none;
  display: flex;
  align-items: center;
  border: 1px solid #ebebeb;
  padding: 4px 10px 4px 8px;
  &:hover {
    background-color: #333;
    color: #fff;
  }
}

.login {
  button {
    border: 1px solid #ebebeb;
    gap: 4px;
  }
}

.account {
  border-radius: 20px;
  padding: 4px;
  align-items: center;
  gap: 12px;
  display: flex;
  img {
    border-radius: 100%;
  }
}
</style>
