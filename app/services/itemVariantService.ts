import type { ItemVariantAddPayload, ItemVariantAddResponse } from '~/server/api/item/variant/add'
import type { ItemVarianEditPayload, ItemVarianEditResponse } from '~/server/api/item/variant/edit'
import type { ItemVariantRemoveResponse } from '~/server/api/item/variant/remove'

export async function removeItemVariant(variantId: number): Promise<ItemVariantRemoveResponse> {
  return await $fetch<ItemVariantRemoveResponse>('/api/item/variant/remove', {
    method: 'DELETE',
    query: { variantId }
  })
}

export async function addItemVariant(
  payload: Partial<ItemVariantAddPayload>
): Promise<ItemVariantAddResponse> {
  return await $fetch<ItemVariantAddResponse>('/api/item/variant/add', {
    method: 'POST',
    body: payload
  })
}

export async function editItemVariant(
  payload: Partial<ItemVarianEditPayload>
): Promise<ItemVarianEditResponse> {
  return await $fetch<ItemVarianEditResponse>('/api/item/variant/edit', {
    method: 'PUT',
    body: payload
  })
}
