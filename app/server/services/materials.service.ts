import { MaterialsRepository } from '~/server/repositories/materials.repository'
import { CreateMaterial, MaterialWithTranslations } from '~/shared/types/materials'

export const MaterialsService = {
  async create(payload: CreateMaterial): Promise<number> {
    const materialId = await MaterialsRepository.insertMaterial()

    const names = payload.names.map((t) => ({
      materialId,
      language: t.language,
      name: t.name
    }))

    const descriptions = payload.descriptions.map((t) => ({
      materialId,
      language: t.language,
      description: t.description
    }))

    await MaterialsRepository.insertNameTranslations(names)
    await MaterialsRepository.insertDescriptionTranslations(descriptions)

    return materialId
  },

  async getAll(): Promise<MaterialWithTranslations[]> {
    const allMaterials = await MaterialsRepository.getAll()
    const allNames = await MaterialsRepository.getAllNameTranslations()
    const allDescriptions = await MaterialsRepository.getAllDescriptionTranslations()

    return allMaterials.map((material) => ({
      id: material.id,
      names: allNames.filter((n) => n.materialId === material.id),
      descriptions: allDescriptions.filter((d) => d.materialId === material.id)
    }))
  },

  async getOne(id: number): Promise<MaterialWithTranslations | undefined> {
    const material = await MaterialsRepository.getById(id)
    if (!material) return undefined

    const names = await MaterialsRepository.getNameTranslations(id)
    const descriptions = await MaterialsRepository.getDescriptionTranslations(id)

    return {
      id: material.id,
      names,
      descriptions
    }
  },

  async update(payload: CreateMaterial & { id: number }): Promise<number> {
    const { id, names, descriptions } = payload

    await MaterialsRepository.deleteTranslationsByMaterialId(id)
    await MaterialsRepository.insertNameTranslations(
      names.map((n) => ({
        materialId: id,
        language: n.language,
        name: n.name
      }))
    )
    await MaterialsRepository.insertDescriptionTranslations(
      descriptions.map((d) => ({
        materialId: id,
        language: d.language,
        description: d.description
      }))
    )

    return id
  },

  async remove(id: number): Promise<void> {
    await MaterialsRepository.deleteMaterial(id)
  }
}
