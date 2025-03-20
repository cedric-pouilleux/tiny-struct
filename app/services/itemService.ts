import type { ItemAddPayload } from '~/server/api/item/add'
import type { ItemReponse } from '~/server/api/item/all.get'
import type { ItemEditPayload } from '~/server/api/item/edit'

export function getItems(): Promise<ItemReponse[]> {
  return $fetch<ItemReponse[]>('/api/item/all')
}

export function addItem(payload: ItemAddPayload): Promise<number> {
  return $fetch<number>('/api/item/add', {
    method: 'POST',
    body: payload
  })
}

export function editItem(payload: ItemEditPayload): Promise<number> {
  return $fetch<number>('/api/item/edit', {
    method: 'PUT',
    body: payload
  })
}
