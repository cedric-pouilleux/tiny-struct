import type { CategoryFormModel } from '~/shared/types/categories'

export function useCategories() {
  const { availableLocales } = useI18n()

  const category = reactive<CategoryFormModel>({
    id: undefined,
    translations: Object.fromEntries(availableLocales.map((lang) => [lang, '']))
  })

  function newCategory() {
    // reset category reactive
  }

  return {
    category
  }
}
