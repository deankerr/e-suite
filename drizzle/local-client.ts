import { createClient } from '@libsql/client'
import { config } from 'dotenv'
import { drizzle } from 'drizzle-orm/libsql'

config({ path: '.env.local' })

export const localClientCredentials = {
  url: process.env.LIBSQL_DATABASE_URL as string,
  authToken: process.env.LIBSQL_DATABASE_AUTH_TOKEN as string,
}

export function createLocalClient() {
  const client = createClient(localClientCredentials)
  return drizzle(client)
}
