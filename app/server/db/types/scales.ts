import { scales } from '~/server/db/schema/'
import { InferSelectModel, InferInsertModel } from 'drizzle-orm'

export type Scale = InferSelectModel<typeof scales>
export type NewScale = InferInsertModel<typeof scales>
