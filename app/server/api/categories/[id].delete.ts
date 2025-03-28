import { CategoriesService } from '~/server/services/categories.service'

export default defineEventHandler(async (event) => {
  const idParam = getRouterParam(event, 'id')

  if (!idParam) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid ID' })
  }

  const id = Number(idParam)

  await CategoriesService.remove(id)

  return { success: true, id }
})
