import type { InferSelectModel, InferInsertModel } from 'drizzle-orm'
import {
  categories,
  categoryNameTranslations,
  categoryDescriptionTranslations
} from '../schema/categories'

// Types SELECT (ceux qu'on lit depuis la DB)
export type Category = InferSelectModel<typeof categories>
export type CategoryNameTranslation = InferSelectModel<typeof categoryNameTranslations>
export type CategoryDescriptionTranslation = InferSelectModel<
  typeof categoryDescriptionTranslations
>

// Types INSERT (ceux qu'on insère dans la DB)
export type NewCategory = InferInsertModel<typeof categories>
export type NewCategoryNameTranslation = InferInsertModel<typeof categoryNameTranslations>
export type NewCategoryDescriptionTranslation = InferInsertModel<
  typeof categoryDescriptionTranslations
>
