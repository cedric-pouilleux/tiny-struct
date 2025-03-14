import { db } from '~/server/db'
import { categories } from '~/server/db/schema'
import { eq } from 'drizzle-orm'
import { createError, sendError } from 'h3'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { id } = body

    if (!id) {
      throw createError({ statusCode: 400, message: 'Category Id required' })
    }

    const existing = await db.select().from(categories).where(eq(categories.id, id))

    if (!existing.length) {
      throw createError({ statusCode: 404, message: 'Category not found' })
    }

    await db.delete(categories).where(eq(categories.id, id))

    return { success: true, message: 'Category deleted', category: existing[0] }
  } catch (error: any) {
    return sendError(event, error)
  }
})
