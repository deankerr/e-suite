import { createClient } from '@libsql/client'
import { config } from 'dotenv'
import { drizzle } from 'drizzle-orm/libsql'
import { parseEnv, z } from 'znv'

config({ path: '.env.local' })

const ENV = parseEnv(process.env, {
  LIBSQL_DATABASE_URL: z.string(),
  LIBSQL_DATABASE_AUTH_TOKEN: z.string(),
})

export const localClientCredentials = {
  url: ENV.LIBSQL_DATABASE_URL as string,
  authToken: ENV.LIBSQL_DATABASE_AUTH_TOKEN as string,
}

export function createLocalClient() {
  const client = createClient(localClientCredentials)
  return drizzle(client)
}
