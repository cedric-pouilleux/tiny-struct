import type { CategoryResponse } from '~/server/api/item/category/all.get'
import { getItemsCategories } from '~/services/itemCategoryService'

type CategorySelect = {
  label: string
  value: number
}

export const useCategoryStore = defineStore('categories', () => {
  const categories = ref<CategoryResponse[]>([])

  const formattedSelectCategories = computed<CategorySelect[]>(() =>
    categories.value.map((item: CategoryResponse) => ({
      label: item.translations['fr'] || Object.values(item.translations)[0],
      value: item.id
    }))
  )

  async function fetchCategories(): Promise<void> {
    if (categories.value.length) {
      return
    }
    try {
      categories.value = await getItemsCategories()
    } catch (error: any) {
      console.log(error)
    }
  }

  async function refreshCategories() {
    try {
      categories.value = await getItemsCategories()
    } catch (error: any) {
      console.log(error)
    }
  }

  return {
    categories,
    fetchCategories,
    formattedSelectCategories,
    refreshCategories
  }
})
