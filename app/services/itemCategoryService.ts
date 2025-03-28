import type {
  CategoryWithTranslations,
  FormCategory,
  CreateCategory
} from '~/shared/types/categories'

// TODO => Maibe externalize this logic ?
function categoriesMapper(formMaterial: FormCategory): CreateCategory {
  return {
    names: Object.entries(formMaterial.names).map(([language, name]) => ({
      language,
      name
    })),
    descriptions: Object.entries(formMaterial.descriptions).map(([language, description]) => ({
      language,
      description
    }))
  }
}

export async function getCategories(): Promise<CategoryWithTranslations[]> {
  const response = await $fetch<{ success: boolean; data: CategoryWithTranslations[] }>(
    '/api/categories'
  )
  return response.data
}

export async function addCategory(payload: FormCategory): Promise<number> {
  const mappedPayload = categoriesMapper(payload)
  const { category } = await $fetch<{ success: boolean; category: CategoryWithTranslations }>(
    '/api/categories',
    {
      method: 'POST',
      body: mappedPayload
    }
  )
  console.log(category)
  return category.id
}

export async function editCategory(payload: FormCategory): Promise<number> {
  const mappedPayload = categoriesMapper(payload)
  const { updated } = await $fetch<{ success: boolean; updated: CategoryWithTranslations }>(
    `/api/categories/${payload.id}`,
    {
      method: 'PUT',
      body: {
        ...mappedPayload,
        id: payload.id
      }
    }
  )
  return updated.id
}

export async function removeCategory(categoryId: number): Promise<number> {
  const response = await $fetch<{ success: boolean; id: number }>(`/api/categories/${categoryId}`, {
    method: 'DELETE'
  })
  return response.id
}
