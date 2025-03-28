import { db } from '@/server/db'
import {
  categories,
  categoryNameTranslations,
  categoryDescriptionTranslations
} from '@/server/db/schema/categories'
import { eq } from 'drizzle-orm'
import type {
  Category,
  CategoryDescriptionTranslation,
  CategoryNameTranslation,
  NewCategoryDescriptionTranslation,
  NewCategoryNameTranslation
} from '@/server/db/types/categories'

export const CategoriesRepository = {
  async getById(id: number): Promise<Category | undefined> {
    const [category] = await db.select().from(categories).where(eq(categories.id, id))
    return category
  },

  async getAll(): Promise<Category[]> {
    return db.select().from(categories)
  },

  async getAllNameTranslations(): Promise<CategoryNameTranslation[]> {
    return db.select().from(categoryNameTranslations)
  },

  async getAllDescriptionTranslations(): Promise<CategoryDescriptionTranslation[]> {
    return db.select().from(categoryDescriptionTranslations)
  },

  async getNameTranslations(categoryId: number): Promise<CategoryNameTranslation[]> {
    return db
      .select()
      .from(categoryNameTranslations)
      .where(eq(categoryNameTranslations.categoryId, categoryId))
  },

  async getDescriptionTranslations(categoryId: number): Promise<CategoryDescriptionTranslation[]> {
    return db
      .select()
      .from(categoryDescriptionTranslations)
      .where(eq(categoryDescriptionTranslations.categoryId, categoryId))
  },

  async insertCategory(): Promise<number> {
    const [inserted] = await db.insert(categories).values({}).returning({ id: categories.id })
    return inserted.id
  },

  async insertTranslations(data: NewCategoryNameTranslation[]) {
    return db.insert(categoryNameTranslations).values(data).returning()
  },

  async insertNameTranslations(data: NewCategoryNameTranslation[]) {
    return db.insert(categoryNameTranslations).values(data).returning()
  },

  async insertDescriptionTranslations(data: NewCategoryDescriptionTranslation[]) {
    return db.insert(categoryDescriptionTranslations).values(data).returning()
  },

  async deleteTranslationsByCategoryId(categoryId: number) {
    await db
      .delete(categoryNameTranslations)
      .where(eq(categoryNameTranslations.categoryId, categoryId))
    await db
      .delete(categoryDescriptionTranslations)
      .where(eq(categoryDescriptionTranslations.categoryId, categoryId))
  },

  async deleteCategory(id: number) {
    return db.delete(categories).where(eq(categories.id, id))
  }
}
