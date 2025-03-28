import { CategoriesRepository } from '~/server/repositories/categories.repository'
import { CategoryWithTranslations, CreateCategory } from '~/shared/types/categories'

export const CategoriesService = {
  //Create category
  async create(payload: CreateCategory): Promise<number> {
    const categoryId = await CategoriesRepository.insertCategory()

    const names = payload.names.map((t) => ({
      categoryId,
      language: t.language,
      name: t.name
    }))

    const descriptions = payload.descriptions.map((t) => ({
      categoryId,
      language: t.language,
      description: t.description
    }))

    await CategoriesRepository.insertNameTranslations(names)
    await CategoriesRepository.insertDescriptionTranslations(descriptions)

    return categoryId
  },

  // Update category
  async update(payload: CreateCategory & { id: number }): Promise<number> {
    const { id, names, descriptions } = payload

    await CategoriesRepository.deleteTranslationsByCategoryId(id)
    await CategoriesRepository.insertNameTranslations(
      names.map((n) => ({
        categoryId: id,
        language: n.language,
        name: n.name
      }))
    )
    await CategoriesRepository.insertDescriptionTranslations(
      descriptions.map((d) => ({
        categoryId: id,
        language: d.language,
        description: d.description
      }))
    )

    return id
  },

  //Get all categories
  async getAll(): Promise<CategoryWithTranslations[]> {
    const allCategories = await CategoriesRepository.getAll()
    const allNames = await CategoriesRepository.getAllNameTranslations()
    const allDescriptions = await CategoriesRepository.getAllDescriptionTranslations()

    return allCategories.map((category) => ({
      id: category.id,
      names: allNames.filter((n) => n.categoryId === category.id),
      descriptions: allDescriptions.filter((d) => d.categoryId === category.id)
    }))
  },

  //Get category by id
  async getOne(id: number): Promise<CategoryWithTranslations | undefined> {
    const material = await CategoriesRepository.getById(id)
    if (!material) return undefined

    const names = await CategoriesRepository.getNameTranslations(id)
    const descriptions = await CategoriesRepository.getDescriptionTranslations(id)

    return {
      id: material.id,
      names,
      descriptions
    }
  },

  async remove(id: number): Promise<void> {
    await CategoriesRepository.deleteCategory(id)
  }
}
