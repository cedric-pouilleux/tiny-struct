import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  dialect: 'postgresql',
  schema: './server/db/schema.ts',
  out: './server/db/migrations',
  dbCredentials: {
    database: process.env.POSTGRES_DB!,
    user: process.env.POSTGRES_USER,
    host: 'database',
    password: process.env.POSTGRES_PASSWORD,
    port: 5432,
    ssl: false
  }
})
