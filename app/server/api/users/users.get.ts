import { db } from '~/server/db'
import { users } from '~/server/db/schema'

export default defineEventHandler(async (event) => {
  const allUsers = await db.select().from(users)
  return allUsers
})
