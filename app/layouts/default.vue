<template>
  <header>
    <div class="inner">
      <div class="logotype">
        <h1 data-testid="main-title">
          <NuxtLink to="/">Tiny struct</NuxtLink>
        </h1>
      </div>

      <!-- Navigation -->
      <nav class="menu">
        <NuxtLink to="/shop">Shop</NuxtLink>
        <NuxtLink to="/workshop">workshop</NuxtLink>
      </nav>

      <!-- Account options -->
      <nav class="options">
        <Icon class="user-icon" name="healthicons:ui-user-profile" size="24px" />
        <div class="separate"></div>
        <div class="panier nav-button count">
          <Icon name="entypo:shopping-bag" /> Cart <span class="tag">{{ countItems }}</span>
        </div>
        <div class="panier nav-button"><Icon name="material-symbols:orders" />Order</div>
        <div class="separate"></div>
        <LoginItem
          class="nav-button"
          v-if="loggedIn && user"
          :avatar="currentUser.picture"
          :name="currentUser.name"
          @unlog="clear"
        />
        <template v-else>
          <button class="nav-button" @click="openInPopup('/api/auth/google')">
            <Icon name="uil:google" size="18px" />
            <span>Login</span>
          </button>
        </template>
      </nav>
    </div>
  </header>

  <!-- Injected Content -->
  <section class="content">
    <div class="inner">
      <slot />
    </div>
  </section>

  <!-- Footer -->
  <footer></footer>
</template>

<script setup lang="ts">
import LoginItem from '../components/LoginItem.vue'

type GoogleUser = {
  sub: string // ID Google unique
  name: string
  given_name: string
  family_name: string
  picture: string // URL de la photo de profil
  email: string
  email_verified: boolean
  locale: string
}

const { loggedIn, user, openInPopup, clear } = useUserSession()

const currentUser = computed(() => user.value as GoogleUser)

const countItems = computed(() => 0)
</script>

<style lang="scss" scoped>
header {
  background-color: #333;
  color: #fff;

  h1 a {
    color: #fff;
  }

  .inner {
    .user-icon {
      color: #777;
    }

    width: 70%;
    margin: auto;
    display: flex;
    justify-content: space-between;

    .separate {
      box-sizing: border-box;
      padding: 4px 0;
      margin: 4px;
      width: 1px;
      height: 100%;
      background-color: #444;
    }

    .options {
      display: flex;
      column-gap: 5px;
      align-items: center;
    }

    .account {
      display: flex;
      column-gap: 12px;
      align-items: center;
    }

    .menu {
      display: flex;
      column-gap: 16px;
      align-items: center;
      a {
        cursor: pointer;
        color: #fff;
      }
    }
  }
}

.content {
  margin-top: 12px;
  .inner {
    width: 70%;
    margin: auto;
  }
}
</style>
