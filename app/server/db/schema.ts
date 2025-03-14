import type { InferInsertModel, InferSelectModel } from 'drizzle-orm'
import { pgTable, serial, text, timestamp, integer, numeric } from 'drizzle-orm/pg-core'

// Users
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').unique().notNull(),
  picture: text('picture'),
  createdAt: timestamp('created_at').defaultNow().notNull()
})

// Items Scales
export const scales = pgTable('scales', {
  id: serial('id').primaryKey(),
  scale: text('scale').notNull().unique()
})

// Items categories
export const categories = pgTable('items-categories', {
  id: serial('id').primaryKey()
})

export const categoryTranslations = pgTable('category_translations', {
  id: serial('id').primaryKey(),
  categoryId: integer('category_id')
    .notNull()
    .references(() => categories.id, { onDelete: 'cascade' }),
  language: text('language').notNull(),
  name: text('name').notNull()
})

// Items generics
export const items = pgTable('items', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  categoryId: integer('category_id').references(() => categories.id, { onDelete: 'set null' }),
  createdAt: timestamp('created_at').defaultNow().notNull()
})

// Items variations (avec échelle, prix et description)
export const itemVariants = pgTable('item_variants', {
  id: serial('id').primaryKey(),
  itemId: integer('item_id')
    .notNull()
    .references(() => items.id, { onDelete: 'cascade' }),
  scaleId: integer('scale_id')
    .notNull()
    .references(() => scales.id, { onDelete: 'restrict' }),
  description: text('description').notNull(),
  price: numeric('price', { precision: 10, scale: 2 }).notNull(),
  stlFile: text('stl_file').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull()
})

// shopping_cart
export const userItems = pgTable('shopping_cart', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  itemId: integer('item_id')
    .notNull()
    .references(() => items.id, { onDelete: 'cascade' }),
  quantity: integer('quantity').notNull().default(1),
  createdAt: timestamp('created_at').defaultNow().notNull()
})

export type CategoryWithTranslations = {
  id: number
  translations: Record<string, string>
}

export type Category = InferSelectModel<typeof categories>
export type CategoryInsert = InferInsertModel<typeof categories>
export type CategoryTranslation = InferSelectModel<typeof categoryTranslations>
export type CategoryTranslationInsert = InferInsertModel<typeof categoryTranslations>
export type Scale = InferSelectModel<typeof scales>
export type Item = InferSelectModel<typeof items>
export type ItemVariant = InferSelectModel<typeof itemVariants>
export type UserItem = InferSelectModel<typeof userItems>
export type User = InferSelectModel<typeof users>
