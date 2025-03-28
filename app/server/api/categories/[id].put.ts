import { CategoriesService } from '~/server/services/categories.service'
import type { UpdateCategoryPayload } from '~/shared/types/categories'

export default defineEventHandler(async (event) => {
  const idParam = getRouterParam(event, 'id')

  if (!idParam) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid ID' })
  }

  const id = Number(idParam)

  const body = await readBody<UpdateCategoryPayload>(event)

  const updated = await CategoriesService.update({ id, ...body })

  return {
    success: true,
    updated
  }
})
