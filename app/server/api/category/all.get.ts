import { db } from '~/server/db'
import { categories, categoryTranslations } from '~/server/db/schema'
import { sendError } from 'h3'

export default defineEventHandler(async (event) => {
  try {
    const allCategories = await db.select().from(categories)
    const allTranslations = await db.select().from(categoryTranslations)

    // Associer les traductions aux catégories
    const categoriesWithTranslations = allCategories.map((category) => ({
      id: category.id,
      translations: allTranslations
        .filter((t) => t.categoryId === category.id)
        .reduce(
          (acc, t) => {
            acc[t.language] = t.name
            return acc
          },
          {} as Record<string, string>
        ) // Initialise un objet vide {}
    }))

    return { categories: categoriesWithTranslations }
  } catch (error: any) {
    return sendError(event, error)
  }
})
