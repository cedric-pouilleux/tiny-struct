import type { Scale } from '~/server/db/types/scales'

export type CreateScalePayload = Omit<Scale, 'id'>
export type UpdateScalePayload = Scale
