import { db } from '~/server/db'
import { scales } from '~/server/db/schema'
import { eq } from 'drizzle-orm'
import { createError } from 'h3'

export type ItemScaleDeletePayload = {
  id: number
}

export default defineEventHandler(async (event) => {
  const body = await readBody<ItemScaleDeletePayload>(event)
  const { id } = body

  if (!id) {
    throw createError({ statusCode: 400, message: 'Scale Id required' })
  }

  const [scale] = await db.select().from(scales).where(eq(scales.id, id))

  if (!scale) {
    throw createError({ statusCode: 404, message: 'Scale not found' })
  }

  await db.delete(scales).where(eq(scales.id, id))

  return scale.id
})
