import { ItemsService } from '@/server/services/items.service'

export default defineEventHandler(async () => {
  const result = await ItemsService.getAll()

  return {
    success: true,
    data: result
  }
})
