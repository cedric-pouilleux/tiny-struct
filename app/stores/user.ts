import { defineStore } from 'pinia'
import type { User, users } from '~/server/db/schema'

type GoogleUser = {
  sub: string // ID Google unique
  name: string
  given_name: string
  family_name: string
  picture: string
  email: string
  email_verified: boolean
  locale: string
}

export const useUserStore = defineStore('user', () => {
  const { loggedIn, user, openInPopup, clear } = useUserSession()

  const googleUser = computed<GoogleUser | null>(() => (user.value as GoogleUser) || null)
  const fetchedUser = ref<User | null>(null)

  async function registerUser() {
    if (!loggedIn.value || !googleUser.value) return
    try {
      const response = await $fetch<{ success: boolean; user: User[] }>('/api/auth/callback', {
        method: 'POST',
        body: {
          name: googleUser.value.name,
          email: googleUser.value.email,
          picture: googleUser.value.picture
        }
      })

      if (response.success && response.user.length) {
        fetchedUser.value = response.user[0]
      }
    } catch (error) {
      console.error("Erreur lors de l'enregistrement de l'utilisateur:", error)
    }
  }

  return { loggedIn, user: googleUser, openInPopup, clear, registerUser, fetchedUser }
})
