import { db } from '~/server/db'
import { type Scale, scales } from '~/server/db/schema'
import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const body = await readBody<Scale>(event)
  const { id, scale } = body

  if (!id) {
    throw createError({ statusCode: 400, message: 'ID is required' })
  }

  if (!scale) {
    throw createError({ statusCode: 400, message: 'Scale is required' })
  }

  const existing = await db.select().from(scales).where(eq(scales.id, id)).limit(1)
  if (!existing.length) {
    throw createError({ statusCode: 404, message: 'Scale not found' })
  }

  const [editeScale] = await db.update(scales).set({ scale }).where(eq(scales.id, id)).returning()

  if (!editeScale) {
    throw createError({ statusCode: 400, message: 'Failed to update scale' })
  }

  return editeScale.id
})
