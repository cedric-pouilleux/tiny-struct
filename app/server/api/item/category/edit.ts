import { db } from '~/server/db'
import { categoryTranslations } from '~/server/db/schema'
import { eq, and } from 'drizzle-orm'
import { createError } from 'h3'

export type EditItemCategoryPayload = {
  id: number
  translations?: {
    name: string
    language: string
  }[]
}

export default defineEventHandler(async (event) => {
  const body = await readBody<EditItemCategoryPayload>(event)
  const { id, translations } = body

  if (!id) {
    throw createError({ statusCode: 400, statusText: 'Category ID is required' })
  }

  if (!translations || translations.length === 0) {
    throw createError({ statusCode: 400, statusText: 'Category translations required' })
  }

  if (translations.some((t) => !t.name || !t.language)) {
    throw createError({
      statusCode: 400,
      statusText: 'Each translation must have a name and language'
    })
  }

  const existingCategory = await db
    .select()
    .from(categoryTranslations)
    .where(eq(categoryTranslations.categoryId, id))
    .limit(1)

  if (existingCategory.length === 0) {
    throw createError({ statusCode: 404, statusText: 'Category not found' })
  }

  for (const translation of translations) {
    const existingTranslation = await db
      .select()
      .from(categoryTranslations)
      .where(
        and(
          eq(categoryTranslations.categoryId, id),
          eq(categoryTranslations.language, translation.language)
        )
      )
      .limit(1)

    if (existingTranslation.length > 0) {
      const updated = await db
        .update(categoryTranslations)
        .set({ name: translation.name })
        .where(
          and(
            eq(categoryTranslations.categoryId, id),
            eq(categoryTranslations.language, translation.language)
          )
        )
        .returning()

      if (updated.length === 0) {
        throw createError({ statusCode: 400, statusText: 'Failed to update translation' })
      }
    } else {
      await db.insert(categoryTranslations).values({
        categoryId: id,
        language: translation.language,
        name: translation.name
      })
    }
  }

  return id
})
