import * as schema from '@/drizzle/schema'
import { createClient } from '@libsql/client'
import { drizzle } from 'drizzle-orm/libsql'

console.log('process.env.TURSO_DB_URL', process.env.TURSO_DB_URL)
console.log('process.env.TURSO_DB_AUTH_TOKEN', process.env.TURSO_DB_AUTH_TOKEN)

const client = createClient({
  url: process.env.TURSO_DB_URL as string,
  authToken: process.env.TURSO_DB_AUTH_TOKEN as string,
})

export const db = drizzle(client, { schema, logger: true })
