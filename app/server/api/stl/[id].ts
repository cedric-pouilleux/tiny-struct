import { defineEventHandler, createError } from 'h3'
import { join } from 'path'
import { createReadStream, existsSync } from 'fs'

export default defineEventHandler((event) => {
  const { id } = event.context.params // <-- Param d’URL /api/stl/[id]

  if (!id) {
    throw createError({ statusCode: 400, message: 'ID manquant' })
  }

  const filePath = join(process.cwd(), 'server/models', `${id}.stl`)

  if (!existsSync(filePath)) {
    throw createError({ statusCode: 404, message: 'Fichier non trouvé' })
  }

  return createReadStream(filePath)
})
