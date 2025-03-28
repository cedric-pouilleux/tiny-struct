import { ScalesService } from '~/server/services/scales.service'

export default defineEventHandler(async () => {
  return ScalesService.getAll()
})
