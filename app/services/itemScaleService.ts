import type { ItemScaleAddPayload } from '~/server/api/item/scale/add'
import type { Scale } from '~/server/db/schema'

export function getItemsScale(): Promise<Scale[]> {
  return $fetch<Scale[]>('/api/item/scale/all')
}

export function addItemScale(payload: ItemScaleAddPayload): Promise<number> {
  return $fetch<number>('/api/item/scale/add', {
    method: 'POST',
    body: payload
  })
}

export function editItemScale(payload: Scale): Promise<number> {
  return $fetch<number>('/api/item/scale/edit', {
    method: 'PUT',
    body: payload
  })
}

export function removeItemScale(scaleId: number): Promise<number> {
  return $fetch<number>('/api/item/scale/delete', {
    method: 'DELETE',
    body: {
      id: scaleId
    }
  })
}
