import type { ItemReponse } from '~/server/api/_item/all.get'
import type { ItemEditPayload } from '~/server/api/_item/edit'
import type { CreateItemPayload, ItemWithTranslations } from '~/shared/types/items'

export function getItems(): Promise<ItemWithTranslations[]> {
  return $fetch<ItemReponse[]>('/api/items')
}

export function addItem(payload: CreateItemPayload): Promise<ItemWithTranslations> {
  return $fetch<ItemWithTranslations>('/api/items', {
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
