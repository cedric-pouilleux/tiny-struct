import { db } from '~/server/db'
import { ItemVariant, itemVariants, itemVariantTranslations } from '~/server/db/schema'
import { and, eq } from 'drizzle-orm'
import { stlProcess } from '~/server/utils/stlProcess'

export type ItemVariantEditPayload = Partial<ItemVariant> & {
  id: number
  stlMasterFile?: File
  stlMoldFile?: File
  stlFinalFile?: File
  translations?: Record<string, string>
}

export type ItemVarianEditResponse = {
  variantId: number
}

export default defineEventHandler(async (event) => {
  const form = await readFormData(event)

  const id = Number(form.get('id'))
  const scaleId = Number(form.get('scaleId'))
  const price = form.get('price') as string
  const publish = form.get('publish') === 'true'
  const translationsJson = form.get('translations') as string
  const stlMasterFile = form.get('stlMasterFile') as File | null
  const stlMoldFile = form.get('stlMoldFile') as File | null
  const stlFinalFile = form.get('stlFinalFile') as File | null
  const translations: ItemVariantEditPayload['translations'] = translationsJson
    ? JSON.parse(translationsJson)
    : {}

  if (!id) {
    throw createError({ statusCode: 400, message: 'variantId is required' })
  }

  if (!translations?.en) {
    throw createError({ statusCode: 400, message: 'English translation is required' })
  }

  const existingVariant = await db
    .select()
    .from(itemVariants)
    .where(eq(itemVariants.id, Number(id)))

  if (!existingVariant.length) {
    throw createError({ statusCode: 404, message: 'Variant not found' })
  }

  const setObject = {
    scaleId: scaleId ?? existingVariant[0].scaleId,
    price: price ?? existingVariant[0].price,
    publish: publish ?? existingVariant[0].publish,
    stlMaster: existingVariant[0].stlMaster,
    stlMold: existingVariant[0].stlMold,
    stlFinal: existingVariant[0].stlFinal
  }

  console.log(stlMasterFile)
  console.log(stlFinalFile)
  console.log(stlMoldFile)

  // Fix translation set if existing
  if (stlMasterFile) {
    const stlMasterName = await stlProcess(stlMasterFile, translations.en, 'master')
    setObject.stlMaster = stlMasterName
  }
  if (stlFinalFile) {
    const stlFinalName = await stlProcess(stlFinalFile, translations.en, 'final')
    setObject.stlFinal = stlFinalName
  }
  if (stlMoldFile) {
    const stlMoldName = await stlProcess(stlMoldFile, translations.en, 'mold')
    setObject.stlMold = stlMoldName
  }

  await db
    .update(itemVariants)
    .set(setObject)
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
