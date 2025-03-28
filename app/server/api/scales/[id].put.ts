import { ScalesService } from '~/server/services/scales.service'

export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'))
  const body = await readBody<{ scale: string }>(event)
  return ScalesService.update({ id, ...body })
})
