import { db } from '~/server/db'
import { userItems } from '~/server/db/schema'
import { and, eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { userId, itemId, quantity = 1 } = body

  if (!userId || !itemId) {
    throw createError({ statusCode: 400, message: 'userId et itemId sont requis' })
  }

  // Vérifie si l'item est déjà dans le panier de l'utilisateur
  const existing = await db
    .select()
    .from(userItems)
    .where(and(eq(userItems.userId, userId), eq(userItems.itemId, itemId)))

  if (existing.length > 0) {
    // Mise à jour de la quantité
    await db
      .update(userItems)
      .set({ quantity: existing[0].quantity + quantity })
      .where(eq(userItems.id, existing[0].id))
  } else {
    // Ajout d'un nouvel item au panier
    await db.insert(userItems).values({
      userId,
      itemId,
      quantity
    })
  }

  return { success: true }
})
