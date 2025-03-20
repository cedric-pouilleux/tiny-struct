import { db } from '~/server/db'
import {
  items,
  type ItemVariant,
  itemVariants,
  itemVariantTranslations,
  scales
} from '~/server/db/schema'
import { eq } from 'drizzle-orm'

export type ItemVariantAddResponse = ItemVariant & {
  translations?: Record<string, string>
}

export type ItemVariantAddPayload = {
  itemId: number
  scaleId: number
  price: string
  stlFile: string
  publish?: boolean
  translations?: Record<string, string>
}

export default defineEventHandler(async (event) => {
  const body = await readBody<ItemVariantAddPayload>(event)
  const { itemId, scaleId, price, stlFile, publish, translations } = body

  if (!itemId || !scaleId || !price || !stlFile) {
    throw createError({
      statusCode: 400,
      message: 'itemId, scaleId, price, and stlFile are required'
    })
  }

  const existingItem = await db.select().from(items).where(eq(items.id, itemId))

  if (!existingItem.length) {
    throw createError({ statusCode: 404, message: 'Item not found' })
  }

  const existingScale = await db.select().from(scales).where(eq(scales.id, scaleId))

  if (!existingScale.length) {
    throw createError({ statusCode: 404, message: 'Scale not found' })
  }

  const [newVariant] = await db
    .insert(itemVariants)
    .values({
      itemId,
      scaleId,
      price,
      stlFile,
      publish: publish ?? false
    })
    .returning()

  if (!newVariant) {
    throw createError({ statusCode: 500, message: 'Failed to create variant' })
  }

  // TODO => Empty description is possible
  const config = useRuntimeConfig()
  const availableLocales = config.public.availableLocales as string[]

  if (translations && Object.keys(translations).length > 0) {
    const translationsData = Object.entries(translations)
      .filter(([_, description]) => description.trim())
      .map(([language, description]) => ({
        variantId: newVariant.id,
        language,
        description
      }))

    if (translationsData.length > 0) {
      await db.insert(itemVariantTranslations).values(translationsData)
    }
  }

  const itemVariantReturn: ItemVariantAddResponse = {
    ...newVariant,
    createdAt: new Date(newVariant.createdAt),
    translations
  }

  return itemVariantReturn
})
