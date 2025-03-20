import type { InferInsertModel, InferSelectModel } from 'drizzle-orm'
import {
  pgTable,
  serial,
  text,
  timestamp,
  integer,
  numeric,
  boolean,
  unique
} from 'drizzle-orm/pg-core'

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
export const categories = pgTable('items_categories', {
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
  categoryId: integer('category_id').references(() => categories.id, { onDelete: 'set null' }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
})

export const itemTranslations = pgTable(
  'item_translations',
  {
    id: serial('id').primaryKey(),
    itemId: integer('item_id')
      .notNull()
      .references(() => items.id, { onDelete: 'cascade' }),
    language: text('language').notNull(),
    name: text('name').notNull()
  },
  (table) => {
    return {
      uniqueItemLanguage: unique().on(table.itemId, table.language)
    }
  }
)

export const itemVariants = pgTable('item_variants', {
  id: serial('id').primaryKey(),
  itemId: integer('item_id')
    .notNull()
    .references(() => items.id, { onDelete: 'cascade' }),
  scaleId: integer('scale_id')
    .notNull()
    .references(() => scales.id, { onDelete: 'restrict' }),
  publish: boolean('publish').notNull(),
  price: numeric('price', { precision: 10, scale: 2 }).notNull(),
  stlFile: text('stl_file').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull()
})

export const itemVariantTranslations = pgTable('item_variant_translations', {
  id: serial('id').primaryKey(),
  variantId: integer('variant_id')
    .notNull()
    .references(() => itemVariants.id, { onDelete: 'cascade' }),
  language: text('language').notNull(),
  description: text('description').notNull()
})

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
export type ItemInsert = InferInsertModel<typeof items>
export type ItemTranslation = InferSelectModel<typeof itemTranslations>
export type ItemTranslationInsert = InferInsertModel<typeof itemTranslations>
export type ItemVariant = InferSelectModel<typeof itemVariants>
export type ItemVariantTranslation = InferSelectModel<typeof itemVariantTranslations>
export type ItemVariantTranslationInsert = InferInsertModel<typeof itemVariantTranslations>
export type UserItem = InferSelectModel<typeof userItems>
export type User = InferSelectModel<typeof users>

export type CategoryFull = Category & {
  translations: Record<string, string>
}

// Payloads
export type ItemVariantInsert = Partial<InferInsertModel<typeof itemVariants>> & {
  translations: Record<string, string>
}

export type EditableItem = Partial<Item> & {
  categoryId?: number
  translations: {
    language: string
    name?: string
  }[]
}
