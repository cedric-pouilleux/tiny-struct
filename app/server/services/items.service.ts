import { ItemsRepository } from '@/server/repositories/items.repository'
import { CreateItemPayload, ItemWithTranslations } from '~/shared/types/items'

export const ItemsService = {
  async create(payload: CreateItemPayload): Promise<ItemWithTranslations> {
    const item = await ItemsRepository.insertItem(payload.categoryId ?? null)

    const translations = payload.translations.map((t) => ({
      itemId: item.id,
      language: t.language,
      name: t.name
    }))

    const insertedTranslations = await ItemsRepository.insertTranslations(translations)

    return {
      ...item,
      translations: insertedTranslations
    }
  },

  async getAll(): Promise<ItemWithTranslations[]> {
    const items = await ItemsRepository.getAll()
    const translations = await ItemsRepository.getAllTranslations()

    return items.map((item) => ({
      ...item,
      translations: translations.filter((t) => t.itemId === item.id)
    }))
  },

  async getOne(id: number): Promise<ItemWithTranslations | undefined> {
    const item = await ItemsRepository.getById(id)
    if (!item) return undefined

    const translations = await ItemsRepository.getTranslations(id)

    return {
      ...item,
      translations
    }
  }
}
