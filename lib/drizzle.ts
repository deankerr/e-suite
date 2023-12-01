import * as schema from '@/drizzle/schema'
import { createClient } from '@libsql/client'
import { drizzle } from 'drizzle-orm/libsql'
import { ENV } from './env'

const client = createClient({
  url: ENV.LIBSQL_DATABASE_URL,
  authToken: ENV.LIBSQL_DATABASE_AUTH_TOKEN,
})

export const db = drizzle(client, { schema })
