import { MaterialsService } from '~/server/services/materials.service'
import { CreateMaterial } from '~/shared/types/materials'

export default defineEventHandler(async (event) => {
  const body = await readBody<CreateMaterial>(event)

  if (!body.descriptions.length || !body.names.length) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Materials description and names required'
    })
  }

  const id = await MaterialsService.create(body)

  return { success: true, id }
})
