import type { Config } from 'drizzle-kit'
import { localClientCredentials } from './drizzle/local-client'

export default {
  schema: './drizzle/database.schema.ts',
  out: './drizzle/migrations',
  driver: 'turso',
  dbCredentials: localClientCredentials,
} satisfies Config
