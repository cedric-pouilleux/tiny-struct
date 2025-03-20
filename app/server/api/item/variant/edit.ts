import { db } from '~/server/db'
import { itemVariants, itemVariantTranslations } from '~/server/db/schema'
import { and, eq } from 'drizzle-orm'

export type ItemVarianEditPayload = {
  id: number
  scaleId?: number
  price?: string
  stlFile?: string
  publish?: boolean
  translations?: Record<string, string>
}

export type ItemVarianEditResponse = {
  variantId: number
}

export default defineEventHandler(async (event) => {
  const body = await readBody<ItemVarianEditPayload>(event)
  const { id, scaleId, price, stlFile, publish, translations } = body

  if (!id) {
    throw createError({ statusCode: 400, message: 'variantId is required' })
  }

  const existingVariant = await db
    .select()
    .from(itemVariants)
    .where(eq(itemVariants.id, Number(id)))

  if (!existingVariant.length) {
    throw createError({ statusCode: 404, message: 'Variant not found' })
  }

  await db
    .update(itemVariants)
    .set({
      scaleId: scaleId ?? existingVariant[0].scaleId,
      price: price ?? existingVariant[0].price,
      stlFile: stlFile ?? existingVariant[0].stlFile,
      publish: publish ?? existingVariant[0].publish
    })
    .where(eq(itemVariants.id, Number(id)))

  if (translations && Object.keys(translations).length > 0) {
    const existingTranslations = await db
      .select({ language: itemVariantTranslations.language })
      .from(itemVariantTranslations)
      .where(eq(itemVariantTranslations.variantId, Number(id)))

    const existingLanguages = new Set(existingTranslations.map((t) => t.language))

    const translationsData = Object.entries(translations)
      .filter(([_, description]) => description.trim())
      .map(([language, description]) => ({
        variantId: Number(id),
        language,
        description
      }))

    for (const t of translationsData) {
      if (existingLanguages.has(t.language)) {
        await db
          .update(itemVariantTranslations)
          .set({ description: t.description })
          .where(
            and(
              eq(itemVariantTranslations.variantId, Number(id)),
              eq(itemVariantTranslations.language, t.language)
            )
          )
      } else {
        await db.insert(itemVariantTranslations).values(t)
      }
    }
  }

  const response: ItemVarianEditResponse = {
    variantId: id
  }

  return response
})
