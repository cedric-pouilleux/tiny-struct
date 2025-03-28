import { pgTable, text, timestamp, serial, integer } from 'drizzle-orm/pg-core'
import { items } from './items'

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').unique().notNull(),
  picture: text('picture'),
  createdAt: timestamp('created_at').defaultNow().notNull()
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
