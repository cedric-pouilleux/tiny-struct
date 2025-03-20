import { type InferSelectModel } from 'drizzle-orm'
import { db } from '~/server/db'
import {
  items,
  itemVariants,
  itemTranslations,
  itemVariantTranslations,
  categories,
  categoryTranslations,
  scales,
  type Item
} from '~/server/db/schema'

export type ItemReponse = Item & {
  category: {
    id: number
    translations: Record<string, string>
  } | null
  translations: Record<string, string>
  variants: (InferSelectModel<typeof itemVariants> & {
    scale: string
    translations: Record<string, string>
  })[]
}

export default defineEventHandler(async () => {
  return await getItems()
})

async function getItems() {
  const allItems = await db.select().from(items)
  const allItemTranslations = await db.select().from(itemTranslations)
  const allVariants = await db.select().from(itemVariants)
  const allVariantTranslations = await db.select().from(itemVariantTranslations)
  const allCategories = await db.select().from(categories)
  const allCategoryTranslations = await db.select().from(categoryTranslations)
  const allScales = await db.select().from(scales)

  const categoryMap = new Map<number, { id: number; translations: Record<string, string> }>()

  allCategories.forEach((category) => {
    categoryMap.set(category.id, { id: category.id, translations: {} })
  })

  allCategoryTranslations.forEach((translation) => {
    if (categoryMap.has(translation.categoryId)) {
      categoryMap.get(translation.categoryId)!.translations[translation.language] = translation.name
    }
  })

  const scaleMap = new Map<number, string>()
  allScales.forEach((scale) => {
    scaleMap.set(scale.id, scale.scale)
  })

  const itemMap = new Map<number, ItemReponse>()

  allItems.forEach((item) => {
    const foundCategory = item.categoryId ? categoryMap.get(item.categoryId) : null
    itemMap.set(item.id, {
      ...item,
      category: foundCategory ? { ...foundCategory } : null,
      translations: {},
      variants: []
    })
  })

  allItemTranslations.forEach((t) => {
    if (itemMap.has(t.itemId)) {
      itemMap.get(t.itemId)!.translations[t.language] = t.name
    }
  })

  const variantMap = new Map<number, any>()

  allVariants.forEach((variant) => {
    if (itemMap.has(variant.itemId)) {
      const formattedVariant = {
        ...variant,
        scale: scaleMap.get(variant.scaleId)!,
        translations: {}
      }
      itemMap.get(variant.itemId)!.variants.push(formattedVariant)
      variantMap.set(variant.id, formattedVariant)
    }
  })

  allVariantTranslations.forEach((t) => {
    if (variantMap.has(t.variantId)) {
      variantMap.get(t.variantId)!.translations[t.language] = t.description
    }
  })

  const response: ItemReponse[] = Array.from(itemMap.values())

  return response
}
