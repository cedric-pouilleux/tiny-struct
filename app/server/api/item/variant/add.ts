import { defineEventHandler, readFormData, createError } from 'h3'
import { db } from '~/server/db'
import {
  items,
  type ItemVariant,
  itemVariants,
  itemVariantTranslations,
  scales
} from '~/server/db/schema'
import { eq } from 'drizzle-orm'
import { stlProcess } from '~/server/utils/stlProcess'
// import { generateRustFromStl } from '~/server/utils/generateRustFromStl'
// import { compileWasm } from '~/server/utils/compileWasm'

export type ItemVariantAddResponse = ItemVariant & {
  translations?: Record<string, string>
}

export type ItemVariantAddPayload = Omit<
  ItemVariant,
  'id' | 'createdAt' | 'stlFinal' | 'stlMold' | 'stlMaster'
> & {
  stlMasterFile: File
  stlMoldFile: File
  stlFinalFile: File
  translations: Record<string, string>
}

export type STLFileType = 'master' | 'mold' | 'final'

export default defineEventHandler(async (event) => {
  const form = await readFormData(event)

  const itemId = Number(form.get('itemId'))
  const scaleId = Number(form.get('scaleId'))
  const price = form.get('price') as string
  const publish = form.get('publish') === 'true'
  const translationsJson = form.get('translations') as string
  const stlMaster = form.get('stlMasterFile') as File
  const stlMold = form.get('stlMoldFile') as File
  const stlFinal = form.get('stlFinalFile') as File
  const translations: ItemVariantAddResponse['translations'] = translationsJson
    ? JSON.parse(translationsJson)
    : {}

  // TODO => Determine none required payload element
  if (!itemId || !scaleId || !price || !stlMaster || !stlMold || !stlFinal) {
    throw createError({
      statusCode: 400,
      statusMessage: 'itemId, scaleId, price and STL files required'
    })
  }

  if (!translations?.en) {
    throw createError({
      statusCode: 400,
      statusMessage: 'English translation is required'
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

  const masterStlName = await stlProcess(stlMaster, translations?.en, 'master')
  const stlMoldName = await stlProcess(stlMold, translations?.en, 'mold')
  const stlFinalName = await stlProcess(stlFinal, translations?.en, 'final')

  const [newVariant] = await db
    .insert(itemVariants)
    .values({
      itemId,
      scaleId,
      price,
      stlMaster: masterStlName,
      stlMold: stlMoldName,
      stlFinal: stlFinalName,
      publish
    })
    .returning()

  if (!newVariant) {
    throw createError({ statusCode: 500, message: 'Échec création variante' })
  }

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

  // try {
  //   const functionName = `get_model_${newVariant.id}`
  //   generateRustFromStl(stlFilename, functionName)
  //   await compileWasm()
  // } catch (err) {
  //   console.error(`❌ Erreur génération WASM :`, err)
  // }

  const itemVariantReturn: ItemVariantAddResponse = {
    ...newVariant,
    createdAt: new Date(newVariant.createdAt),
    translations
  }

  return itemVariantReturn
})
