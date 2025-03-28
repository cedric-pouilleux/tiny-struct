export type CreateItemPayload = {
  categoryId?: number
  translations: {
    language: string
    name: string
  }[]
}

export type ItemWithTranslations = {
  id: number
  categoryId?: number | null
  createdAt: Date
  updatedAt: Date
  translations: {
    id?: number
    language: string
    name: string
  }[]
}
