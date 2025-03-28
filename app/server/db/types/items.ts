import type { InferInsertModel, InferSelectModel } from 'drizzle-orm'
import { items, itemTranslationsName } from '../schema/items'

export type Item = InferSelectModel<typeof items>
export type NewItem = InferInsertModel<typeof items>

export type ItemTranslation = InferSelectModel<typeof itemTranslationsName>
export type NewItemTranslation = InferInsertModel<typeof itemTranslationsName>
