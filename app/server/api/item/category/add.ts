import { db } from '~/server/db'
import {
  categories,
  type CategoryTranslationInsert,
  categoryTranslations
} from '~/server/db/schema'
import { createError } from 'h3'
import { eq } from 'drizzle-orm'

export type AddItemCategoryPayload = {
  translations?: {
    name: string
    language: string
  }[]
}

export default defineEventHandler(async (event) => {
  const body = await readBody<AddItemCategoryPayload>(event)
  const { translations } = body

  if (!translations?.length) {
    throw createError({ statusCode: 400, statusText: 'Category translations required' })
  }

  if (translations.some((translation) => !translation.name || !translation.language)) {
    throw createError({
      statusCode: 400,
      statusText: 'Each translation must have a name and language'
    })
  }

  const [createdCategory] = await db.insert(categories).values({}).returning()

  if (!createdCategory) {
    throw createError({ statusCode: 500, statusText: 'Failed to create category' })
  }

  const categoryId = createdCategory.id

  await db.insert(categoryTranslations).values(
    translations.map(
      (translation): CategoryTranslationInsert => ({
        categoryId,
        language: translation.language,
        name: translation.name
      })
    )
  )

  await db
    .select()
    .from(categoryTranslations)
    .where(eq(categoryTranslations.categoryId, categoryId))

  return categoryId
})
