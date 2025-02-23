import { defineStore } from 'pinia'
import { useUserStore } from './user'

export const useCartStore = defineStore('cart', () => {
  const cart = ref([])
  const userStore = useUserStore()
  const { fetchedUser } = storeToRefs(userStore)

  async function fetchCart() {
    if (!fetchedUser.value) return
    cart.value = await $fetch('/api/cart', {
      query: { userId: fetchedUser.value.id }
    })
  }

  async function addItem(itemId: number, quantity = 1) {
    if (!fetchedUser.value) return
    await $fetch('/api/cart/add', {
      method: 'POST',
      body: { userId: fetchedUser.value.id, itemId, quantity }
    })
    await fetchCart() // Met à jour le panier
  }

  async function removeItem(itemId: number) {
    if (!fetchedUser.value) return
    await $fetch('/api/cart/remove', {
      method: 'POST',
      body: { userId: fetchedUser.value.id, itemId }
    })
    await fetchCart() // Met à jour le panier
  }

  return { cart, fetchCart, addItem, removeItem }
})
