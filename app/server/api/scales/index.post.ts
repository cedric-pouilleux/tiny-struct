import { NewScale } from '~/server/db/types/scales'
import { ScalesService } from '~/server/services/scales.service'

export default defineEventHandler(async (event) => {
  const body = await readBody<NewScale>(event)
  return ScalesService.create(body)
})
