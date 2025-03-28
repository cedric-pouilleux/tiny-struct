import {
  pgTable,
  text,
  timestamp,
  serial,
  integer,
  uniqueIndex,
  numeric,
  boolean
} from 'drizzle-orm/pg-core'
import { categories } from './categories'
import { scales } from './scales'
import { materials } from './materials'

export const items = pgTable('items', {
  id: serial('id').primaryKey(),
  categoryId: integer('category_id').references(() => categories.id, { onDelete: 'set null' }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
})

export const itemTranslationsName = pgTable(
  'item_translations_name',
  {
    id: serial('id').primaryKey(),
    itemId: integer('item_id')
      .notNull()
      .references(() => items.id, { onDelete: 'cascade' }),
    language: text('language').notNull(),
    name: text('name').notNull()
  },
  (table) => [uniqueIndex('item_language_unique_idx').on(table.itemId, table.language)]
)

export const itemVariants = pgTable('item_variants', {
  id: serial('id').primaryKey(),
  itemId: integer('item_id')
    .notNull()
    .references(() => items.id, { onDelete: 'cascade' }),
  scaleId: integer('scale_id')
    .notNull()
    .references(() => scales.id, { onDelete: 'restrict' }),
  createdAt: timestamp('created_at').defaultNow().notNull()
})

export const stlFiles = pgTable('stl_files', {
  id: serial('id').primaryKey(),
  variantId: integer('variant_id')
    .notNull()
    .references(() => itemVariants.id, { onDelete: 'cascade' }),
  type: text('type').notNull(),
  url: text('url').notNull()
})

export const variantDeclinations = pgTable('variant_declinations', {
  id: serial('id').primaryKey(),
  variantId: integer('variant_id')
    .notNull()
    .references(() => itemVariants.id, { onDelete: 'cascade' }),
  materialId: integer('material_id')
    .notNull()
    .references(() => materials.id, { onDelete: 'restrict' }),
  stlId: integer('stl_id')
    .notNull()
    .references(() => stlFiles.id, { onDelete: 'restrict' }),
  price: numeric('price', { precision: 10, scale: 2 }).notNull(),
  publish: boolean('publish').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull()
})

export const itemVariantDescriptionTranslations = pgTable('item_variant_description_translations', {
  id: serial('id').primaryKey(),
  variantId: integer('variant_id')
    .notNull()
    .references(() => itemVariants.id, { onDelete: 'cascade' }),
  language: text('language').notNull(),
  description: text('description').notNull()
})
