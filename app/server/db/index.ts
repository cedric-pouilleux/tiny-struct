import { drizzle } from 'drizzle-orm/node-postgres'
import pg from 'pg'
const { Pool } = pg

const pool = new Pool({
  host: `postgres_${process.env.ENV}`,
  port: Number(process.env.DB_PORT),
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB
})

export const db = drizzle(pool)
