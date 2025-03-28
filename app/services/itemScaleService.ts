import type { Scale } from '~/server/db/types/scales'

export function getItemsScale(): Promise<Scale[]> {
  return $fetch<Scale[]>('/api/scales')
}

export function addItemScale(scale: string): Promise<number> {
  return $fetch<number>('/api/scales', {
    method: 'POST',
    body: {
      scale
    }
  })
}

export function editItemScale(payload: Scale): Promise<number> {
  return $fetch<number>(`/api/scales/${payload.id}`, {
    method: 'PUT',
    body: payload
  })
}

export function removeItemScale(scaleId: number): Promise<number> {
  return $fetch<number>(`/api/scales/${scaleId}`, {
    method: 'DELETE'
  })
}
