import type { Config } from 'drizzle-kit'
import { localClientCredentials } from './drizzle/localClient'

export default {
  schema: './drizzle/schema.ts',
  out: './drizzle/migrations',
  driver: 'turso',
  dbCredentials: localClientCredentials,
} satisfies Config
