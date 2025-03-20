import { db } from '~/server/db'
import { scales } from '~/server/db/schema'
import { eq } from 'drizzle-orm'

export type ItemScaleAddPayload = {
  scale: string
}

export default defineEventHandler(async (event) => {
  const body = await readBody<ItemScaleAddPayload>(event)
  const { scale } = body

  if (!scale) {
    throw createError({ statusCode: 400, message: 'Scale is required' })
  }

  const existing = await db.select().from(scales).where(eq(scales.scale, scale))
  if (existing.length) {
    throw createError({ statusCode: 400, message: 'Scale already exists' })
  }

  const [addedScale] = await db.insert(scales).values({ scale }).returning()

  if (!addedScale) {
    throw createError({ statusCode: 500, message: 'Failed to create scale' })
  }

  return addedScale.id
})
