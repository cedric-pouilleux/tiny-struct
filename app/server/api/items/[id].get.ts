import { ItemsService } from '@/server/services/items.service'

export default defineEventHandler(async (event) => {
  const idParam = getRouterParam(event, 'id')
  const id = Number(idParam)

  if (isNaN(id)) {
    return sendError(event, createError({ statusCode: 400, statusMessage: 'Invalid ID' }))
  }

  const item = await ItemsService.getOne(id)

  if (!item) {
    return sendError(event, createError({ statusCode: 404, statusMessage: 'Item not found' }))
  }

  return {
    success: true,
    data: item
  }
})
