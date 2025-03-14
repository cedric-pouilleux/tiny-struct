import { db } from '~/server/db'
import { items, itemVariants } from '~/server/db/schema'
import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { name, categoryId, variants } = body

  if (!name || !variants || !variants.length) {
    throw createError({ statusCode: 400, message: 'Name and at least one variant are required' })
  }

  const existing = await db.select().from(items).where(eq(items.name, name))

  if (existing.length) {
    throw createError({ statusCode: 400, message: 'Item already exists' })
  }

  const [newItem] = await db
    .insert(items)
    .values({
      name,
      categoryId
    })
    .returning()

  if (!newItem) {
    throw createError({ statusCode: 500, message: 'Failed to create item' })
  }

  // 2️⃣ Création des variantes associées
  const variantsData = variants.map((variant: any) => ({
    itemId: newItem.id,
    scaleId: variant.scaleId,
    description: variant.description,
    price: variant.price,
    stlFile: variant.stlFile
  }))

  await db.insert(itemVariants).values(variantsData)

  return { success: true, itemId: newItem.id }
})
