import { db } from '~/server/db'
import { userItems, items } from '~/server/db/schema'
import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const userId = Number(query.userId)

  if (!userId) {
    throw createError({ statusCode: 400, message: 'userId est requis' })
  }

  const cart = await db
    .select({
      id: userItems.id,
      quantity: userItems.quantity,
      item: {
        id: items.id,
        name: items.name
      }
    })
    .from(userItems)
    .innerJoin(items, eq(userItems.itemId, items.id))
    .where(eq(userItems.userId, userId))

  return cart
})
