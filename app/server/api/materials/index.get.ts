import { MaterialsService } from '~/server/services/materials.service'

export default defineEventHandler(async () => {
  const materials = await MaterialsService.getAll()

  return {
    success: true,
    data: materials
  }
})
