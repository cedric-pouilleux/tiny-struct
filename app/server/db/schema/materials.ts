import { pgTable, text, serial, integer } from 'drizzle-orm/pg-core'

export const materials = pgTable('items_materials', {
  id: serial('id').primaryKey()
})

export const materialNameTranslations = pgTable('materials_name_translations', {
  id: serial('id').primaryKey(),
  materialId: integer('material_id')
    .notNull()
    .references(() => materials.id, { onDelete: 'cascade' }),
  language: text('language').notNull(),
  name: text('name').notNull()
})

export const materialDescriptionTranslations = pgTable('materials_description_translations', {
  id: serial('id').primaryKey(),
  materialId: integer('material_id')
    .notNull()
    .references(() => materials.id, { onDelete: 'cascade' }),
  language: text('language').notNull(),
  description: text('description').notNull()
})
