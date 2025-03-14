<template>
  <UModal v-if="!loggedIn">
    <UButton icon="healthicons:ui-user-profile" :label="t('navigation.account')" color="primary" />
    <template #content>
      <p>{{ t('navigation.account.signin') }}</p>
      <br />
      <div>
        <UButton icon="uil:google" @click="userStore.openInPopup('/api/auth/google')">
          {{ t('navigation.account.signin.google') }}
        </UButton>
      </div>
    </template>
  </UModal>
  <UDropdownMenu
    v-else
    :items="accountItems"
    :content="{
      align: 'end',
      side: 'bottom'
    }"
    :ui="{
      content: 'w-48'
    }"
  >
    <UButton
      :avatar="{
        src: user?.picture
      }"
      :label="user?.name"
      color="neutral"
      variant="ghost"
    />
  </UDropdownMenu>
</template>

<script lang="ts" setup>
const userStore = useUserStore()
const { loggedIn, user } = storeToRefs(userStore)

const { t } = useI18n()
const localePath = useLocalePath()

const accountItems = ref([
  {
    label: t('navigation.account.profile'),
    icon: 'healthicons:ui-user-profile'
  },
  {
    label: t('navigation.account.orders'),
    icon: 'material-symbols:orders'
  },
  {
    label: t('navigation.account.admin'),
    to: localePath('administration'),
    icon: 'eos-icons:admin-outlined'
  },
  {
    label: t('navigation.account.signout'),
    icon: 'uil:sign-out-alt',
    onSelect() {
      userStore.clear()
    }
  }
])
</script>
