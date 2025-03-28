import type {
  CreateMaterial,
  FormMaterial,
  MaterialWithTranslations
} from '~/shared/types/materials'

type MaterialResponse = {
  success: boolean
  id: number
}

// TODO => Maibe externalize this logic ?
function materialMapper(formMaterial: FormMaterial): CreateMaterial {
  return {
    names: Object.entries(formMaterial.names).map(([language, name]) => ({
      language,
      name
    })),
    descriptions: Object.entries(formMaterial.descriptions).map(([language, description]) => ({
      language,
      description
    }))
  }
}

export async function getMaterials(): Promise<MaterialWithTranslations[]> {
  const { data } = await $fetch<{ success: boolean; data: MaterialWithTranslations[] }>(
    '/api/materials'
  )
  return data
}

export async function addMaterial(payload: FormMaterial): Promise<number> {
  const mappedPayload = materialMapper(payload)
  const { id } = await $fetch<MaterialResponse>('/api/materials', {
    method: 'POST',
    body: mappedPayload
  })
  return id
}

export async function editMaterial(payload: FormMaterial): Promise<number> {
  const mappedPayload = materialMapper(payload)
  const { id } = await $fetch<MaterialResponse>(`/api/materials/${payload.id}`, {
    method: 'PUT',
    body: {
      ...mappedPayload,
      id: payload.id
    }
  })
  return id
}

export async function removeMaterial(materialId: number): Promise<number> {
  const { id } = await $fetch<MaterialResponse>(`/api/materials/${materialId}`, {
    method: 'DELETE'
  })
  return id
}
