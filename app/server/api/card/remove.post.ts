import { db } from '~/server/db'
import { userItems } from '~/server/db/schema'
import { and, eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { userId, itemId } = body

  if (!userId || !itemId) {
    throw createError({ statusCode: 400, message: 'userId et itemId sont requis' })
  }

  // Supprime l'item du panier
  await db.delete(userItems).where(and(eq(userItems.userId, userId), eq(userItems.itemId, itemId)))

  return { success: true }
})
