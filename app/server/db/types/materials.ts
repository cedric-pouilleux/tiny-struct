import { InferSelectModel, InferInsertModel } from 'drizzle-orm'
import {
  materials,
  materialNameTranslations,
  materialDescriptionTranslations
} from '~/server/db/schema/'

// Types SELECT (ceux qu'on lit depuis la DB)
export type Material = InferSelectModel<typeof materials>
export type MaterialNameTranslation = InferSelectModel<typeof materialNameTranslations>
export type MaterialDescriptionTranslation = InferSelectModel<
  typeof materialDescriptionTranslations
>

// Types INSERT (ceux qu'on insère dans la DB)
export type NewMaterial = InferInsertModel<typeof materials>
export type NewMaterialNameTranslation = InferInsertModel<typeof materialNameTranslations>
export type NewMaterialDescriptionTranslation = InferInsertModel<
  typeof materialDescriptionTranslations
>
