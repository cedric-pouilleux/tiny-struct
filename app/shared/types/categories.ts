import type {
  CategoryDescriptionTranslation,
  CategoryNameTranslation
} from '~/server/db/types/categories'

export type CreateCategory = {
  names: Pick<CategoryNameTranslation, 'language' | 'name'>[]
  descriptions: Pick<CategoryDescriptionTranslation, 'language' | 'description'>[]
}

export type CategoryWithTranslations = CreateCategory & {
  id: number
}

export type EditCategories = Partial<CreateCategory> & {
  id: number
}

export type FormCategory = {
  id?: number
  descriptions: Record<string, string>
  names: Record<string, string>
}
