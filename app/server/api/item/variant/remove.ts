import { db } from '~/server/db'
import { itemVariants } from '~/server/db/schema'
import { eq } from 'drizzle-orm'

export type ItemVariantRemoveResponse = { success: true }
export type ItemVariantRemovePayload = { variantId: number }

export default defineEventHandler(async (event) => {
  const query = getQuery<ItemVariantRemovePayload>(event)
  const { variantId } = query

  if (!variantId) {
    throw createError({ statusCode: 400, message: 'variantId is required' })
  }

  const existingVariant = await db
    .select()
    .from(itemVariants)
    .where(eq(itemVariants.id, Number(variantId)))
  if (!existingVariant.length) {
    throw createError({ statusCode: 404, message: 'Variant not found' })
  }

  await db.delete(itemVariants).where(eq(itemVariants.id, Number(variantId)))

  const response: ItemVariantRemoveResponse = {
    success: true
  }

  return response
})
