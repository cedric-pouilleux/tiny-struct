import { ItemsService } from '@/server/services/items.service'
import type { CreateItemPayload } from '@/server/db/types/items'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const payload = body as CreateItemPayload

  const result = await ItemsService.create(payload)

  return {
    success: true,
    data: result
  }
})
