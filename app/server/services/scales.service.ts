import { ScalesRepository } from '~/server/repositories/scales.repository'
import type { CreateScalePayload, UpdateScalePayload } from '~/shared/types/scales'
import { Scale } from '../db/types/scales'

export const ScalesService = {
  async create(payload: CreateScalePayload): Promise<number> {
    const id = await ScalesRepository.insertScale({ scale: payload.scale })
    return id
  },

  async update(payload: UpdateScalePayload): Promise<number | undefined> {
    const updated = await ScalesRepository.updateScale(payload.id, {
      scale: payload.scale
    })
    return updated?.id
  },

  async getAll(): Promise<Scale[]> {
    const all = await ScalesRepository.getAll()
    return all
  },

  async getOne(id: number): Promise<Scale | undefined> {
    const scale = await ScalesRepository.getById(id)
    return scale
  },

  async remove(id: number): Promise<void> {
    await ScalesRepository.deleteScale(id)
  }
}
