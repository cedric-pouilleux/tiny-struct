import { pgTable, serial, text, timestamp, integer } from 'drizzle-orm/pg-core'

// users
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').unique().notNull(),
  picture: text('picture'),
  createdAt: timestamp('created_at').defaultNow().notNull()
})

export type User = typeof users.$inferSelect

// items
export const items = pgTable('items', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
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
