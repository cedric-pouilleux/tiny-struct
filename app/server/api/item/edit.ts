import { defineEventHandler, readBody, createError } from 'h3'
import { db } from '~/server/db'
import { items, itemTranslations } from '~/server/db/schema'
import { eq } from 'drizzle-orm'

export type ItemEditPayload = {
  id: number
  categoryId?: number
  translations?: {
    language: string
    name: string
  }[]
}

export default defineEventHandler(async (event) => {
  const body = await readBody<ItemEditPayload>(event)
  const { id, categoryId, translations } = body as {
    id: number
    categoryId?: number
    translations?: { language: string; name: string }[]
  }

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Id is required'
    })
  }

  const [existingItem] = await db.select().from(items).where(eq(items.id, id))

  if (!existingItem) {
    throw createError({
      statusCode: 404,
      message: 'Item not found'
    })
  }

  if (categoryId) {
    await db.update(items).set({ categoryId }).where(eq(items.id, id))
  }

  if (translations?.length) {
    for (const translation of translations) {
      await db
        .insert(itemTranslations)
        .values({ itemId: id, language: translation.language, name: translation.name })
        .onConflictDoUpdate({
          target: [itemTranslations.itemId, itemTranslations.language],
          set: { name: translation.name }
        })
    }
  }

  return existingItem.id
})
