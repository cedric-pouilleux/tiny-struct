import type { AddItemCategoryPayload } from '~/server/api/item/category/add'
import type { CategoryResponse } from '~/server/api/item/category/all.get'

export function getItemsCategories(): Promise<CategoryResponse[]> {
  return $fetch<CategoryResponse[]>('/api/item/category/all')
}

// type EditItemCategoryPayload = AddItemCategoryPayload & { id: number }

export function editItemCategory(payload: any) {
  return $fetch<number>('/api/item/category/edit', {
    method: 'PUT',
    body: payload
  })
}

export function removeItemCategory(categoryId: number): Promise<number> {
  return $fetch<number>('/api/item/category/delete', {
    method: 'DELETE',
    body: {
      id: categoryId
    }
  })
}

export function addItemCategory(payload: AddItemCategoryPayload): Promise<number> {
  return $fetch<number>('/api/item/category/add', {
    method: 'POST',
    body: payload
  })
}
