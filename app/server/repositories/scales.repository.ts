import { db } from '~/server/db'
import { scales } from '@/server/db/schema/scales'
import { eq } from 'drizzle-orm'
import type { Scale, NewScale } from '~/server/db/types/scales'

export const ScalesRepository = {
  async getById(id: number): Promise<Scale | undefined> {
    const [scale] = await db.select().from(scales).where(eq(scales.id, id))
    return scale
  },

  async getAll(): Promise<Scale[]> {
    return db.select().from(scales)
  },

  async insertScale(data: NewScale): Promise<number> {
    const [inserted] = await db.insert(scales).values(data).returning({ id: scales.id })
    return inserted.id
  },

  async updateScale(id: number, data: Partial<NewScale>): Promise<Scale | undefined> {
    const [updated] = await db.update(scales).set(data).where(eq(scales.id, id)).returning()
    return updated
  },

  async deleteScale(id: number) {
    return db.delete(scales).where(eq(scales.id, id))
  }
}
