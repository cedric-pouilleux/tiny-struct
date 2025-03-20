import { db } from '~/server/db'
import { users } from '~/server/db/schema'
import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  let user = await db.select().from(users).where(eq(users.email, body.email))

  if (!user.length) {
    user = await db
      .insert(users)
      .values({
        name: body.name,
        email: body.email,
        picture: body.picture
      })
      .returning()
  }

  return { success: true, user }
})
