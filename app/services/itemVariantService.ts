import type { ItemVariantAddResponse } from '~/server/api/_item/variant/add'
import type { ItemVarianEditPayload, ItemVarianEditResponse } from '~/server/api/_item/variant/edit'
import type { ItemVariantRemoveResponse } from '~/server/api/_item/variant/remove'

export async function removeItemVariant(variantId: number): Promise<ItemVariantRemoveResponse> {
  return await $fetch<ItemVariantRemoveResponse>('/api/item/variant/remove', {
    method: 'DELETE',
    query: { variantId }
  })
}

export async function addItemVariant(payload: FormData): Promise<ItemVariantAddResponse> {
  return await $fetch<ItemVariantAddResponse>('/api/item/variant/add', {
    method: 'POST',
    body: payload
  })
}

export async function editItemVariant(payload: FormData): Promise<ItemVarianEditResponse> {
  return await $fetch<ItemVarianEditResponse>('/api/item/variant/edit', {
    method: 'PUT',
    body: payload
  })
}
