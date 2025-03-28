import { CategoriesService } from '~/server/services/categories.service'

export default defineEventHandler(async () => {
  const result = await CategoriesService.getAll()

  return {
    success: true,
    data: result
  }
})
