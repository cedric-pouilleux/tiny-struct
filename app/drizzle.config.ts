import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  dialect: 'postgresql',
  schema: './server/db/schema.ts',
  out: './server/db/migrations',
  dbCredentials: {
    database: process.env.POSTGRES_DB!,
    user: process.env.POSTGRES_USER,
    host: `postgres_${process.env.ENV}`,
    password: process.env.POSTGRES_PASSWORD,
    port: Number(process.env.DB_PORT),
    ssl: false
  }
})
