import { ScalesService } from '~/server/services/scales.service'

export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'))
  return ScalesService.getOne(id)
})
