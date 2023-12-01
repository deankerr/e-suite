import * as schema from '@/drizzle/schema'
import { createClient } from '@libsql/client'
import { drizzle } from 'drizzle-orm/libsql'

const client = createClient({
  url: process.env.TURSO_DB_URL as string,
  authToken: process.env.TURBO_DB_AUTH_TOKEN as string,
})

export const db = drizzle(client, { schema })
