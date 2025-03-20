import { db } from '~/server/db'
import { scales } from '~/server/db/schema'

export default defineEventHandler(async () => {
  const fetchedScales = await db.select().from(scales)
  return fetchedScales
})
