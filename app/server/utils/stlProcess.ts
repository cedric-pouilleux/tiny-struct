import { STLFileType } from '../api/_item/variant/add'
import { writeFile } from 'fs/promises'
import { join } from 'path'
import { slugify } from './slugify'

export async function stlProcess(file: File, name: string, version: STLFileType): Promise<string> {
  console.log(file)
  const buffer = Buffer.from(await file.arrayBuffer())
  const stlFilename = `${slugify(name)}_${version}.stl`
  const stlPath = join(process.cwd(), 'server/models', stlFilename)
  await writeFile(stlPath, buffer)
  return stlFilename
}
