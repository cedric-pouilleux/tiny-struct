import { defineEventHandler, readBody, createError } from 'h3'
import { db } from '~/server/db'
import { type Item, items, itemTranslations } from '~/server/db/schema'

export type ItemAddPayload = {
  categoryId: number
  translations: { language: string; name: string }[]
}

export default defineEventHandler(async (event) => {
  const body = await readBody<ItemAddPayload>(event)
  const { categoryId, translations } = body

  if (!categoryId || !translations?.length) {
    throw createError({
      statusCode: 400,
      message: 'categoryId & translations required'
    })
  }

  const [response]: Item[] = await db.insert(items).values({ categoryId }).returning()

  const translationData = translations.map((translation) => ({
    itemId: response.id,
    language: translation.language,
    name: translation.name
  }))

  await db.insert(itemTranslations).values(translationData)

  return response.id
})
