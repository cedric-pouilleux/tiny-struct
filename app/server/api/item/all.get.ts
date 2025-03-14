import { db } from '~/server/db'
import { items } from '~/server/db/schema'

export default defineEventHandler(async () => {
  const allItems = await db.select().from(items)
  return allItems
})
