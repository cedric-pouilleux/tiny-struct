import { db } from '@/server/db'
import { items, itemTranslationsName } from '@/server/db/schema/items'
import { eq } from 'drizzle-orm'
import type { Item, ItemTranslation, NewItemTranslation } from '@/server/db/types/items'

export const ItemsRepository = {
  async insertItem(categoryId?: number | null): Promise<Item> {
    const [inserted] = await db.insert(items).values({ categoryId }).returning()
    return inserted
  },

  async insertTranslations(data: NewItemTranslation[]) {
    return db.insert(itemTranslationsName).values(data).returning()
  },

  async getAll(): Promise<Item[]> {
    return db.select().from(items)
  },

  async getAllTranslations(): Promise<ItemTranslation[]> {
    return db.select().from(itemTranslationsName)
  },

  async getById(id: number): Promise<Item | undefined> {
    const [item] = await db.select().from(items).where(eq(items.id, id))
    return item
  },

  async getTranslations(itemId: number): Promise<ItemTranslation[]> {
    return db.select().from(itemTranslationsName).where(eq(itemTranslationsName.itemId, itemId))
  }
}
