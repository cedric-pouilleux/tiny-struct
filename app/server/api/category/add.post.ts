import { db } from '~/server/db'
import {
  categories,
  type CategoryTranslationInsert,
  categoryTranslations
} from '~/server/db/schema'
import { eq, and } from 'drizzle-orm'
import { createError, sendError } from 'h3'

type Translation = {
  name: string
  language: string
}

type RequestBody = {
  id?: number
  translations?: Translation[]
}

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody<RequestBody>(event)
    const { id, translations } = body

    if (!translations || translations.length === 0) {
      throw createError({ statusCode: 400, statusText: 'Category translations required' })
    }

    if (translations.some((t) => !t.name || !t.language)) {
      throw createError({
        statusCode: 400,
        statusText: 'Each translation must have a name and language'
      })
    }

    let categoryId = id

    if (categoryId) {
      const existingCategory = await db
        .select()
        .from(categories)
        .where(eq(categories.id, categoryId))
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
              eq(categoryTranslations.categoryId, categoryId),
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
                eq(categoryTranslations.categoryId, categoryId),
                eq(categoryTranslations.language, translation.language)
              )
            )
            .returning()

          if (updated.length === 0) {
            throw createError({ statusCode: 400, statusText: 'Failed to update translation' })
          }
        } else {
          await db.insert(categoryTranslations).values({
            categoryId,
            language: translation.language,
            name: translation.name
          })
        }
      }
    } else {
      const newCategory = await db.insert(categories).values({}).returning()

      if (newCategory.length === 0) {
        throw createError({ statusCode: 500, statusText: 'Failed to create category' })
      }

      categoryId = newCategory[0].id

      if (newCategory.length === 0) {
        throw createError({ statusCode: 500, statusText: 'Failed to create category' })
      }

      categoryId = newCategory[0].id

      await db.insert(categoryTranslations).values(
        translations.map(
          (t): CategoryTranslationInsert => ({
            categoryId: categoryId as number,
            language: t.language,
            name: t.name
          })
        )
      )
    }

    const category = await db
      .select()
      .from(categories)
      .where(eq(categories.id, categoryId))
      .limit(1)

    if (category.length === 0) {
      throw createError({ statusCode: 500, statusText: 'Category retrieval failed' })
    }

    const categoryTranslationsData = await db
      .select()
      .from(categoryTranslations)
      .where(eq(categoryTranslations.categoryId, categoryId))

    const formattedTranslations = categoryTranslationsData.reduce<Record<string, string>>(
      (acc, t) => {
        acc[t.language] = t.name
        return acc
      },
      {}
    )

    return {
      message: categoryId === id ? 'Category updated' : 'Category created',
      category: {
        id: category[0].id,
        translations: formattedTranslations
      }
    }
  } catch (error: any) {
    return sendError(event, error)
  }
})
