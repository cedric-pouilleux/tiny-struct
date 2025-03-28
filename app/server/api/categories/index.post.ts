import { CategoriesService } from '~/server/services/categories.service'
import { CreateCategory } from '~/shared/types/categories'

export default defineEventHandler(async (event) => {
  const body = await readBody<CreateCategory>(event)

  if (!body.descriptions.length || !body.names.length) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Materials description and names required'
    })
  }

  const category = await CategoriesService.create(body)

  return { success: true, category }
})
