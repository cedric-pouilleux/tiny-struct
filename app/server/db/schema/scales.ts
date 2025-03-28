import { pgTable, text, serial, integer } from 'drizzle-orm/pg-core'

export const scales = pgTable('scales', {
  id: serial('id').primaryKey(),
  scale: text('scale').notNull().unique()
})

export const scaleDescriptionTranslations = pgTable('scale_description_translations', {
  id: serial('id').primaryKey(),
  categoryId: integer('scale_id')
    .notNull()
    .references(() => scales.id, { onDelete: 'cascade' }),
  language: text('language').notNull(),
  description: text('description').notNull()
})
