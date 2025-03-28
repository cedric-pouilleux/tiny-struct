import { MaterialsService } from '~/server/services/materials.service'

export default defineEventHandler(async (event) => {
  const idParam = getRouterParam(event, 'id')

  if (!idParam) {
    return sendError(event, createError({ statusCode: 400, statusMessage: 'Invalid ID' }))
  }

  const id = Number(idParam)

  const material = await MaterialsService.getOne(id)

  if (!material) {
    return sendError(event, createError({ statusCode: 404, statusMessage: 'Material not found' }))
  }

  return {
    success: true,
    data: material
  }
})
