import { db } from '~/server/db'
import {
  materials,
  materialNameTranslations,
  materialDescriptionTranslations
} from '~/server/db/schema/'
import { eq } from 'drizzle-orm'
import type {
  Material,
  MaterialNameTranslation,
  MaterialDescriptionTranslation,
  NewMaterialNameTranslation,
  NewMaterialDescriptionTranslation
} from '~/server/db/types/materials'

export const MaterialsRepository = {
  async getById(id: number): Promise<Material | undefined> {
    const [material] = await db.select().from(materials).where(eq(materials.id, id))
    return material
  },

  async getAll(): Promise<Material[]> {
    return db.select().from(materials)
  },

  async getAllNameTranslations(): Promise<MaterialNameTranslation[]> {
    return db.select().from(materialNameTranslations)
  },

  async getAllDescriptionTranslations(): Promise<MaterialDescriptionTranslation[]> {
    return db.select().from(materialDescriptionTranslations)
  },

  async getNameTranslations(materialId: number): Promise<MaterialNameTranslation[]> {
    return db
      .select()
      .from(materialNameTranslations)
      .where(eq(materialNameTranslations.materialId, materialId))
  },

  async getDescriptionTranslations(materialId: number): Promise<MaterialDescriptionTranslation[]> {
    return db
      .select()
      .from(materialDescriptionTranslations)
      .where(eq(materialDescriptionTranslations.materialId, materialId))
  },

  async insertMaterial(): Promise<number> {
    const [inserted] = await db.insert(materials).values({}).returning({ id: materials.id })
    return inserted.id
  },

  async insertNameTranslations(data: NewMaterialNameTranslation[]) {
    return db.insert(materialNameTranslations).values(data).returning()
  },

  async insertDescriptionTranslations(data: NewMaterialDescriptionTranslation[]) {
    return db.insert(materialDescriptionTranslations).values(data).returning()
  },

  async deleteMaterial(id: number): Promise<number> {
    const [deleted] = await db
      .delete(materials)
      .where(eq(materials.id, id))
      .returning({ id: materials.id })
    return deleted.id
  },

  async deleteNameTranslation(id: number) {
    return db.delete(materialNameTranslations).where(eq(materialNameTranslations.id, id))
  },

  async deleteDescriptionTranslation(id: number) {
    return db
      .delete(materialDescriptionTranslations)
      .where(eq(materialDescriptionTranslations.id, id))
  },

  async deleteTranslationsByMaterialId(materialId: number) {
    await db
      .delete(materialNameTranslations)
      .where(eq(materialNameTranslations.materialId, materialId))
    await db
      .delete(materialDescriptionTranslations)
      .where(eq(materialDescriptionTranslations.materialId, materialId))
  }
}
