import { pgTable, text, serial, integer, uniqueIndex } from 'drizzle-orm/pg-core'

export const categories = pgTable('items_categories', {
  id: serial('id').primaryKey()
})

export const categoryNameTranslations = pgTable('categories_name_translations', {
  id: serial('id').primaryKey(),
  categoryId: integer('category_id')
    .notNull()
    .references(() => categories.id, { onDelete: 'cascade' }),
  language: text('language').notNull(),
  name: text('name').notNull()
})

export const categoryDescriptionTranslations = pgTable('categories_description_translations', {
  id: serial('id').primaryKey(),
  categoryId: integer('category_id')
    .notNull()
    .references(() => categories.id, { onDelete: 'cascade' }),
  language: text('language').notNull(),
  description: text('description').notNull()
})
