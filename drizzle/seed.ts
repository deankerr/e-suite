import engineDataJson from '@/scripts/provider-models/engines.json'
import { createClient } from '@libsql/client'
import { drizzle } from 'drizzle-orm/libsql'
import { engines, vendors } from './schema'

const client = createClient({
  url: process.env.TURSO_DB_URL as string,
  authToken: process.env.TURSO_DB_AUTH_TOKEN as string,
})

const db = drizzle(client)

async function seed() {
  const storedVendors = await db
    .insert(vendors)
    .values([
      { id: 'openai', displayName: 'OpenAI', url: 'https://openai.com' },
      { id: 'openrouter', displayName: 'OpenRouter', url: 'https://openrouter.ai/' },
      { id: 'togetherai', displayName: 'Together.ai', url: 'https://together.ai/' },
      { id: 'replicate', displayName: 'Replicate', url: 'https://replicate.com/' },
      { id: 'fal', displayName: 'Fal', url: 'https://www.fal.ai/' },
    ])
    .returning()
    .all()

  console.log('Inserted', storedVendors.length, 'vendors')

  const engineData = engineDataJson.map((e) => ({
    ...e,
    isAvailable: true,
    stopTokens: e.stopTokens ? JSON.stringify(e.stopTokens) : undefined,
  }))

  const storedEngines = await db.insert(engines).values(engineData).returning().all()

  console.log('Inserted', storedEngines.length, 'engines')

  process.exit(0)
}

seed()
