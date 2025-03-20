import { db } from '~/server/db'
import { categories, type Category, categoryTranslations } from '~/server/db/schema'

export type CategoryResponse = Category & {
  translations: Record<string, string>
}

export default defineEventHandler(async (event) => {
  const allCategories = await db.select().from(categories)
  const allTranslations = await db.select().from(categoryTranslations)

  const categoriesWithTranslations: CategoryResponse[] = allCategories.map((category) => ({
    id: category.id,
    translations: allTranslations
      .filter((t) => t.categoryId === category.id)
      .reduce(
        (acc, t) => {
          acc[t.language] = t.name
          return acc
        },
        {} as Record<string, string>
      )
  }))

  return categoriesWithTranslations
})
