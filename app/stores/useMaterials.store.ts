import {
  editMaterial,
  getMaterials,
  removeMaterial,
  addMaterial
} from '~/services/itemMaterialService'
import type { FormMaterial, MaterialWithTranslations } from '~/shared/types/materials'

export const useMaterialsStore = defineStore('materials', () => {
  const materials = ref<MaterialWithTranslations[]>([])

  const materialsWithRecordTranslation = computed<Required<FormMaterial>[]>(() =>
    materials.value.map((material) => ({
      id: material.id,
      names: material.names.reduce<Record<string, string>>((acc, { language, name }) => {
        acc[language] = name
        return acc
      }, {}),
      descriptions: material.descriptions.reduce<Record<string, string>>(
        (acc, { language, description }) => {
          acc[language] = description
          return acc
        },
        {}
      )
    }))
  )

  async function fetchMaterials(): Promise<void> {
    if (materials.value.length) return
    try {
      materials.value = await getMaterials()
    } catch (error: any) {
      console.error(error)
    }
  }

  async function refreshMaterials() {
    try {
      materials.value = await getMaterials()
    } catch (error: any) {
      console.error(error)
    }
  }

  async function add(payload: FormMaterial): Promise<number | void> {
    try {
      const editedId = await addMaterial(payload)
      await refreshMaterials()
      return editedId
    } catch (error: any) {
      console.error(error)
    }
  }

  async function edit(payload: Required<FormMaterial>): Promise<number | void> {
    try {
      const editedId = await editMaterial(payload)
      await refreshMaterials()
      return editedId
    } catch (error: any) {
      console.error(error)
    }
  }

  async function remove(id: number): Promise<number | void> {
    try {
      const removedId = await removeMaterial(id)
      await refreshMaterials()
      return removedId
    } catch (error: any) {
      console.error(error)
    }
  }

  return {
    materials,
    materialsWithRecordTranslation,
    fetchMaterials,
    refreshMaterials,
    edit,
    remove,
    add
  }
})
