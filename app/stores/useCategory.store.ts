import type { CategoryWithTranslations, FormCategory } from '~/shared/types/categories'
import {
  addCategory,
  editCategory,
  getCategories,
  removeCategory
} from '~/services/itemCategoryService'

type CategorySelect = {
  label: string
  value: number
}

export const useCategoryStore = defineStore('categories', () => {
  const categories = ref<CategoryWithTranslations[]>([])

  // Return fomatted categories displaying FR languages by default
  // TODO => Return current languages
  const formattedSelectCategories = computed<CategorySelect[]>(() =>
    categories.value.map((item) => {
      const translationsByLang = Object.fromEntries(item.names.map((t) => [t.language, t.name]))
      return {
        label: translationsByLang['fr'] || Object.values(translationsByLang)[0] || '',
        value: item.id
      }
    })
  )

  // Return formated mapping of category matching with generic form edit / add
  const categoriesWithRecordTranslation = computed<Required<FormCategory>[]>(() =>
    categories.value.map((category) => ({
      id: category.id,
      names: category.names.reduce<Record<string, string>>((acc, { language, name }) => {
        acc[language] = name
        return acc
      }, {}),
      descriptions: category.descriptions.reduce<Record<string, string>>(
        (acc, { language, description }) => {
          acc[language] = description
          return acc
        },
        {}
      )
    }))
  )

  async function fetchCategories(): Promise<void> {
    if (categories.value.length) return
    try {
      categories.value = await getCategories()
    } catch (error: any) {
      console.error(error)
    }
  }

  async function refreshCategories() {
    try {
      categories.value = await getCategories()
    } catch (error: any) {
      console.error(error)
    }
  }

  async function add(payload: FormCategory): Promise<number | void> {
    try {
      const editedId = await addCategory(payload)
      await refreshCategories()
      return editedId
    } catch (error: any) {
      console.error(error)
    }
  }

  async function edit(payload: Required<FormCategory>): Promise<number | void> {
    try {
      const editedId = await editCategory(payload)
      await refreshCategories()
      return editedId
    } catch (error: any) {
      console.error(error)
    }
  }

  async function remove(id: number): Promise<number | void> {
    try {
      const removedId = await removeCategory(id)
      await refreshCategories()
      return removedId
    } catch (error: any) {
      console.error(error)
    }
  }

  return {
    categories,
    fetchCategories,
    formattedSelectCategories,
    refreshCategories,
    categoriesWithRecordTranslation,
    add,
    edit,
    remove
  }
})
