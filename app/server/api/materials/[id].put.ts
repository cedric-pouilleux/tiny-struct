import { MaterialsService } from '@/server/services/materials.service'
import type { CreateMaterial } from '~/shared/types/materials'

export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'))

  if (isNaN(id)) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid material ID' })
  }

  const body = await readBody<CreateMaterial>(event)

  if (!body.descriptions.length || !body.names.length) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Materials description and names required'
    })
  }

  const updatedId = await MaterialsService.update({ id, ...body })

  return {
    success: true,
    id: updatedId
  }
})
