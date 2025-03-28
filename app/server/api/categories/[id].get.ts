import { CategoriesService } from '~/server/services/categories.service'

export default defineEventHandler(async (event) => {
  const idParam = getRouterParam(event, 'id')

  if (!idParam) {
    return sendError(event, createError({ statusCode: 400, statusMessage: 'Invalid ID' }))
  }

  const id = Number(idParam)

  const category = await CategoriesService.getOne(id)

  if (!category) {
    return sendError(event, createError({ statusCode: 404, statusMessage: 'Category not found' }))
  }

  return {
    success: true,
    data: category
  }
})
