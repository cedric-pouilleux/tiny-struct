import type {
  MaterialDescriptionTranslation,
  MaterialNameTranslation
} from '~/server/db/types/materials'

export type CreateMaterial = {
  names: Pick<MaterialNameTranslation, 'language' | 'name'>[]
  descriptions: Pick<MaterialDescriptionTranslation, 'language' | 'description'>[]
}

export type MaterialWithTranslations = CreateMaterial & {
  id: number
}

export type EditMaterial = Partial<CreateMaterial> & {
  id: number
}

export type FormMaterial = {
  id?: number
  descriptions: Record<string, string>
  names: Record<string, string>
}
