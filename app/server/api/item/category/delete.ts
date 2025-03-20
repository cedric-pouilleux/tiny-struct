import { db } from '~/server/db'
import { categories } from '~/server/db/schema'
import { eq } from 'drizzle-orm'
import { createError } from 'h3'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { id } = body

  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'Category Id required' })
  }

  const [existing] = await db.select().from(categories).where(eq(categories.id, id))

  if (!existing) {
    throw createError({ statusCode: 404, statusMessage: 'Category not found' })
  }

  await db.delete(categories).where(eq(categories.id, id))

  return existing.id
})
